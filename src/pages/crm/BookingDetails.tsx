import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus } from "lucide-react";
import ProtectedRoute from "@/components/crm/ProtectedRoute";
import CrmLayout from "@/components/crm/CrmLayout";
import PaymentDialog from "@/components/crm/PaymentDialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Booking = {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  cars: { make: string; model: string; plate_number: string };
  customers: { name: string; email?: string; phone: string };
};

type Payment = {
  id: string;
  amount: number;
  payment_date: string;
  status: string;
  method?: string;
};

type Message = {
  id: string;
  message: string;
  created_at: string;
  profiles: { full_name?: string };
};

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadBookingDetails();
      loadPayments();
      loadMessages();
    }
  }, [id]);

  const loadBookingDetails = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        cars (make, model, plate_number),
        customers (name, email, phone)
      `)
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive",
      });
      return;
    }

    setBooking(data);
  };

  const loadPayments = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("booking_id", id)
      .order("payment_date", { ascending: false });

    setPayments(data || []);
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", id)
      .order("created_at", { ascending: true });

    if (data) {
      const messagesWithUsers = await Promise.all(
        data.map(async (msg) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", msg.user_id)
            .single();

          return {
            ...msg,
            profiles: { full_name: profile?.full_name },
          };
        })
      );
      setMessages(messagesWithUsers as Message[]);
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      booking_id: id,
      user_id: user.id,
      message: newMessage,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add message",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
    loadMessages();
    toast({
      title: "Success",
      description: "Message added",
    });
  };

  if (!booking) {
    return (
      <ProtectedRoute>
        <CrmLayout>
          <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
          </div>
        </CrmLayout>
      </ProtectedRoute>
    );
  }

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const balance = Number(booking.total_price) - totalPaid;

  return (
    <ProtectedRoute>
      <CrmLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/crm/bookings")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-3xl font-bold">Booking Details</h2>
              <p className="text-muted-foreground">Booking ID: {booking.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Car Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Vehicle:</strong> {booking.cars.make} {booking.cars.model}</p>
                <p><strong>Plate Number:</strong> {booking.cars.plate_number}</p>
                <p><strong>Start Date:</strong> {format(new Date(booking.start_date), "MMM dd, yyyy")}</p>
                <p><strong>End Date:</strong> {format(new Date(booking.end_date), "MMM dd, yyyy")}</p>
                <p><strong>Status:</strong> <Badge>{booking.status}</Badge></p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {booking.customers.name}</p>
                <p><strong>Email:</strong> {booking.customers.email || "—"}</p>
                <p><strong>Phone:</strong> {booking.customers.phone}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payments</CardTitle>
              <Button size="sm" onClick={() => setPaymentDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold">₦{booking.total_price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-xl font-bold text-green-600">₦{totalPaid.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-xl font-bold text-orange-600">₦{balance.toFixed(2)}</p>
                </div>
              </div>

              {payments.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold">Payment History</p>
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">₦{payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(payment.payment_date), "MMM dd, yyyy")} • {payment.method || "—"}
                        </p>
                      </div>
                      <Badge className={payment.status === "paid" ? "bg-green-500" : "bg-yellow-500"}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes & Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-3 bg-secondary rounded-lg">
                    <p className="text-sm font-medium">
                      {msg.profiles.full_name || "Staff"} • {format(new Date(msg.created_at), "MMM dd, yyyy HH:mm")}
                    </p>
                    <p className="text-sm mt-1">{msg.message}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note or message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={2}
                />
                <Button onClick={handleAddMessage}>Add</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          bookingId={id!}
          onSuccess={() => {
            loadPayments();
            loadBookingDetails();
          }}
        />
      </CrmLayout>
    </ProtectedRoute>
  );
}
