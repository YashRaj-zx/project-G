import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cloneVoice } from "@/utils/elevenLabsApi";
import { Mic, Upload, AlertCircle, CheckCircle, Key } from "lucide-react";
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
  const [lastError, setLastError] = useState<string>("");
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  
  // Embedded API key as requested
  const defaultApiKey = "ak-6ab1e48ed1e248b6b9769c10aba23ade";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLastError("");
    
    if (file) {
      console.log(`File selected: ${file.name}`);
      console.log(`File size: ${file.size} bytes`);
      console.log(`File type: ${file.type}`);
      
      // Validate file size
      if (file.size > 25 * 1024 * 1024) {
        const error = "Audio file must be less than 25MB";
        toast.error(error);
        setLastError(error);
        return;
      }
      
      if (file.size < 10000) { // Less than 10KB is probably too small
        const error = "Audio file seems too small. Please upload a longer recording.";
        toast.error(error);
        setLastError(error);
        return;
      }
      
      // Validate file type
      const validExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.webm'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      const isValidAudio = file.type.startsWith('audio/') || validExtensions.includes(fileExtension);
      
      if (!isValidAudio) {
        const error = "Please select a valid audio file (MP3, WAV, M4A, FLAC, OGG, or WEBM)";
        toast.error(error);
        setLastError(error);
        return;
      }
      
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      
      // Auto-generate voice name from filename if not set
      if (!voiceName.trim()) {
        const nameFromFile = file.name
          .split('.')[0]
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .trim()
          .substring(0, 50);
        setVoiceName(nameFromFile);
      }
      
      toast.success("Audio file loaded successfully!");
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
      
      // Try different MIME types for better compatibility
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }
      
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const file = new File([audioBlob], "recording.webm", { type: mimeType || 'audio/webm' });
        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(audioBlob));
        console.log(`Recording completed. Size: ${audioBlob.size} bytes`);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      toast.info("Recording started... Speak clearly for at least 30 seconds for best results");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording completed");
    }
  };

  const handleClone = async () => {
    console.log("=== STARTING VOICE CLONE PROCESS ===");
    setLastError("");
    
    // Validation
    if (!audioFile) {
      const error = "Please upload or record an audio sample";
      toast.error(error);
      setLastError(error);
      return;
    }
    
    if (!voiceName.trim()) {
      const error = "Please enter a name for the cloned voice";
      toast.error(error);
      setLastError(error);
      return;
    }
    
    if (voiceName.trim().length < 2 || voiceName.trim().length > 50) {
      const error = "Voice name must be between 2 and 50 characters";
      toast.error(error);
      setLastError(error);
      return;
    }
    
    const keyToUse = apiKey.trim() || defaultApiKey;
    console.log(`Using API key: ${keyToUse}`);
    console.log(`Voice name: ${voiceName.trim()}`);
    console.log(`Audio file size: ${audioFile.size} bytes`);
    
    setIsCloning(true);
    setProgress(0);
    
    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + 10;
      });
    }, 800);
    
    try {
      console.log("Calling cloneVoice function...");
      
      const result = await cloneVoice(voiceName.trim(), audioFile, keyToUse);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      console.log("Voice cloning successful:", result);
      
      // Success notification
      toast.success(`🎉 Voice "${result.name}" cloned successfully!`, {
        description: "You can now use this voice in calls",
        duration: 5000,
      });
      
      // Call the callback
      onVoiceCloned(result.voiceId, result.name);
      
      // Reset form
      setAudioFile(null);
      setVoiceName("");
      setAudioPreview(null);
      setProgress(0);
      setLastError("");
      
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Voice cloning failed:", errorMessage);
      
      // More specific error handling
      let userFriendlyError = errorMessage;
      if (errorMessage.includes('401') || errorMessage.includes('Invalid API key')) {
        userFriendlyError = "The API key is invalid or doesn't have voice cloning permissions. Please check your ElevenLabs account and ensure the API key has the correct permissions.";
        setShowApiKeyInput(true);
      } else if (errorMessage.includes('429')) {
        userFriendlyError = "Rate limit exceeded. Please wait a few minutes before trying again.";
      } else if (errorMessage.includes('400')) {
        userFriendlyError = "Bad request - please check your audio file format and voice name.";
      } else if (errorMessage.includes('403')) {
        userFriendlyError = "Access forbidden - your API key may not have voice cloning permissions enabled.";
      }
      
      setLastError(userFriendlyError);
      toast.error(`Voice cloning failed: ${userFriendlyError}`);
      
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Card className="border-echoes-purple/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Voice Cloning
          {audioFile && !lastError && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Create a voice clone by uploading an audio sample. For best results, use clear audio with at least 30 seconds of speech.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Status Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <Key className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                Using embedded API key: {defaultApiKey.substring(0, 8)}...
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-xs"
              >
                {showApiKeyInput ? "Hide" : "Use different key"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {lastError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>{lastError}</p>
                {lastError.includes('Invalid API key') && (
                  <div className="text-xs space-y-1">
                    <p><strong>Troubleshooting steps:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Verify the API key in your ElevenLabs account</li>
                      <li>Ensure voice cloning is enabled in your subscription</li>
                      <li>Check that the API key has the correct permissions</li>
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {showApiKeyInput && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2 mt-2">
                <Label htmlFor="api-key">Custom ElevenLabs API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your ElevenLabs API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Make sure your API key has voice cloning permissions enabled.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        
        <div className="space-y-2">
          <Label htmlFor="voice-name">Voice Name *</Label>
          <Input 
            id="voice-name"
            placeholder="Enter a name for this voice (e.g., John, Sarah)"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            maxLength={50}
            className={lastError && !voiceName.trim() ? "border-red-500" : ""}
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
                  accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.webm" 
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
              {progress === 100 ? "Complete!" : "Processing voice sample... This may take up to 2 minutes."}
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
      </CardContent>
    </Card>
  );
};

export default VoiceCloner;
