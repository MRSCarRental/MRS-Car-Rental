import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import ProtectedRoute from "@/components/crm/ProtectedRoute";
import CrmLayout from "@/components/crm/CrmLayout";
import CustomerDialog from "@/components/crm/CustomerDialog";
import { useToast } from "@/hooks/use-toast";

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
      return;
    }

    setCustomers(data || []);
  };

  return (
    <ProtectedRoute>
      <CrmLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Customers</h2>
              <p className="text-muted-foreground">Manage your customer database</p>
            </div>
            <Button onClick={() => { setSelectedCustomer(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email || "—"}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.address || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedCustomer(customer); setDialogOpen(true); }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/crm/customers/${customer.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <CustomerDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          customer={selectedCustomer}
          onSuccess={loadCustomers}
        />
      </CrmLayout>
    </ProtectedRoute>
  );
}
