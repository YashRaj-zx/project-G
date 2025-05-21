
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  Phone, MessageSquare, Settings, Clock,
  User, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/layout/NavBar";
import { toast } from "sonner";

// Mock data for AI responses
const aiResponses = [
  "It's so wonderful to see you again. How have you been lately?",
  "I remember that time we went to the beach. The sunset was beautiful.",
  "Tell me more about what's been happening in your life.",
  "I've missed our conversations together.",
  "That reminds me of something we used to talk about.",
  "I'm here to listen whenever you need me.",
];

const VideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMemoryMode, setIsMemoryMode] = useState(true);

  // Effect to update call duration
  useEffect(() => {
    let interval: number | undefined;
    
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCall]);
  
  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle starting/ending call
  const toggleCall = () => {
    if (!isInCall) {
      setIsInCall(true);
      toast.success("Call connected");
      
      // Add AI welcome message after a short delay
      setTimeout(() => {
        setChatMessages([{
          text: "Hello! It's so good to see you again. How have you been?",
          isUser: false
        }]);
      }, 1500);
    } else {
      setIsInCall(false);
      setChatMessages([]);
      setCallDuration(0);
      toast.info("Call ended");
    }
  };

  // Handle sending chat message
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newMessage = { text: message, isUser: true };
    setChatMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate AI typing
    setIsAiTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      setIsAiTyping(false);
      const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setChatMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
    }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Toggle memory mode
  const toggleMemoryMode = () => {
    setIsMemoryMode(!isMemoryMode);
    toast.info(isMemoryMode ? "Switched to Free Conversation Mode" : "Switched to Memory Mode");
  };

  return (
    <div className="min-h-screen flex flex-col bg-echoes-dark">
      <NavBar />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 pt-20">
        {/* Main Video Area */}
        <div className="lg:col-span-2 aspect-video bg-black/30 rounded-xl overflow-hidden relative">
          {isInCall ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-b from-transparent to-black/50">
                {/* AI Avatar Video Stream - Currently Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="bg-echoes-purple/5 rounded-full w-40 h-40 flex items-center justify-center">
                      <User className="w-20 h-20 text-echoes-purple/30" />
                    </div>
                  </motion.div>
                </div>
                
                {/* Call Duration */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 rounded-lg text-white/80 text-sm">
                  {formatDuration(callDuration)}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/70">
              <div className="text-center">
                <p className="mb-4">Ready to start your call</p>
                <Button 
                  onClick={toggleCall} 
                  className="bg-echoes-purple hover:bg-echoes-purple/80"
                >
                  Begin Call
                </Button>
              </div>
            </div>
          )}
          
          {/* Self Video Preview */}
          <div className="absolute bottom-4 right-4 w-48 aspect-video bg-echoes-purple/10 rounded-lg overflow-hidden">
            {/* User's Video Stream - Currently Placeholder */}
            {isVideoOn && (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-10 h-10 text-white/30" />
              </div>
            )}
            {!isVideoOn && (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <VideoOff className="w-6 h-6 text-white/50" />
              </div>
            )}
          </div>
        </div>

        {/* Controls and Chat Panel */}
        <div className="bg-echoes-dark/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex flex-col h-full">
            {/* Memory Mode Toggle */}
            <div 
              className={`flex items-center gap-2 mb-4 p-3 rounded-lg cursor-pointer ${
                isMemoryMode ? "bg-echoes-purple/20" : "bg-white/5"
              }`}
              onClick={toggleMemoryMode}
            >
              <Clock className={`w-5 h-5 ${isMemoryMode ? "text-echoes-purple" : "text-white/70"}`} />
              <span className={`${isMemoryMode ? "text-white/90" : "text-white/70"}`}>
                Memory Mode {isMemoryMode ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Call Controls */}
            <div className="flex gap-2 mb-6">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${isMuted ? 'bg-red-500/20 text-red-500' : ''}`}
                onClick={() => {
                  setIsMuted(!isMuted);
                  toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
                }}
              >
                {isMuted ? <MicOff /> : <Mic />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${!isVideoOn ? 'bg-red-500/20 text-red-500' : ''}`}
                onClick={() => {
                  setIsVideoOn(!isVideoOn);
                  toast.info(isVideoOn ? "Camera turned off" : "Camera turned on");
                }}
              >
                {isVideoOn ? <VideoIcon /> : <VideoOff />}
              </Button>
              <Button
                variant={isInCall ? "destructive" : "default"}
                size="icon"
                className="rounded-full"
                onClick={toggleCall}
              >
                <Phone className={isInCall ? "rotate-135" : ""} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full ml-auto"
              >
                <Settings />
              </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-grow flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-echoes-purple" />
                <h3 className="text-white/90">Chat</h3>
              </div>
              <div className="flex-grow bg-black/20 rounded-lg p-4 mb-4 overflow-y-auto">
                <AnimatePresence>
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-3 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-lg px-3 py-2 ${
                          msg.isUser 
                            ? 'bg-echoes-purple text-white' 
                            : 'bg-white/10 text-white/90'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {isAiTyping && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start mb-3"
                    >
                      <div className="bg-white/10 rounded-lg px-4 py-2 text-white/70">
                        <div className="flex gap-1">
                          <span className="animate-bounce">•</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>•</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>•</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:outline-none focus:border-echoes-purple"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!isInCall}
                />
                <Button 
                  type="submit" 
                  disabled={!isInCall || !message.trim()}
                  className="bg-echoes-purple hover:bg-echoes-purple/80"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoCall;
