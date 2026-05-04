import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/main-layout";
import { AuthProvider } from "@/context/auth";
import { AuthGuard, PublicOnly } from "@/components/auth-guard";

const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Home = lazy(() => import("./pages/Index"));
const Doctors = lazy(() => import("./pages/doctors/index"));
const DoctorDetail = lazy(() => import("./pages/doctors/detail"));
const Hospitals = lazy(() => import("./pages/hospitals/index"));
const Book = lazy(() => import("./pages/appointments/book"));
const Appointments = lazy(() => import("./pages/appointments/index"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Profile = lazy(() => import("./pages/profile"));
const Settings = lazy(() => import("./pages/settings"));
const Payments = lazy(() => import("./pages/payments"));
const Notifications = lazy(() => import("./pages/notifications"));
const Saved = lazy(() => import("./pages/saved"));
const Chatbot = lazy(() => import("./pages/chatbot"));
const SymptomChecker = lazy(() => import("./pages/symptom-checker"));
const Reminders = lazy(() => import("./pages/reminders"));
const Records = lazy(() => import("./pages/records"));
const Loyalty = lazy(() => import("./pages/loyalty"));
const Emergency = lazy(() => import("./pages/emergency"));
const Support = lazy(() => import("./pages/support"));
const NearbyMap = lazy(() => import("./pages/map"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="flex h-[60vh] items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const Protected = ({ C }: { C: React.ComponentType }) => (
  <AuthGuard><C /></AuthGuard>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <MainLayout>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
                <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

                <Route path="/home" element={<Protected C={Home} />} />
                <Route path="/doctors" element={<Protected C={Doctors} />} />
                <Route path="/doctors/:id" element={<Protected C={DoctorDetail} />} />
                <Route path="/hospitals" element={<Protected C={Hospitals} />} />
                <Route path="/book/:doctorId" element={<Protected C={Book} />} />
                <Route path="/appointments" element={<Protected C={Appointments} />} />
                <Route path="/dashboard" element={<Protected C={Dashboard} />} />
                <Route path="/profile" element={<Protected C={Profile} />} />
                <Route path="/settings" element={<Protected C={Settings} />} />
                <Route path="/payments" element={<Protected C={Payments} />} />
                <Route path="/notifications" element={<Protected C={Notifications} />} />
                <Route path="/saved" element={<Protected C={Saved} />} />
                <Route path="/chatbot" element={<Protected C={Chatbot} />} />
                <Route path="/symptom-checker" element={<Protected C={SymptomChecker} />} />
                <Route path="/reminders" element={<Protected C={Reminders} />} />
                <Route path="/records" element={<Protected C={Records} />} />
                <Route path="/loyalty" element={<Protected C={Loyalty} />} />
                <Route path="/emergency" element={<Protected C={Emergency} />} />
                <Route path="/support" element={<Protected C={Support} />} />
                <Route path="/map" element={<Protected C={NearbyMap} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
