import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  destination: string;
  carType: string;
  serviceType: string;
  date: string;
  time: string;
  passengers: string;
  specialRequests?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingNotificationRequest = await req.json();
    console.log("Received booking notification request for:", bookingData.customerEmail);

    // Send notification email to admin/staff only
    const adminEmailResponse = await resend.emails.send({
      from: "MRS Car Rental <onboarding@resend.dev>",
      to: ["info@mrscarrental.com"],
      subject: "New Booking Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">New Booking Alert</h1>
          <p>A new booking request has been received:</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h2 style="color: #991b1b; margin-top: 0;">Customer Information</h2>
            <p><strong>Name:</strong> ${bookingData.customerName}</p>
            <p><strong>Email:</strong> ${bookingData.customerEmail}</p>
            <p><strong>Phone:</strong> ${bookingData.customerPhone}</p>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
            <p><strong>Pickup Location:</strong> ${bookingData.pickupLocation}</p>
            <p><strong>Destination:</strong> ${bookingData.destination}</p>
            <p><strong>Car Type:</strong> ${bookingData.carType}</p>
            <p><strong>Service Type:</strong> ${bookingData.serviceType}</p>
            <p><strong>Date & Time:</strong> ${bookingData.date} at ${bookingData.time}</p>
            <p><strong>Passengers:</strong> ${bookingData.passengers}</p>
            ${bookingData.specialRequests ? `<p><strong>Special Requests:</strong> ${bookingData.specialRequests}</p>` : ''}
          </div>

          <p style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <strong>Action Required:</strong> Please contact the customer to confirm the booking.
          </p>
        </div>
      `,
    });

    console.log("Admin email response:", JSON.stringify(adminEmailResponse));

    // Throw if admin email failed
    if (adminEmailResponse.error) {
      throw new Error(`Admin email failed: ${adminEmailResponse.error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Booking request sent to admin successfully",
        adminEmailId: adminEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
