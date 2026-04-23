import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Car, CheckSquare, CreditCard, FileText, LayoutDashboard, LogOut, Menu, Users } from "lucide-react";

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
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 md:gap-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open CRM navigation">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[84vw] max-w-xs px-0">
                  <SheetHeader className="px-6 pb-4 text-left">
                    <SheetTitle>CRM System</SheetTitle>
                    <SheetDescription>Open a section to manage bookings, clients, and invoices.</SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 px-3 pb-6">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <SheetClose asChild key={item.path}>
                          <Link to={item.path}>
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              className="h-11 w-full justify-start gap-3 px-4"
                            >
                              <Icon className="h-4 w-4" />
                              {item.label}
                            </Button>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="truncate text-lg font-bold md:text-xl">CRM System</h1>
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
            <Button variant="ghost" size="sm" onClick={handleLogout} className="shrink-0 gap-2 px-2 md:px-3">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-5 md:py-8">{children}</main>
    </div>
  );
}
