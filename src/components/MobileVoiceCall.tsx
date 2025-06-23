
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, Phone } from "lucide-react";
import { textToSpeech, getValidVoiceId } from "@/utils/elevenLabsApi";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MobileVoiceCallProps {
  echo: {
    id: string;
    name: string;
    imageUrl?: string;
    voiceId?: string;
  };
  onEndCall: () => void;
}

const MobileVoiceCall = ({ echo, onEndCall }: MobileVoiceCallProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const callTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Start call timer
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserSpeech(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Simulate connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      playInitialGreeting();
    }, 2000);

    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      clearTimeout(connectTimer);
    };
  }, []);

  const playInitialGreeting = async () => {
    const greeting = `Hello! It's wonderful to hear from you. I'm ${echo.name}. How are you doing today?`;
    await generateVoiceResponse(greeting);
  };

  const generateVoiceResponse = async (text: string) => {
    setIsSpeaking(true);
    
    try {
      const response = await textToSpeech(
        text,
        echo.voiceId || 'sarah',
        "sk_307e4c5c2038de5a11bd22e9dc71959fe0af3d34982112b9"
      );
      
      if (audioRef.current && response.audioUrl) {
        audioRef.current.src = response.audioUrl;
        audioRef.current.onended = () => setIsSpeaking(false);
        
        if (speakerEnabled) {
          await audioRef.current.play();
        }
      }
    } catch (error) {
      console.error("Error generating voice:", error);
      setIsSpeaking(false);
      toast.error("Voice generation failed");
    }
  };

  const handleUserSpeech = async (transcript: string) => {
    console.log("User said:", transcript);
    
    // Generate contextual response
    const responses = [
      `That's really interesting. Tell me more about ${transcript.toLowerCase()}.`,
      `I understand what you're saying about ${transcript.toLowerCase()}. How does that make you feel?`,
      `Thank you for sharing that with me. ${transcript} sounds important to you.`,
      `I'm here to listen. What else would you like to talk about regarding ${transcript.toLowerCase()}?`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await generateVoiceResponse(randomResponse);
  };

  const startListening = () => {
    if (!micEnabled) {
      toast.error("Please enable your microphone first");
      return;
    }

    if (recognitionRef.current && !isListening && !isSpeaking) {
      setIsListening(true);
      recognitionRef.current.start();
      toast.info("Listening...");
    }
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    toast.info(`Microphone ${micEnabled ? 'muted' : 'unmuted'}`);
  };

  const toggleSpeaker = () => {
    setSpeakerEnabled(!speakerEnabled);
    if (audioRef.current) {
      audioRef.current.muted = !speakerEnabled;
    }
    toast.info(`Speaker ${speakerEnabled ? 'muted' : 'unmuted'}`);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
      {/* Call Status */}
      <div className="text-center mb-8">
        <div className="text-sm opacity-75 mb-2">
          {isConnected ? 'Connected' : 'Connecting...'}
        </div>
        <div className="text-lg font-semibold">
          {formatDuration(callDuration)}
        </div>
      </div>

      {/* Avatar */}
      <div className={`relative mb-8 ${isSpeaking ? 'animate-pulse' : ''}`}>
        <div className={`w-40 h-40 rounded-full overflow-hidden border-4 ${isSpeaking ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-white/20'} transition-all duration-300`}>
          <Avatar className="w-full h-full">
            <AvatarImage 
              src={echo.imageUrl || '/placeholder.svg'} 
              alt={echo.name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-purple-600">
              {echo.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs animate-bounce">
            Speaking...
          </div>
        )}
        
        {/* Listening indicator */}
        {isListening && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs animate-pulse">
            Listening...
          </div>
        )}
      </div>

      {/* Echo Name */}
      <div className="text-xl font-semibold mb-8 text-center">
        {echo.name}
      </div>

      {/* Talk Button */}
      <div className="mb-8">
        <Button
          onMouseDown={startListening}
          disabled={!isConnected || isSpeaking || !micEnabled}
          className="w-24 h-24 rounded-full bg-white text-purple-900 hover:bg-gray-100 disabled:opacity-50 text-lg font-semibold shadow-lg"
        >
          {isListening ? (
            <div className="flex flex-col items-center">
              <Mic className="w-8 h-8 mb-1" />
              <span className="text-xs">Release</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Mic className="w-8 h-8 mb-1" />
              <span className="text-xs">Hold</span>
            </div>
          )}
        </Button>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-6 mb-8">
        <Button
          onClick={toggleMic}
          variant="outline"
          size="icon"
          className={`w-14 h-14 rounded-full ${micEnabled ? 'bg-white/10 text-white border-white/30' : 'bg-red-600 text-white border-red-600'}`}
        >
          {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </Button>
        
        <Button
          onClick={toggleSpeaker}
          variant="outline"
          size="icon"
          className={`w-14 h-14 rounded-full ${speakerEnabled ? 'bg-white/10 text-white border-white/30' : 'bg-red-600 text-white border-red-600'}`}
        >
          {speakerEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </Button>
      </div>

      {/* End Call Button */}
      <Button
        onClick={onEndCall}
        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white"
      >
        <PhoneOff className="w-8 h-8" />
      </Button>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
};

export default MobileVoiceCall;
