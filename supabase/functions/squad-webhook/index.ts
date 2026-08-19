import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const SQUAD_SECRET_KEY = Deno.env.get("SQUAD_SECRET_KEY");
const SQUAD_BASE_URL = (Deno.env.get("SQUAD_BASE_URL") ?? "https://api-d.squadco.com").replace(/\/$/, "");

/** HMAC SHA512 hex (uppercase) of the raw request body, per Squad signature validation docs. */
async function hmacSha512Hex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!SQUAD_SECRET_KEY) {
    console.error("SQUAD_SECRET_KEY is not configured");
    return new Response("Not configured", { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-squad-encrypted-body") ?? "";

  const expected = await hmacSha512Hex(SQUAD_SECRET_KEY, rawBody);
  if (!signature || !timingSafeEqual(signature.toUpperCase(), expected)) {
    console.error("Rejected webhook with invalid signature");
    return new Response("Invalid signature", { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  const body = event?.Body ?? event?.body ?? {};
  const reference: string | undefined = event?.TransactionRef ?? body?.transaction_ref;
  const eventName: string = event?.Event ?? event?.event ?? "";

  if (!reference) {
    console.error("Webhook missing transaction reference");
    return new Response("OK", { status: 200 });
  }

  try {
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("id, booking_id, amount, status, currency")
      .eq("provider_reference", reference)
      .maybeSingle();

    if (paymentError) throw paymentError;
    if (!payment) {
      console.error("No payment found for reference:", reference);
      return new Response("OK", { status: 200 });
    }

    // Idempotency: already settled, do nothing.
    if (payment.status === "paid" || payment.status === "refunded") {
      console.log("Duplicate webhook ignored for reference:", reference);
      return new Response("OK", { status: 200 });
    }

    // Re-verify server-side against Squad rather than trusting the payload alone.
    let status = String(body?.transaction_status ?? "").toLowerCase();
    let verifiedAmountKobo = Number(body?.amount ?? 0);
    let currency = String(body?.currency ?? "NGN").toUpperCase();
    let gatewayRef = body?.gateway_ref ?? null;

    const verifyResponse = await fetch(
      `${SQUAD_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${SQUAD_SECRET_KEY}` } },
    );
    const verifyText = await verifyResponse.text();
    if (verifyResponse.ok) {
      const verified = JSON.parse(verifyText)?.data;
      if (verified) {
        status = String(verified.transaction_status ?? status).toLowerCase();
        verifiedAmountKobo = Number(verified.transaction_amount ?? verifiedAmountKobo);
        currency = String(verified.transaction_currency_id ?? currency).toUpperCase();
        gatewayRef = verified.gateway_transaction_ref ?? gatewayRef;
      }
    } else {
      console.error(`Squad verify failed [${verifyResponse.status}]: ${verifyText}`);
      return new Response("Verification failed", { status: 500 });
    }

    const expectedKobo = Math.round(Number(payment.amount) * 100);
    const successful =
      status === "success" &&
      (eventName === "" || eventName.toLowerCase().includes("success")) &&
      currency === "NGN" &&
      verifiedAmountKobo >= expectedKobo;

    if (!successful) {
      console.log(
        `Payment not confirmed for ${reference} (status=${status}, amount=${verifiedAmountKobo}, expected=${expectedKobo}, currency=${currency})`,
      );
      await supabaseAdmin
        .from("payments")
        .update({ provider_transaction_id: gatewayRef })
        .eq("id", payment.id)
        .eq("status", "pending");
      return new Response("OK", { status: 200 });
    }

    // Conditional update keeps concurrent/replayed webhooks idempotent.
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("payments")
      .update({
        status: "paid",
        provider_transaction_id: gatewayRef,
        paid_at: new Date().toISOString(),
        payment_date: new Date().toISOString().split("T")[0],
        currency,
      })
      .eq("id", payment.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (updateError) throw updateError;
    if (!updated) {
      console.log("Payment already settled concurrently:", reference);
      return new Response("OK", { status: 200 });
    }

    // Confirm the booking (existing on_booking_confirmed trigger handles car status).
    const { error: bookingError } = await supabaseAdmin
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", payment.booking_id)
      .eq("status", "pending");
    if (bookingError) throw bookingError;

    // Best-effort confirmation email to staff; never fail the webhook on this.
    try {
      await notifyStaff(payment.booking_id, reference, Number(payment.amount));
    } catch (mailError) {
      console.error("Confirmation email failed:", mailError);
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("squad-webhook error:", err instanceof Error ? err.message : err);
    return new Response("Error", { status: 500 });
  }
});

async function notifyStaff(bookingId: string, reference: string, amount: number) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return;

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("start_date, end_date, total_price, customers (name, phone, email), cars (make, model)")
    .eq("id", bookingId)
    .maybeSingle();

  const customer: any = booking?.customers ?? {};
  const car: any = booking?.cars ?? {};

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "MRS Car Rental <noreply@mrscarrental.com>",
      to: ["info@mrscarrental.com"],
      subject: `Payment received - booking confirmed (${reference})`,
      html: `
        <h2>Online payment confirmed</h2>
        <p><strong>Reference:</strong> ${reference}</p>
        <p><strong>Amount:</strong> NGN ${amount.toLocaleString()}</p>
        <p><strong>Customer:</strong> ${customer.name ?? "-"} (${customer.phone ?? "-"} / ${customer.email ?? "-"})</p>
        <p><strong>Car:</strong> ${car.make ?? "-"} ${car.model ?? ""}</p>
        <p><strong>Dates:</strong> ${booking?.start_date ?? "-"} to ${booking?.end_date ?? "-"}</p>
      `,
    }),
  });
}