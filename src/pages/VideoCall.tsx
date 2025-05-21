
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, PhoneOff } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const echoId = searchParams.get("echo");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [echo, setEcho] = useState<any>(null);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout>();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to make calls");
      navigate("/login");
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
    
    // In a real app, we would initialize the video call here
    // For demonstration, we'll simulate the call starting after a delay
    const timer = setTimeout(() => {
      startCall();
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isAuthenticated, navigate, echoId, user]);
  
  const startCall = () => {
    setCallActive(true);
    toast.success(`Call with ${echo?.name} started`);
    
    // Start call timer
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // In a real app, we would load a video of the generated avatar here
    if (videoRef.current && echo?.imageUrl) {
      // For demo, we'll just show a static image
      // In a real app, this would be replaced with the actual video feed
    }
  };
  
  const endCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    setCallActive(false);
    
    // Save call record in localStorage
    if (user) {
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
    
    toast.success(`Call ended after ${formatDuration(callDuration)}`);
    navigate("/dashboard");
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    toast.info(`Microphone ${micEnabled ? 'muted' : 'unmuted'}`);
  };
  
  const toggleSpeaker = () => {
    setSpeakerEnabled(!speakerEnabled);
    toast.info(`Speaker ${speakerEnabled ? 'muted' : 'unmuted'}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <p>Preparing your call...</p>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="absolute top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      
      <main className="flex-grow flex flex-col items-center justify-center py-16 px-4">
        <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-900">
          {/* This would be a video in a real implementation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={echo?.imageUrl || '/placeholder.svg'} 
              alt={echo?.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Call duration overlay */}
          <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            {formatDuration(callDuration)}
          </div>
          
          {/* Echo name overlay */}
          <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white">
            {echo?.name}
          </div>
          
          {/* Call controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Button
              onClick={toggleMic}
              variant="outline"
              size="icon"
              className={`rounded-full w-12 h-12 ${micEnabled ? 'bg-white text-black' : 'bg-red-600 text-white'}`}
            >
              {micEnabled ? <Mic /> : <MicOff />}
            </Button>
            
            <Button
              onClick={endCall}
              variant="destructive"
              size="icon"
              className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-700"
            >
              <PhoneOff />
            </Button>
            
            <Button
              onClick={toggleSpeaker}
              variant="outline"
              size="icon"
              className={`rounded-full w-12 h-12 ${speakerEnabled ? 'bg-white text-black' : 'bg-red-600 text-white'}`}
            >
              {speakerEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
          </div>
        </div>
        
        {/* Chat interface would go here in a real implementation */}
        <div className="w-full max-w-3xl mt-8 bg-background rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4">Chat with {echo?.name}</h2>
          
          <div className="h-64 overflow-y-auto mb-4 border rounded-md p-2">
            <p className="text-center text-gray-400 my-12">
              {callActive 
                ? "Your conversation will appear here..." 
                : "Call will begin shortly..."}
            </p>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-grow rounded-md border p-2"
              placeholder="Type your message..."
              disabled={!callActive}
            />
            <Button disabled={!callActive}>Send</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoCall;
