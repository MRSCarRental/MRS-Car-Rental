import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import ProtectedRoute from "@/components/crm/ProtectedRoute";
import CrmLayout from "@/components/crm/CrmLayout";
import CarDialog from "@/components/crm/CarDialog";
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

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load cars",
        variant: "destructive",
      });
      return;
    }

    setCars(data || []);
  };

  const handleStatusChange = async (carId: string, newStatus: "available" | "booked" | "maintenance") => {
    const { error } = await supabase
      .from("cars")
      .update({ status: newStatus })
      .eq("id", carId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update car status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Car status updated",
    });

    loadCars();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "booked":
        return "bg-yellow-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ProtectedRoute>
      <CrmLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Cars Management</h2>
              <p className="text-muted-foreground">Manage your vehicle fleet</p>
            </div>
            <Button onClick={() => { setSelectedCar(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Car
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <Card key={car.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{car.make} {car.model}</span>
                    <Badge className={getStatusColor(car.status)}>{car.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Year: {car.year}</p>
                  <p className="text-sm text-muted-foreground">Plate: {car.plate_number}</p>
                  <p className="text-sm font-semibold">₦{car.daily_rate}/day</p>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setSelectedCar(car); setDialogOpen(true); }}
                    >
                      Edit
                    </Button>
                    {car.status !== "available" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(car.id, "available")}
                      >
                        Mark Available
                      </Button>
                    )}
                    {car.status !== "maintenance" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(car.id, "maintenance")}
                      >
                        Maintenance
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <CarDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          car={selectedCar}
          onSuccess={loadCars}
        />
      </CrmLayout>
    </ProtectedRoute>
  );
}
