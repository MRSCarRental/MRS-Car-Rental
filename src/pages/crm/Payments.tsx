import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/crm/ProtectedRoute";
import CrmLayout from "@/components/crm/CrmLayout";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Payment = {
  id: string;
  amount: number;
  payment_date: string;
  status: string;
  method?: string;
  bookings: {
    customers: { name: string };
    cars: { make: string; model: string };
  };
};

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        bookings (
          customers (name),
          cars (make, model)
        )
      `)
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

  return (
    <ProtectedRoute>
      <CrmLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Payments</h2>
            <p className="text-muted-foreground">View all payment transactions</p>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.bookings.customers.name}
                    </TableCell>
                    <TableCell>
                      {payment.bookings.cars.make} {payment.bookings.cars.model}
                    </TableCell>
                    <TableCell>₦{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(payment.payment_date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{payment.method || "—"}</TableCell>
                    <TableCell>
                      <Badge className={payment.status === "paid" ? "bg-green-500" : "bg-yellow-500"}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CrmLayout>
    </ProtectedRoute>
  );
}
