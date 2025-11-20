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
import { useToast } from "@/hooks/use-toast";

type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  plate_number: string;
  status: string;
  daily_rate: number;
  image_url?: string;
};

type CarDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: Car | null;
  onSuccess: () => void;
};

export default function CarDialog({ open, onOpenChange, car, onSuccess }: CarDialogProps) {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    plate_number: "",
    daily_rate: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (car) {
      setFormData({
        make: car.make,
        model: car.model,
        year: car.year,
        plate_number: car.plate_number,
        daily_rate: car.daily_rate.toString(),
        image_url: car.image_url || "",
      });
    } else {
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        plate_number: "",
        daily_rate: "",
        image_url: "",
      });
    }
  }, [car, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        plate_number: formData.plate_number,
        daily_rate: parseFloat(formData.daily_rate),
        image_url: formData.image_url || null,
      };

      if (car) {
        const { error } = await supabase
          .from("cars")
          .update(data)
          .eq("id", car.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("cars").insert(data);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: car ? "Car updated successfully" : "Car added successfully",
      });

      onSuccess();
      onOpenChange(false);
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
          <DialogTitle>{car ? "Edit Car" : "Add New Car"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plate">Plate Number</Label>
              <Input
                id="plate"
                value={formData.plate_number}
                onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Daily Rate (₦)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              value={formData.daily_rate}
              onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL (Optional)</Label>
            <Input
              id="image"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : car ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
