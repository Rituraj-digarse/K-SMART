import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { FarmerLogin, RoleSelection, StaffLogin, PortalPlaceholder } from "./pages/AuthPages";
import BookSlot from "./pages/BookSlot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/roles" element={<RoleSelection />} />
            <Route path="/login/farmer" element={<FarmerLogin />} />
            <Route path="/login/admin" element={<StaffLogin />} />
            <Route path="/login/officer" element={<StaffLogin />} />
            <Route path="/login/operator" element={<StaffLogin />} />
            <Route path="/farmer/book-slot" element={<BookSlot />} />
            <Route path="/portal/:role" element={<PortalPlaceholder />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
