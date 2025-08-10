
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound"; 
import React from "react";
import HowItWorks from "./pages/HowItWorks";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import EthicalGuidelines from "./pages/EthicalGuidelines";
import CookiePolicy from "./pages/CookiePolicy";
import Pricing from "./pages/Pricing";
import VideoCall from "./pages/VideoCall";
import Dashboard from "./pages/Dashboard";
import CreateEcho from "./pages/CreateEcho";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Gloomie from "./components/Gloomie";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/videoCall.css";
import { TourProvider } from "./contexts/TourContext";

const queryClient = new QueryClient();

// Define a ProtectedRoute component
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  return element;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TourProvider> {/* Wrap with TourProvider */}
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>

              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/video-call" element={<VideoCall />} />
                <Route path="/create-echo" element={<ProtectedRoute element={<CreateEcho />} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/ethical-guidelines" element={<EthicalGuidelines />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="*" element={<NotFound />} />            </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </TourProvider> {/* Close TourProvider */}
    </QueryClientProvider>
  );
};

export default App;
