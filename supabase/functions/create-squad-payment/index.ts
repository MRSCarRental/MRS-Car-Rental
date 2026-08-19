import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const SQUAD_SECRET_KEY = Deno.env.get("SQUAD_SECRET_KEY");
const SQUAD_BASE_URL = (Deno.env.get("SQUAD_BASE_URL") ?? "https://api-d.squadco.com").replace(/\/$/, "");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isIsoDate = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  if (!SQUAD_SECRET_KEY) {
    console.error("SQUAD_SECRET_KEY is not configured");
    return json({ error: "Online payment is not available right now. Please contact us on WhatsApp." }, 503);
  }

  let bookingId: string | null = null;
  let paymentId: string | null = null;

  try {
    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") return json({ error: "Invalid request." }, 400);

    const carId = str(payload.carId, 64);
    const startDate = payload.startDate;
    const endDate = payload.endDate;
    const customerName = str(payload.customerName, 120);
    const customerPhone = str(payload.customerPhone, 30);
    const customerEmail = str(payload.customerEmail, 160).toLowerCase();
    const pickupLocation = str(payload.pickupLocation, 200);
    const destination = str(payload.destination, 200);
    const serviceType = str(payload.serviceType, 100);
    const passengers = str(payload.passengers, 20);
    const specialRequests = str(payload.specialRequests, 500);
    const origin = str(payload.origin, 200);

    // ---- Validation -------------------------------------------------------
    if (!/^[0-9a-f-]{36}$/i.test(carId)) return json({ error: "Please select a car." }, 400);
    if (!customerName) return json({ error: "Full name is required." }, 400);
    if (!/^[0-9+\-\s()]{7,20}$/.test(customerPhone)) return json({ error: "A valid phone number is required." }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) return json({ error: "A valid email address is required." }, 400);
    if (!isIsoDate(startDate) || !isIsoDate(endDate)) return json({ error: "Please choose valid pickup and return dates." }, 400);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);

    if (start.getTime() < today.getTime()) return json({ error: "The pickup date cannot be in the past." }, 400);
    if (end.getTime() <= start.getTime()) return json({ error: "The return date must be after the pickup date." }, 400);

    const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
    if (days < 1 || days > 365) return json({ error: "Rental duration must be between 1 and 365 days." }, 400);

    // ---- Car lookup (server-side pricing) ---------------------------------
    const { data: car, error: carError } = await supabaseAdmin
      .from("cars")
      .select("id, make, model, daily_rate, status")
      .eq("id", carId)
      .maybeSingle();

    if (carError) throw carError;
    if (!car) return json({ error: "The selected car could not be found." }, 404);
    if (car.status === "maintenance") return json({ error: "The selected car is currently unavailable." }, 409);

    const { data: available, error: availError } = await supabaseAdmin.rpc("is_car_available", {
      _car_id: carId,
      _start_date: startDate,
      _end_date: endDate,
      _exclude_booking_id: null,
    });
    if (availError) throw availError;
    if (available !== true) {
      return json({ error: "This car is already booked for the selected dates. Please pick other dates or another car." }, 409);
    }

    const dailyRate = Number(car.daily_rate);
    if (!Number.isFinite(dailyRate) || dailyRate <= 0) {
      return json({ error: "Pricing for this car is unavailable. Please contact us." }, 409);
    }
    const totalPrice = Math.round(dailyRate * days * 100) / 100;

    // ---- Customer (find or create by phone) -------------------------------
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("phone", customerPhone)
      .maybeSingle();

    let customerId = existingCustomer?.id ?? null;
    if (customerId) {
      await supabaseAdmin
        .from("customers")
        .update({ name: customerName, email: customerEmail || null })
        .eq("id", customerId);
    } else {
      const { data: newCustomer, error: customerError } = await supabaseAdmin
        .from("customers")
        .insert({ name: customerName, phone: customerPhone, email: customerEmail || null })
        .select("id")
        .single();
      if (customerError) throw customerError;
      customerId = newCustomer.id;
    }

    // ---- Pending booking --------------------------------------------------
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        car_id: carId,
        customer_id: customerId,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        status: "pending",
      })
      .select("id")
      .single();
    if (bookingError) throw bookingError;
    bookingId = booking.id;

    // ---- Pending payment with unique provider reference -------------------
    const transactionRef = `MRS-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        booking_id: bookingId,
        amount: totalPrice,
        payment_date: new Date().toISOString().split("T")[0],
        status: "pending",
        method: "Squad (Online Payment)",
        provider: "squad",
        provider_reference: transactionRef,
        currency: "NGN",
      })
      .select("id")
      .single();
    if (paymentError) throw paymentError;
    paymentId = payment.id;

    // ---- Initiate Squad transaction ---------------------------------------
    const callbackUrl = `${origin || "https://mrscarrental.lovable.app"}/payment-status?reference=${encodeURIComponent(transactionRef)}`;

    const squadResponse = await fetch(`${SQUAD_BASE_URL}/transaction/initiate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SQUAD_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(totalPrice * 100), // kobo
        email: customerEmail,
        currency: "NGN",
        initiate_type: "inline",
        transaction_ref: transactionRef,
        customer_name: customerName,
        callback_url: callbackUrl,
        payment_channels: ["card", "bank", "ussd", "transfer"],
        metadata: {
          booking_id: bookingId,
          payment_id: paymentId,
          car: `${car.make} ${car.model}`,
          pickup_location: pickupLocation,
          destination,
          service_type: serviceType,
          passengers,
          special_requests: specialRequests,
          phone: customerPhone,
        },
      }),
    });

    const squadBody = await squadResponse.text();
    if (!squadResponse.ok) {
      console.error(`Squad initiate failed [${squadResponse.status}]: ${squadBody}`);
      throw new Error("squad_initiate_failed");
    }

    const parsed = JSON.parse(squadBody);
    const checkoutUrl = parsed?.data?.checkout_url;
    if (!checkoutUrl) {
      console.error("Squad initiate returned no checkout_url:", squadBody);
      throw new Error("squad_initiate_failed");
    }

    return json({
      checkoutUrl,
      reference: transactionRef,
      amount: totalPrice,
      days,
      bookingId,
    });
  } catch (err) {
    console.error("create-squad-payment error:", err instanceof Error ? err.message : err);

    // Roll back the placeholder rows so they never block availability
    try {
      if (paymentId) await supabaseAdmin.from("payments").delete().eq("id", paymentId);
      if (bookingId) await supabaseAdmin.from("bookings").delete().eq("id", bookingId);
    } catch (cleanupError) {
      console.error("Rollback failed:", cleanupError);
    }

    return json({ error: "We could not start your payment. Please try again or contact us on WhatsApp." }, 502);
  }
});