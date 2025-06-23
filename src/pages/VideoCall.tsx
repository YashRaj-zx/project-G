import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, Video, VideoOff } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { enhancedGenerateAvatarResponse } from "@/utils/elevenLabsApi";

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
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // No longer using chat messages in state
  // Note: We'll still keep the messages array for voice transcription records internally
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'echo'}[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout>();
  
  // Updated API keys
  const geminiApiKey = "AIzaSyAFRE3-_HnJFeZkBV-4oHkyGGTdTriFxOM";
  const elevenLabsApiKey = "sk_307e4c5c2038de5a11bd22e9dc71959fe0af3d34982112b9";
  
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
  
  const startCall = async () => {
    setCallActive(true);
    toast.success(`Call with ${echo?.name} started`);
    
    // Start call timer
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // Generate initial greeting with real-time avatar
    if (user && echo) {
      const greeting = `Hello ${user.name || 'there'}! It's wonderful to see you. I'm your AI companion ${echo.name}. How can I assist you today?`;
      
      setMessages([{text: greeting, sender: 'echo'}]);
      
      // Generate real-time talking avatar
      setIsSpeaking(true);
      try {
        console.log("Generating real-time talking avatar...");
        
        const response = await enhancedGenerateAvatarResponse(
          greeting, 
          echo.imageUrl || '/placeholder.svg',
          echo.voiceId || 'EXAVITQu4vr4xnSDxMaL',
          echo.language || 'en-US',
          geminiApiKey,
          elevenLabsApiKey
        );
        
        console.log("Real-time avatar response:", response);
        
        if (audioRef.current && response.audioUrl) {
          console.log("Playing synchronized audio:", response.audioUrl);
          audioRef.current.src = response.audioUrl;
          
          audioRef.current.oncanplaythrough = () => {
            console.log("Audio ready for lip-sync playback");
            audioRef.current?.play().catch(error => {
              console.error("Error playing synchronized audio:", error);
              toast.error("Couldn't play avatar audio. Please check your audio settings.");
            });
          };
          
          audioRef.current.onended = () => {
            console.log("Avatar finished speaking");
            setIsSpeaking(false);
          };
          
          audioRef.current.onerror = (e) => {
            console.error("Avatar audio error:", e);
            setIsSpeaking(false);
            toast.error("Error with avatar audio playback");
          };
        } else {
          console.error("Audio element or URL not available for avatar");
          setIsSpeaking(false);
        }
      } catch (error) {
        console.error("Error generating real-time avatar:", error);
        setIsSpeaking(false);
        toast.error("Error generating avatar response. Please try again.");
      }
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
    if (audioRef.current) {
      audioRef.current.muted = !speakerEnabled;
    }
    toast.info(`Speaker ${speakerEnabled ? 'muted' : 'unmuted'}`);
  };
  
  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast.info(`Video ${videoEnabled ? 'disabled' : 'enabled'}`);
  };
  
  const handleSendVoiceMessage = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setMessages(prev => [...prev, {text: transcript, sender: 'user'}]);
    
    // Generate real-time avatar response
    setIsSpeaking(true);
    
    try {
      console.log("Generating real-time avatar response for:", transcript);
      
      const response = await enhancedGenerateAvatarResponse(
        transcript,
        echo.imageUrl || '/placeholder.svg',
        echo.voiceId || 'EXAVITQu4vr4xnSDxMaL',
        echo.language || 'en-US',
        geminiApiKey,
        elevenLabsApiKey
      );
      
      console.log("Generated real-time response:", response);
      
      // Play synchronized audio with lip-sync
      if (audioRef.current && response.audioUrl) {
        console.log("Playing synchronized avatar response", response.audioUrl);
        audioRef.current.src = response.audioUrl;
        
        audioRef.current.oncanplaythrough = () => {
          if (!speakerEnabled) return;
          audioRef.current?.play().catch(error => {
            console.error("Error playing avatar response:", error);
            toast.error("Couldn't play avatar response");
          });
        };
        
        audioRef.current.onended = () => {
          console.log("Avatar response finished");
          setIsSpeaking(false);
        };
        
        audioRef.current.onerror = () => {
          console.error("Error with avatar response playback");
          setIsSpeaking(false);
          toast.error("Error playing avatar response");
        };
      } else {
        console.error("Audio element or URL not available for avatar response");
        setIsSpeaking(false);
      }
      
      setMessages(prev => [...prev, {
        text: response.text || "I understand. How can I assist you further?",
        sender: 'echo'
      }]);
      
    } catch (error) {
      console.error("Error processing voice input with avatar:", error);
      setIsSpeaking(false);
      toast.error("Failed to process your message with avatar");
    }
  };
  
  // Simulated speech recognition - in a real app, this would use the Web Speech API
  const startVoiceInput = () => {
    if (!micEnabled) {
      toast.error("Please unmute your microphone first");
      return;
    }
    
    // Simulate user speaking
    toast.info("Listening...");
    
    // For demo purposes only - simulating speech recognition
    setTimeout(() => {
      const simulatedUserSpeech = "How are you doing today?";
      handleSendVoiceMessage(simulatedUserSpeech);
    }, 2000);
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
        <div className={`relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-900 avatar-container ${isSpeaking ? 'speaking' : ''}`}>
          {/* Real-time avatar video area */}
          <div className="absolute inset-0 flex items-center justify-center">
            {videoEnabled ? (
              <img 
                src={echo?.imageUrl || '/placeholder.svg'} 
                alt={echo?.name} 
                className={`w-full h-full object-cover transition-all duration-300 ${isSpeaking ? 'speaking-animation' : ''}`}
                style={{
                  filter: isSpeaking ? 'brightness(1.1) contrast(1.05)' : 'brightness(1)',
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <p className="text-white text-xl">Video Disabled</p>
              </div>
            )}
            
            {/* Enhanced speaking indicator with real-time feedback */}
            {isSpeaking && (
              <div className="speaking-indicator">
                <div className="voice-indicator">
                  <div className="voice-dot dot-1"></div>
                  <div className="voice-dot dot-2"></div>
                  <div className="voice-dot dot-3"></div>
                </div>
                <span className="speaking-text">Speaking with lip-sync...</span>
              </div>
            )}
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
            
            <Button
              onClick={toggleVideo}
              variant="outline"
              size="icon"
              className={`rounded-full w-12 h-12 ${videoEnabled ? 'bg-white text-black' : 'bg-red-600 text-white'}`}
            >
              {videoEnabled ? <Video /> : <VideoOff />}
            </Button>
          </div>
        </div>
        
        <div className="w-full max-w-3xl flex justify-center mt-8">
          {callActive && (
            <Button 
              onClick={startVoiceInput} 
              disabled={!micEnabled || isSpeaking}
              className="bg-echoes-purple hover:bg-echoes-purple/90 text-white px-8 py-2 rounded-full"
            >
              {isSpeaking ? "Echo is speaking..." : "Hold to speak"}
            </Button>
          )}
        </div>
        
        {/* Hidden audio element for playing the avatar's voice */}
        <audio 
          ref={audioRef} 
          controls 
          className={speakerEnabled ? "hidden" : "mt-4"}
        />
      </main>
    </div>
  );
};

export default VideoCall;
