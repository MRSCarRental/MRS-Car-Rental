import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Car, Users, Calendar, CreditCard, CheckSquare, FileText, LogOut } from "lucide-react";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/crm/login");
  };

  const navItems = [
    { path: "/crm/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/crm/cars", icon: Car, label: "Cars" },
    { path: "/crm/customers", icon: Users, label: "Customers" },
    { path: "/crm/bookings", icon: Calendar, label: "Bookings" },
    { path: "/crm/payments", icon: CreditCard, label: "Payments" },
    { path: "/crm/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/crm/invoices", icon: FileText, label: "Invoices" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">CRM System</h1>
              <div className="hidden md:flex gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
