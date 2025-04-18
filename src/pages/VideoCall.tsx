
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  Phone, MessageSquare, Settings, Clock
} from "lucide-react";
import NavBar from "@/components/layout/NavBar";

const VideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isInCall, setIsInCall] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-echoes-dark">
      <NavBar />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 pt-20">
        {/* Main Video Area */}
        <div className="lg:col-span-2 aspect-video bg-black/30 rounded-xl overflow-hidden relative">
          {isInCall ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-b from-transparent to-black/50">
                {/* AI Avatar Video Stream Would Go Here */}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/70">
              <p>Ready to start your call</p>
            </div>
          )}
          
          {/* Self Video Preview */}
          <div className="absolute bottom-4 right-4 w-48 aspect-video bg-echoes-purple/10 rounded-lg">
            {/* User's Video Stream Would Go Here */}
          </div>
        </div>

        {/* Controls and Chat Panel */}
        <div className="bg-echoes-dark/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex flex-col h-full">
            {/* Memory Mode Toggle */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-white/5 rounded-lg">
              <Clock className="w-5 h-5 text-echoes-purple" />
              <span className="text-white/90">Memory Mode Active</span>
            </div>

            {/* Call Controls */}
            <div className="flex gap-2 mb-6">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${isMuted ? 'bg-red-500/20 text-red-500' : ''}`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff /> : <Mic />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${!isVideoOn ? 'bg-red-500/20 text-red-500' : ''}`}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <VideoIcon /> : <VideoOff />}
              </Button>
              <Button
                variant={isInCall ? "destructive" : "default"}
                size="icon"
                className="rounded-full"
                onClick={() => setIsInCall(!isInCall)}
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
              <div className="flex-grow bg-black/20 rounded-lg p-4 mb-4">
                {/* Chat messages would go here */}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:outline-none focus:border-echoes-purple"
                />
                <Button>Send</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoCall;
