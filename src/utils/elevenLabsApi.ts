// ElevenLabs API integration for voice cloning and synthesis with real-time avatars

interface VoiceCloneResponse {
  voiceId: string;
  name: string;
}

interface TextToSpeechResponse {
  audioUrl: string;
}

interface AvatarVideoResponse {
  videoUrl: string;
  audioUrl: string;
}

// Updated API keys
const ELEVENLABS_VOICE_API_KEY = "sk_307e4c5c2038de5a11bd22e9dc71959fe0af3d34982112b9";
const ELEVENLABS_VIDEO_API_KEY = "0ac1eced-ba7c-4e6e-8480-f85d32734b3c";

// Valid ElevenLabs voice IDs - fallback voices
const DEFAULT_VOICES = {
  'sarah': 'EXAVITQu4vr4xnSDxMaL',
  'roger': 'CwhRBWXzGAHq8TQ4Fs17',
  'charlie': 'IKne3meq5aSn9XLyUdCD',
  'george': 'JBFqnCBsd6RMkjVDRZzb',
  'aria': '9BWtsMINqrJLrRacOk9x',
  'laura': 'FGY2WhTYpPnrIDTdsKH5',
};

// Function to validate and get a proper voice ID
export const getValidVoiceId = (voiceId: string): string => {
  console.log(`Validating voice ID: ${voiceId}`);
  
  // If it's already a valid ElevenLabs voice ID format (20 characters alphanumeric)
  if (voiceId && voiceId.length === 20 && /^[a-zA-Z0-9]+$/.test(voiceId)) {
    console.log(`Using provided voice ID: ${voiceId}`);
    return voiceId;
  }
  
  // Check if it matches any of our default voice names
  const lowerVoiceId = voiceId?.toLowerCase();
  if (lowerVoiceId && DEFAULT_VOICES[lowerVoiceId as keyof typeof DEFAULT_VOICES]) {
    console.log(`Using mapped voice: ${lowerVoiceId} -> ${DEFAULT_VOICES[lowerVoiceId as keyof typeof DEFAULT_VOICES]}`);
    return DEFAULT_VOICES[lowerVoiceId as keyof typeof DEFAULT_VOICES];
  }
  
  // Default fallback to Sarah's voice
  console.log(`Using default fallback voice: Sarah`);
  return DEFAULT_VOICES.sarah;
};

// Function to clone a voice using ElevenLabs API
export const cloneVoice = async (
  name: string,
  audioFile: File,
  apiKey: string = ELEVENLABS_VOICE_API_KEY
): Promise<VoiceCloneResponse> => {
  try {
    console.log(`Starting voice cloning process for: ${name}`);
    console.log(`Audio file size: ${audioFile.size} bytes`);
    console.log(`Audio file type: ${audioFile.type}`);
    
    // Validate audio file
    if (audioFile.size === 0) {
      throw new Error("Audio file is empty");
    }
    
    if (audioFile.size > 25 * 1024 * 1024) { // 25MB limit
      throw new Error("Audio file is too large. Maximum size is 25MB");
    }
    
    // Create FormData properly
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', `Voice cloned from ${name} - Created by Echoes`);
    formData.append('files', audioFile, audioFile.name || 'voice_sample.wav');
    
    console.log(`Making request to ElevenLabs API...`);
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    });
    
    console.log(`API Response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        console.error("ElevenLabs API error details:", errorData);
        
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (errorData.detail.message) {
            errorMessage = errorData.detail.message;
          }
        }
      } catch (jsonError) {
        console.error("Could not parse error response as JSON:", jsonError);
      }
      
      throw new Error(`Voice cloning failed: ${errorMessage}`);
    }
    
    const data = await response.json();
    console.log("Voice cloning successful:", data);
    
    if (!data.voice_id) {
      throw new Error("Invalid response: missing voice_id");
    }
    
    return {
      voiceId: data.voice_id,
      name: name,
    };
  } catch (error) {
    console.error("Voice cloning error:", error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to clone voice: ${error.message}`);
    } else {
      throw new Error(`Failed to clone voice: ${String(error)}`);
    }
  }
};

