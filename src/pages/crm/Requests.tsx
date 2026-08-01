import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/crm/ProtectedRoute";
import CrmLayout from "@/components/crm/CrmLayout";
import { format } from "date-fns";

type BookingRequest = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  pickup_location: string | null;
  destination: string | null;
  car_type: string | null;
  service_type: string | null;
  pickup_date: string | null;
  pickup_time: string | null;
  passengers: string | null;
  special_requests: string | null;
  email_sent: boolean;
  email_error: string | null;
  created_at: string;
};

export default function Requests() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("booking_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      setRequests((data as BookingRequest[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <ProtectedRoute>
      <CrmLayout>
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Booking Requests</h2>
            <p className="text-muted-foreground text-sm">
              Every booking submitted on the website, saved here even if the email notification fails.
            </p>
          </div>

          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && requests.length === 0 && (
            <p className="text-sm text-muted-foreground">No booking requests yet.</p>
          )}

          <div className="grid gap-4">
            {requests.map((r) => (
              <Card key={r.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                  <div>
                    <CardTitle className="text-lg">{r.customer_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(r.created_at), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                  <Badge variant={r.email_sent ? "default" : "destructive"}>
                    {r.email_sent ? "Email sent" : "Email failed"}
                  </Badge>
                </CardHeader>
                <CardContent className="grid gap-1 text-sm sm:grid-cols-2">
                  <p><strong>Phone:</strong> {r.customer_phone}</p>
                  <p><strong>Email:</strong> {r.customer_email || "—"}</p>
                  <p><strong>Pickup:</strong> {r.pickup_location || "—"}</p>
                  <p><strong>Destination:</strong> {r.destination || "—"}</p>
                  <p><strong>Car:</strong> {r.car_type || "—"}</p>
                  <p><strong>Service:</strong> {r.service_type || "—"}</p>
                  <p><strong>When:</strong> {r.pickup_date || "—"} {r.pickup_time || ""}</p>
                  <p><strong>Passengers:</strong> {r.passengers || "—"}</p>
                  {r.special_requests && (
                    <p className="sm:col-span-2"><strong>Requests:</strong> {r.special_requests}</p>
                  )}
                  {r.email_error && (
                    <p className="sm:col-span-2 text-destructive"><strong>Email error:</strong> {r.email_error}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CrmLayout>
    </ProtectedRoute>
  );
}