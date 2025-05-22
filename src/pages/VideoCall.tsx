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
  
  // Gemini API key
  const geminiApiKey = "AIzaSyAFRE3-_HnJFeZkBV-4oHkyGGTdTriFxOM";
  
  // ElevenLabs API key - now using the real key
  const elevenLabsApiKey = "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347";
  
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
    
    // Generate initial greeting using user's name
    if (user && echo) {
      const greeting = `Hello ${user.name || 'there'}! It's great to see you. How can I help you today?`;
      
      // Add greeting to internal message record
      setMessages([{text: greeting, sender: 'echo'}]);
      
      // Generate speech for the greeting
      setIsSpeaking(true);
      try {
        console.log("Generating initial greeting speech...");
        console.log("Echo data:", echo);
        
        const response = await enhancedGenerateAvatarResponse(
          greeting, 
          echo.imageUrl || '/placeholder.svg',
          echo.voiceId || 'EXAVITQu4vr4xnSDxMaL',
          echo.language || 'en-US',
          geminiApiKey,
          elevenLabsApiKey
        );
        
        console.log("Speech response:", response);
        
        if (audioRef.current && response.audioUrl) {
          console.log("Playing audio:", response.audioUrl);
          audioRef.current.src = response.audioUrl;
          audioRef.current.oncanplaythrough = () => {
            console.log("Audio can play through, starting playback");
            audioRef.current?.play().catch(error => {
              console.error("Error playing audio:", error);
              toast.error("Couldn't play audio. Please check your audio settings.");
            });
          };
          
          audioRef.current.onended = () => {
            console.log("Audio playback ended");
            setIsSpeaking(false);
          };
          
          audioRef.current.onerror = (e) => {
            console.error("Audio error:", e);
            setIsSpeaking(false);
            toast.error("Error playing audio");
          };
        } else {
          console.error("Audio element or URL not available");
          setIsSpeaking(false);
        }
      } catch (error) {
        console.error("Error generating greeting:", error);
        setIsSpeaking(false);
        toast.error("Error generating voice. Please try again.");
      }
    }
    
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
    // This function would be called when the user speaks and we get a transcript
    // In a real implementation, this would be connected to a speech recognition API
    
    if (!transcript.trim()) return;
    
    // Add user message to internal record
    setMessages(prev => [...prev, {text: transcript, sender: 'user'}]);
    
    // Simulate processing time
    setIsSpeaking(true);
    
    try {
      console.log("Generating response for user message:", transcript);
      
      // Generate response from the AI using enhanced API
      const response = await enhancedGenerateAvatarResponse(
        transcript,
        echo.imageUrl || '/placeholder.svg',
        echo.voiceId || 'EXAVITQu4vr4xnSDxMaL',
        echo.language || 'en-US',
        geminiApiKey,
        elevenLabsApiKey
      );
      
      console.log("Generated response:", response);
      
      // Play the audio
      if (audioRef.current && response.audioUrl) {
        console.log("Playing audio response", response.audioUrl);
        audioRef.current.src = response.audioUrl;
        audioRef.current.oncanplaythrough = () => {
          if (!speakerEnabled) return;
          audioRef.current?.play().catch(error => {
            console.error("Error playing audio:", error);
            toast.error("Couldn't play audio response");
          });
        };
        
        audioRef.current.onended = () => {
          console.log("Response audio ended");
          setIsSpeaking(false);
        };
        
        audioRef.current.onerror = () => {
          console.error("Error with audio playback");
          setIsSpeaking(false);
          toast.error("Error playing audio response");
        };
      } else {
        console.error("Audio element or URL not available for response");
        setIsSpeaking(false);
      }
      
      // Add echo response to internal record
      setMessages(prev => [...prev, {
        text: response.text || "I understand. How can I assist you further?",
        sender: 'echo'
      }]);
      
    } catch (error) {
      console.error("Error processing voice input:", error);
      setIsSpeaking(false);
      toast.error("Failed to process your message");
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
        <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-900">
          {/* Video feed area */}
          <div className="absolute inset-0 flex items-center justify-center">
            {videoEnabled ? (
              <img 
                src={echo?.imageUrl || '/placeholder.svg'} 
                alt={echo?.name} 
                className={`w-full h-full object-cover ${isSpeaking ? 'speaking-animation' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <p className="text-white text-xl">Video Disabled</p>
              </div>
            )}
            
            {/* Add a visual indicator when the avatar is speaking */}
            {isSpeaking && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="inline-block h-3 w-3 bg-green-400 rounded-full animate-pulse delay-150"></span>
                  <span className="inline-block h-2 w-2 bg-green-400 rounded-full animate-pulse delay-300"></span>
                  <span className="text-white text-sm">Speaking...</span>
                </div>
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
      
      {/* Fix for the style issue */}
      <style>{`
        @keyframes subtle-lip-movement {
          0% { transform: scaleY(1); }
          25% { transform: scaleY(0.98); }
          50% { transform: scaleY(0.96); }
          75% { transform: scaleY(0.98); }
          100% { transform: scaleY(1); }
        }
        
        .speaking-animation {
          animation: subtle-lip-movement 0.3s infinite;
          transform-origin: center bottom;
        }
      `}</style>
    </div>
  );
};

export default VideoCall;
