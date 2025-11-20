import { useState } from "react";
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

type PaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  onSuccess: () => void;
};

export default function PaymentDialog({ open, onOpenChange, bookingId, onSuccess }: PaymentDialogProps) {
  const [formData, setFormData] = useState({
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    status: "paid",
    method: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("payments").insert({
        booking_id: bookingId,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        status: formData.status as "paid" | "pending" | "refunded",
        method: formData.method || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment added successfully",
      });

      onSuccess();
      onOpenChange(false);
      setFormData({
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        status: "paid",
        method: "",
      });
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
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Payment Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Input
              id="method"
              placeholder="e.g., Cash, Transfer, Card"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
