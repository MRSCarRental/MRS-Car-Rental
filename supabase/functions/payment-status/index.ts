import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    let reference = url.searchParams.get("reference") ?? "";
    if (!reference && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      reference = typeof body?.reference === "string" ? body.reference : "";
    }

    if (!/^MRS-\d+-[A-Z0-9]+$/.test(reference)) {
      return json({ error: "Invalid payment reference." }, 400);
    }

    const { data: payment, error } = await supabaseAdmin
      .from("payments")
      .select("status, amount, currency, booking_id, bookings (status, start_date, end_date, cars (make, model))")
      .eq("provider_reference", reference)
      .maybeSingle();

    if (error) throw error;
    if (!payment) return json({ error: "Payment not found." }, 404);

    const booking: any = payment.bookings ?? {};
    const car: any = booking?.cars ?? {};

    // Only non-sensitive, display-safe fields are returned.
    return json({
      reference,
      paymentStatus: payment.status,
      bookingStatus: booking?.status ?? null,
      amount: Number(payment.amount),
      currency: payment.currency ?? "NGN",
      startDate: booking?.start_date ?? null,
      endDate: booking?.end_date ?? null,
      car: car?.make ? `${car.make} ${car.model}` : null,
    });
  } catch (err) {
    console.error("payment-status error:", err instanceof Error ? err.message : err);
    return json({ error: "Unable to check payment status right now." }, 500);
  }
});