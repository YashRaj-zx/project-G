
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import NavBar from "@/components/layout/NavBar";

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const echoId = searchParams.get("echo");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [echo, setEcho] = useState<any>(null);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to make calls");
      navigate("/dashboard");
      return;
    }
    
    if (!echoId) {
      toast.error("No echo was selected");
      navigate("/dashboard");
      return;
    }
    
    // Load echo data
    const userId = user?.id;
    const storedEchoes = JSON.parse(localStorage.getItem(`echoes_${userId}`) || '[]');
    const selectedEcho = storedEchoes.find((e: any) => e.id === echoId);
    
    if (!selectedEcho) {
      toast.error("Echo not found");
      navigate("/dashboard");
      return;
    }
    
    setEcho(selectedEcho);
    setLoading(false);
    toast.success(`Starting call with ${selectedEcho.name}...`);
  }, [isAuthenticated, navigate, echoId, user]);

  const handleEndCall = () => {
    // Save call record
    if (user && echo) {
      const callRecord = {
        id: Date.now().toString(),
        echoId: echo.id,
        echoName: echo.name,
        duration: formatDuration(callDuration),
        date: new Date().toISOString(),
        previewImageUrl: echo.imageUrl || '/placeholder.svg'
      };
      
      const existingCalls = JSON.parse(localStorage.getItem(`calls_${user.id}`) || '[]');
      localStorage.setItem(`calls_${user.id}`, JSON.stringify([callRecord, ...existingCalls]));
    }
    
    toast.success("Call ended");
    navigate("/dashboard");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Preparing your call...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <MobileVoiceCall echo={echo} onEndCall={handleEndCall} />
    </div>
  );
};

export default VideoCall;
