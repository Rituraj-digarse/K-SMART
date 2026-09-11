import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import { createRoot as mountRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AccessDenied from "./pages/AccessDenied";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RoleSelection = lazy(() => import("./pages/AuthPages").then((module) => ({ default: module.RoleSelection })));
const FarmerLogin = lazy(() => import("./pages/AuthPages").then((module) => ({ default: module.FarmerLogin })));
const StaffLogin = lazy(() => import("./pages/AuthPages").then((module) => ({ default: module.StaffLogin })));
const PortalPlaceholder = lazy(() => import("./pages/AuthPages").then((module) => ({ default: module.PortalPlaceholder })));
const BookSlot = lazy(() => import("./pages/BookSlot"));
const OfficerDashboard = lazy(() => import("./pages/StaffDashboards").then((module) => ({ default: module.OfficerDashboard })));
const OperatorDashboard = lazy(() => import("./pages/StaffDashboards").then((module) => ({ default: module.OperatorDashboard })));
const AdminDashboard = lazy(() => import("./pages/StaffDashboards").then((module) => ({ default: module.AdminDashboard })));

function LoadingShell() {
  return <div className="route-loading" role="status" aria-live="polite"><div className="skeleton skeleton-logo" /><div className="skeleton skeleton-heading" /><div className="skeleton skeleton-card" /><span>Loading e-Uparjan…</span></div>;
}

function AuthRoute({ page }: { page: "roles" | "farmer" | "staff" | "portal" }) {
  if (page === "roles") return <RoleSelection />;
  if (page === "farmer") return <FarmerLogin />;
  if (page === "staff") return <StaffLogin />;
  return <PortalPlaceholder />;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingShell />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/roles" element={<AuthRoute page="roles" />} />
              <Route path="/login/farmer" element={<AuthRoute page="farmer" />} />
              <Route path="/login/admin" element={<AuthRoute page="staff" />} />
              <Route path="/login/officer" element={<AuthRoute page="staff" />} />
              <Route path="/login/operator" element={<AuthRoute page="staff" />} />
              <Route path="/farmer/book-slot" element={<BookSlot />} />
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
              <Route path="/operator/dashboard" element={<OperatorDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/portal/:role" element={<AuthRoute page="portal" />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

mountRoot(document.getElementById("root")!).render(<App />);
