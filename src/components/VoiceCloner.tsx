
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cloneVoice } from "@/utils/elevenLabsApi";
import { Mic, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  
  // Default API key (users can override)
  const defaultApiKey = "sk_307e4c5c2038de5a11bd22e9dc71959fe0af3d34982112b9";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      console.log(`Selected file: ${file.name}, size: ${file.size}, type: ${file.type}`);
      
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        toast.error("Audio file must be less than 25MB");
        return;
      }
      
      // Check if it's an audio file
      if (!file.type.startsWith('audio/') && !file.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|ogg)$/)) {
        toast.error("Please select a valid audio file (MP3, WAV, M4A, FLAC, or OGG)");
        return;
      }
      
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      
      // Extract name from filename as default
      if (!voiceName) {
        const nameFromFile = file.name.split('.')[0].replace(/[^a-zA-Z0-9\s]/g, '').trim();
        setVoiceName(nameFromFile);
      }
      
      toast.success("Audio file loaded successfully");
    }
  };

  const startRecording = async () => {
    try {
      console.log("Starting recording...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], "recording.webm", { type: 'audio/webm' });
        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(audioBlob));
        console.log(`Recording completed. Size: ${audioBlob.size} bytes`);
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      toast.info("Recording started... Speak clearly for at least 30 seconds");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
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
    
    if (voiceName.trim().length < 2) {
      toast.error("Voice name must be at least 2 characters long");
      return;
    }
    
    const keyToUse = apiKey.trim() || defaultApiKey;
    
    setIsCloning(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      console.log("Starting voice cloning process...");
      const result = await cloneVoice(voiceName.trim(), audioFile, keyToUse);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      console.log("Voice cloning successful:", result);
      
      // Call the callback with the cloned voice ID and name
      onVoiceCloned(result.voiceId, result.name);
      
      toast.success(`Voice "${result.name}" cloned successfully! You can now use this voice in calls.`);
      
      // Reset the form
      setAudioFile(null);
      setVoiceName("");
      setAudioPreview(null);
      setProgress(0);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error("Voice cloning failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Voice cloning failed: ${errorMessage}`);
      
      // Show API key input if it seems like an authentication issue
      if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('api key')) {
        setShowApiKeyInput(true);
        toast.info("Please check your ElevenLabs API key");
      }
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Card className="border-echoes-purple/20">
      <CardHeader>
        <CardTitle>Voice Cloning</CardTitle>
        <CardDescription>
          Create a voice clone by uploading an audio sample or recording directly. 
          For best results, use clear audio with at least 30 seconds of speech.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showApiKeyInput && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2 mt-2">
                <Label htmlFor="api-key">ElevenLabs API Key (Optional)</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your ElevenLabs API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  If using your own API key, make sure it has voice cloning permissions.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="voice-name">Voice Name</Label>
          <Input 
            id="voice-name"
            placeholder="Enter a name for this voice (e.g., John, Sarah)"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            maxLength={50}
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
                  accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg" 
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
                <Label>Audio Preview</Label>
                <audio src={audioPreview} controls className="w-full mt-1" />
                {audioFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    File: {audioFile.name} ({Math.round(audioFile.size / 1024)}KB)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {isCloning && (
          <div className="space-y-2 mt-4">
            <Label>Cloning Progress</Label>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {progress === 100 ? "Complete!" : "Processing voice sample... This may take a minute."}
            </p>
          </div>
        )}
        
        <Button
          onClick={handleClone}
          disabled={!audioFile || isCloning || isRecording || !voiceName.trim()}
          className="w-full mt-4 bg-echoes-purple hover:bg-echoes-accent text-white"
        >
          {isCloning ? "Cloning Voice..." : "Clone Voice"}
        </Button>
        
        {!showApiKeyInput && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowApiKeyInput(true)}
            className="w-full text-xs text-muted-foreground"
          >
            Use custom API key
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceCloner;
