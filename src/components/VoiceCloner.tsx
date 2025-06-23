import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cloneVoice } from "@/utils/elevenLabsApi";
import { Mic, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface VoiceCloneProps {
  onVoiceCloned: (voiceId: string, name: string) => void;
}

const VoiceCloner: React.FC<VoiceCloneProps> = ({ onVoiceCloned }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceName, setVoiceName] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isCloning, setIsCloning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  
  // Updated ElevenLabs API key
  const elevenLabsApiKey = "sk_307e4c5c2038de5a11bd22e9dc71959fe0af3d34982112b9";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Audio file must be less than 10MB");
        return;
      }
      
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      
      // Extract name from filename as default
      if (!voiceName) {
        const nameFromFile = file.name.split('.')[0];
        setVoiceName(nameFromFile);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], "recording.wav", { type: 'audio/wav' });
        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(audioBlob));
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started... Speak clearly");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      toast.success("Recording completed");
    }
  };

  const handleClone = async () => {
    if (!audioFile) {
      toast.error("Please upload or record an audio sample");
      return;
    }
    
    if (!voiceName.trim()) {
      toast.error("Please enter a name for the cloned voice");
      return;
    }
    
    setIsCloning(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      const result = await cloneVoice(voiceName, audioFile, elevenLabsApiKey);
      clearInterval(progressInterval);
      setProgress(100);
      
      // Call the callback with the cloned voice ID and name
      onVoiceCloned(result.voiceId, result.name);
      
      toast.success("Voice cloned successfully! You can now use this voice in calls.");
      
      // Reset the form
      setAudioFile(null);
      setVoiceName("");
      setAudioPreview(null);
      setProgress(0);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error cloning voice:", error);
      toast.error("Failed to clone voice. Please try again with a clear audio sample.");
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Card className="border-echoes-purple/20">
      <CardHeader>
        <CardTitle>Voice Cloning</CardTitle>
        <CardDescription>
          Create a voice clone by uploading an audio sample or recording directly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="voice-name">Voice Name</Label>
          <Input 
            id="voice-name"
            placeholder="Enter a name for this voice"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="audio-upload" 
                  className="cursor-pointer bg-echoes-purple/10 hover:bg-echoes-purple/20 text-echoes-purple px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors h-full"
                >
                  <Upload className="h-4 w-4" />
                  Upload Audio
                </Label>
                <Input 
                  id="audio-upload" 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  disabled={isCloning || isRecording}
                />
              </div>
              
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                className={isRecording ? "bg-red-500" : "bg-echoes-purple/10 text-echoes-purple hover:bg-echoes-purple/20"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isCloning}
              >
                <Mic className="h-4 w-4 mr-2" />
                {isRecording ? "Stop Recording" : "Record Audio"}
              </Button>
            </div>
            
            {audioPreview && (
              <div className="mt-2">
                <audio src={audioPreview} controls className="w-full" />
              </div>
            )}
          </div>
        </div>
        
        {isCloning && (
          <div className="space-y-2 mt-4">
            <Label>Cloning Progress</Label>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {progress === 100 ? "Complete!" : "Processing voice sample..."}
            </p>
          </div>
        )}
        
        <Button
          onClick={handleClone}
          disabled={!audioFile || isCloning || isRecording || !voiceName.trim()}
          className="w-full mt-4 bg-echoes-purple hover:bg-echoes-accent text-white"
        >
          {isCloning ? "Cloning..." : "Clone Voice"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VoiceCloner;
