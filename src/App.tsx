
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound"; 
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import VideoCall from "./pages/VideoCall";
import Dashboard from "./pages/Dashboard";
import CreateEcho from "./pages/CreateEcho";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/videoCall.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {/* Define a ProtectedRoute component */}
      const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
        const { user } = useAuth();
        if (!user) {
          // Redirect to login page if not authenticated
          return <Navigate to="/login" replace />;
        }
        return element;
      };
      
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
