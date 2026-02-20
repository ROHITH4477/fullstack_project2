import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TouristDashboard from "./pages/TouristDashboard";
import HostDashboard from "./pages/HostDashboard";
import GuideDashboard from "./pages/GuideDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HomestayListing from "./pages/HomestayListing";
import HomestayDetail from "./pages/HomestayDetail";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Attractions from "./pages/Attractions";
import Guides from "./pages/Guides";
import Dining from "./pages/Dining";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tourist-dashboard" element={<TouristDashboard />} />
            <Route path="/host-dashboard" element={<HostDashboard />} />
            <Route path="/guide-dashboard" element={<GuideDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/homestays" element={<HomestayListing />} />
            <Route path="/homestay/:id" element={<HomestayDetail />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/attractions" element={<Attractions />} />
            <Route path="/dining" element={<Dining />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
