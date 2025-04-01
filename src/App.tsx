
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VeteranDashboard from "./pages/veteran/Dashboard";
import VeteranVitals from "./pages/veteran/Vitals";
import VeteranMedications from "./pages/veteran/Medications";
import VeteranSymptoms from "./pages/veteran/Symptoms";
import VeteranAppointments from "./pages/veteran/Appointments";
import VeteranMessages from "./pages/veteran/Messages";
import VeteranResources from "./pages/veteran/Resources";
import VeteranVideoCall from "./pages/veteran/VideoCall";
import ClinicianDashboard from "./pages/clinician/Dashboard";
import ClinicianPatient from "./pages/clinician/Patient";
import ClinicianAlerts from "./pages/clinician/Alerts";
import ClinicianTreatment from "./pages/clinician/Treatment";
import ClinicianBehavioralHealth from "./pages/clinician/BehavioralHealth";
import ClinicianAnalytics from "./pages/clinician/Analytics";
import ClinicianMessages from "./pages/clinician/Messages";
import ClinicianVista from "./pages/clinician/Vista";
import ClinicianVideoCall from "./pages/clinician/VideoCall";
import React from "react";

const App = () => {
  // Move the QueryClient instantiation inside the component
  const queryClient = React.useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Veteran Routes */}
              <Route path="/veteran/dashboard" element={<VeteranDashboard />} />
              <Route path="/veteran/vitals" element={<VeteranVitals />} />
              <Route path="/veteran/medications" element={<VeteranMedications />} />
              <Route path="/veteran/symptoms" element={<VeteranSymptoms />} />
              <Route path="/veteran/appointments" element={<VeteranAppointments />} />
              <Route path="/veteran/messages" element={<VeteranMessages />} />
              <Route path="/veteran/resources" element={<VeteranResources />} />
              <Route path="/veteran/video-call/:appointmentId" element={<VeteranVideoCall />} />
              
              {/* Clinician Routes */}
              <Route path="/clinician/dashboard" element={<ClinicianDashboard />} />
              <Route path="/clinician/patient/:id" element={<ClinicianPatient />} />
              <Route path="/clinician/alerts" element={<ClinicianAlerts />} />
              <Route path="/clinician/treatment" element={<ClinicianTreatment />} />
              <Route path="/clinician/behavioral-health" element={<ClinicianBehavioralHealth />} />
              <Route path="/clinician/analytics" element={<ClinicianAnalytics />} />
              <Route path="/clinician/messages" element={<ClinicianMessages />} />
              <Route path="/clinician/vista" element={<ClinicianVista />} />
              <Route path="/clinician/video-call/:appointmentId" element={<ClinicianVideoCall />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
