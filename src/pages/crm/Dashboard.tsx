import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, Calendar, DollarSign, AlertCircle } from "lucide-react";
import ProtectedRoute from "@/components/crm/ProtectedRoute";
import CrmLayout from "@/components/crm/CrmLayout";

export default function CrmDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalCustomers: 0,
    activeBookings: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [carsData, customersData, bookingsData, paymentsData] = await Promise.all([
      supabase.from("cars").select("id, status", { count: "exact" }),
      supabase.from("customers").select("id", { count: "exact" }),
      supabase.from("bookings").select("id").eq("status", "confirmed"),
      supabase.from("payments").select("id").eq("status", "pending"),
    ]);

    setStats({
      totalCars: carsData.count || 0,
      availableCars: carsData.data?.filter((c) => c.status === "available").length || 0,
      totalCustomers: customersData.count || 0,
      activeBookings: bookingsData.data?.length || 0,
      pendingPayments: paymentsData.data?.length || 0,
    });
  };

  const statCards = [
    {
      title: "Total Cars",
      value: stats.totalCars,
      icon: Car,
      color: "text-blue-500",
    },
    {
      title: "Available Cars",
      value: stats.availableCars,
      icon: Car,
      color: "text-green-500",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings,
      icon: Calendar,
      color: "text-orange-500",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: AlertCircle,
      color: "text-red-500",
    },
  ];

  return (
    <ProtectedRoute>
      <CrmLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Overview of your car rental business</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CrmLayout>
    </ProtectedRoute>
  );
}