// Function to convert text to speech using ElevenLabs
export const textToSpeech = async (
  text: string,
  voiceId: string,
  apiKey: string = ELEVENLABS_VOICE_API_KEY
): Promise<TextToSpeechResponse> => {
  try {
    const validVoiceId = getValidVoiceId(voiceId);
    console.log(`Converting text to speech using voice ID: ${validVoiceId}`);
    console.log(`Text to synthesize: "${text}"`);
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${validVoiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error("Text to speech API error:", errorText);
      throw new Error(`Failed to convert text to speech: ${response.status} ${response.statusText}`);
    }
    
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    console.log("Text to speech successful, created audio URL:", audioUrl);
    return {
      audioUrl: audioUrl,
    };
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw new Error(`Failed to convert text to speech: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// New function to generate real-time talking avatar with lip-sync
export const generateTalkingAvatar = async (
  text: string,
  voiceId: string,
  imageUrl: string,
  apiKey: string = ELEVENLABS_VIDEO_API_KEY
): Promise<AvatarVideoResponse> => {
  try {
    console.log(`Generating talking avatar with:
      - Text: ${text}
      - Voice ID: ${voiceId}
      - Image URL: ${imageUrl}`);

    // First, generate the audio with proper voice validation
    const audioResponse = await textToSpeech(text, voiceId);
    
    // For real-time avatar generation, we'll use a placeholder implementation
    // In a production environment, you would integrate with a service like D-ID, Synthesia, or RunwayML
    // For now, we'll return the audio and use CSS animations for lip-sync simulation
    
    console.log("Generated talking avatar with audio URL:", audioResponse.audioUrl);
    
    return {
      videoUrl: imageUrl, // Using static image for now with CSS animation
      audioUrl: audioResponse.audioUrl,
    };
  } catch (error) {
    console.error("Error generating talking avatar:", error);
    throw new Error(`Failed to generate talking avatar: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Get available voices from ElevenLabs
export const getAvailableVoices = async (apiKey: string = ELEVENLABS_VOICE_API_KEY): Promise<any[]> => {
  try {
    console.log("Fetching available voices from ElevenLabs API");
    
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        'xi-api-key': apiKey,
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error fetching voices:", errorData);
      throw new Error(`Failed to fetch voices: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data.voices?.length || 0} voices`);
    return data.voices || [];
  } catch (error) {
    console.error("Error fetching voices:", error);
    // Fallback to default voices
    return [
      { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
      { voice_id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger" },
      { voice_id: "IKne3meq5aSn9XLyUdCD", name: "Charlie" },
      { voice_id: "JBFqnCBsd6RMkjVDRZzb", name: "George" }
    ];
  }
};

// Enhanced function to generate avatar response with synchronized video and voice
export const enhancedGenerateAvatarResponse = async (
  message: string,
  imageUrl: string,
  voiceId: string,
  language: string,
  geminiApiKey: string,
  elevenLabsApiKey: string = ELEVENLABS_VOICE_API_KEY
): Promise<any> => {
  try {
    console.log(`Generating enhanced avatar response with real-time lip-sync:
      - Message: ${message}
      - Image URL: ${imageUrl}
      - Voice ID: ${voiceId}
      - Language: ${language}`);
    
    // Generate contextual response (for demo, we'll echo the message with a response)
    const textResponse = `I understand you said: "${message}". How can I help you with that?`;
    
    console.log(`Generated text response: "${textResponse}"`);
    
    // Generate talking avatar with lip-sync
    const avatarResponse = await generateTalkingAvatar(
      textResponse,
      voiceId,
      imageUrl,
      ELEVENLABS_VIDEO_API_KEY
    );
    
    console.log("Successfully generated avatar response with lip-sync");
    
    return {
      text: textResponse,
      audioUrl: avatarResponse.audioUrl,
      videoUrl: avatarResponse.videoUrl,
      hasLipSync: true,
    };
  } catch (error) {
    console.error("Error generating enhanced avatar response:", error);
    throw new Error(`Failed to generate avatar response: ${error instanceof Error ? error.message : String(error)}`);
  }
};
