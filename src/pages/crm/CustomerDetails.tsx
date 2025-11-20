import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/crm/ProtectedRoute";
import CrmLayout from "@/components/crm/CrmLayout";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
};

type Booking = {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  cars: { make: string; model: string };
};

type Payment = {
  id: string;
  amount: number;
  payment_date: string;
  status: string;
  bookings: { cars: { make: string; model: string } };
};

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadCustomerData();
      loadBookings();
      loadPayments();
    }
  }, [id]);

  const loadCustomerData = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load customer details",
        variant: "destructive",
      });
      return;
    }

    setCustomer(data);
  };

  const loadBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        cars (make, model)
      `)
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
      return;
    }

    setBookings(data || []);
  };

  const loadPayments = async () => {
    const bookingIds = bookings.map((b) => b.id);
    if (bookingIds.length === 0) return;

    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        bookings (cars (make, model))
      `)
      .in("booking_id", bookingIds)
      .order("payment_date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
      return;
    }

    setPayments(data || []);
  };

  if (!customer) {
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

  const totalSpent = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <ProtectedRoute>
      <CrmLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/crm/customers")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-3xl font-bold">{customer.name}</h2>
              <p className="text-muted-foreground">Customer Profile</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Email:</strong> {customer.email || "—"}</p>
                <p><strong>Phone:</strong> {customer.phone}</p>
                <p><strong>Address:</strong> {customer.address || "—"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Total Bookings:</strong> {bookings.length}</p>
                <p><strong>Total Spent:</strong> ₦{totalSpent.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.cars.make} {booking.cars.model}</TableCell>
                      <TableCell>{format(new Date(booking.start_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(new Date(booking.end_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>₦{booking.total_price.toFixed(2)}</TableCell>
                      <TableCell><Badge>{booking.status}</Badge></TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/crm/bookings/${booking.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.bookings.cars.make} {payment.bookings.cars.model}
                      </TableCell>
                      <TableCell>₦{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{format(new Date(payment.payment_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge className={payment.status === "paid" ? "bg-green-500" : "bg-yellow-500"}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </CrmLayout>
    </ProtectedRoute>
  );
}
