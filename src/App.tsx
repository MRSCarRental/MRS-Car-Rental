import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Inventory from "@/pages/Inventory";
import Faqs from "@/pages/Faqs";
import Contact from "@/pages/Contact";
import NotFound from "./pages/NotFound";
import CrmLogin from "./pages/crm/Login";
import CrmDashboard from "./pages/crm/Dashboard";
import Cars from "./pages/crm/Cars";
import Customers from "./pages/crm/Customers";
import CustomerDetails from "./pages/crm/CustomerDetails";
import Bookings from "./pages/crm/Bookings";
import BookingDetails from "./pages/crm/BookingDetails";
import Payments from "./pages/crm/Payments";
import Tasks from "./pages/crm/Tasks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
          <Route path="/faqs" element={<Layout><Faqs /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          
          {/* CRM Routes */}
          <Route path="/crm/login" element={<CrmLogin />} />
          <Route path="/crm/dashboard" element={<CrmDashboard />} />
          <Route path="/crm/cars" element={<Cars />} />
          <Route path="/crm/customers" element={<Customers />} />
          <Route path="/crm/customers/:id" element={<CustomerDetails />} />
          <Route path="/crm/bookings" element={<Bookings />} />
          <Route path="/crm/bookings/:id" element={<BookingDetails />} />
          <Route path="/crm/payments" element={<Payments />} />
          <Route path="/crm/tasks" element={<Tasks />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
