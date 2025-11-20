import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type BookingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

type Car = { id: string; make: string; model: string; daily_rate: number };
type Customer = { id: string; name: string };

export default function BookingDialog({ open, onOpenChange, onSuccess }: BookingDialogProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    car_id: "",
    customer_id: "",
    start_date: "",
    end_date: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  useEffect(() => {
    calculatePrice();
  }, [formData.car_id, formData.start_date, formData.end_date]);

  const loadData = async () => {
    const [carsData, customersData] = await Promise.all([
      supabase.from("cars").select("id, make, model, daily_rate").eq("status", "available"),
      supabase.from("customers").select("id, name"),
    ]);

    if (carsData.data) setCars(carsData.data);
    if (customersData.data) setCustomers(customersData.data);
  };

  const calculatePrice = () => {
    if (!formData.car_id || !formData.start_date || !formData.end_date) {
      setTotalPrice(0);
      return;
    }

    const car = cars.find((c) => c.id === formData.car_id);
    if (!car) return;

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days > 0) {
      setTotalPrice(days * car.daily_rate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        car_id: formData.car_id,
        customer_id: formData.customer_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_price: totalPrice,
        status: "confirmed",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking created successfully",
      });

      onSuccess();
      onOpenChange(false);
      setFormData({ car_id: "", customer_id: "", start_date: "", end_date: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="car">Car</Label>
            <Select value={formData.car_id} onValueChange={(value) => setFormData({ ...formData, car_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a car" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.make} {car.model} - ₦{car.daily_rate}/day
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select value={formData.customer_id} onValueChange={(value) => setFormData({ ...formData, customer_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Date</Label>
              <Input
                id="start"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Date</Label>
              <Input
                id="end"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          {totalPrice > 0 && (
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-2xl font-bold">₦{totalPrice.toFixed(2)}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || totalPrice === 0}>
              {loading ? "Creating..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
