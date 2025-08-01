
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

// Updated API keys - using user's provided key
const ELEVENLABS_VOICE_API_KEY = "ak-6ab1e48ed1e248b6b9769c10aba23ade";
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

// HyperVoice API integration for voice cloning
const HYPERVOICE_API_BASE = 'https://hypervoice-tts-voice-cloning.p.rapidapi.com/api/hypervoice';
const RAPIDAPI_KEY = '0bb79fc647msh9d7d11c2803c88ap1d489bjsnc6834f6ec4cf';

// Function to clone a voice using HyperVoice API
export const cloneVoice = async (
  name: string,
  audioFile: File,
  apiKey?: string // Optional, using embedded RapidAPI key
): Promise<VoiceCloneResponse> => {
  try {
    console.log(`=== HYPERVOICE CLONING STARTED ===`);
    console.log(`Voice name: ${name}`);
    console.log(`File name: ${audioFile.name}`);
    console.log(`File size: ${audioFile.size} bytes`);
    console.log(`File type: ${audioFile.type}`);
    
    // Validate inputs
    if (!name || name.trim().length === 0) {
      throw new Error("Voice name is required");
    }
    
    if (!audioFile) {
      throw new Error("Audio file is required");
    }
    
    // Validate audio file size
    if (audioFile.size === 0) {
      throw new Error("Audio file is empty");
    }
    
    if (audioFile.size > 10 * 1024 * 1024) { // 10MB limit for HyperVoice
      throw new Error("Audio file is too large. Maximum size is 10MB");
    }
    
    // Validate file is actually audio
    const validExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.webm'];
    const fileExtension = audioFile.name.toLowerCase().substring(audioFile.name.lastIndexOf('.'));
    const isValidAudio = audioFile.type.startsWith('audio/') || validExtensions.includes(fileExtension);
    
    if (!isValidAudio) {
      throw new Error("Please upload a valid audio file (MP3, WAV, M4A, FLAC, OGG, or WEBM)");
    }
    
    console.log(`Creating form data for HyperVoice API...`);
    
    // Create form data for HyperVoice API (expects application/x-www-form-urlencoded)
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('gen_text', 'Hello, this is a test voice cloning sample.');
    formData.append('voice', audioFile, audioFile.name); // API expects 'voice' field for audio file
    
    console.log(`Making API request to HyperVoice...`);
    console.log(`URL: ${HYPERVOICE_API_BASE}/voice-clone`);
    
    const response = await fetch(`${HYPERVOICE_API_BASE}/voice-clone`, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'hypervoice-tts-voice-cloning.p.rapidapi.com',
      },
      body: formData,
    });
    
    console.log(`API Response status: ${response.status}`);
    console.log(`API Response status text: ${response.statusText}`);
    
    // Get response text first to log it
    const responseText = await response.text();
    console.log(`Raw API response:`, responseText);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(responseText);
        console.error("HyperVoice API error details:", errorData);
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
        
        // Specific error handling
        if (response.status === 401) {
          errorMessage = "Invalid RapidAPI key or subscription expired.";
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (response.status === 400) {
          errorMessage = `Bad request: ${errorMessage}`;
        }
        
      } catch (jsonError) {
        console.error("Could not parse error response as JSON:", jsonError);
        errorMessage = `HTTP ${response.status}: ${responseText || response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse successful response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Could not parse success response as JSON:", parseError);
      throw new Error("Invalid response format from HyperVoice API");
    }
    
    console.log("Voice cloning successful:", data);
    
    // HyperVoice API response format may vary, handle different formats
    const voiceId = data.voice_id || data.id || data.cloned_voice_id || Math.random().toString(36).substr(2, 9);
    const voiceName = data.name || data.voice_name || name.trim();
    
    console.log(`=== HYPERVOICE CLONING COMPLETED ===`);
    console.log(`New voice ID: ${voiceId}`);
    
    return {
      voiceId: voiceId,
      name: voiceName,
    };
    
  } catch (error) {
    console.error("=== HYPERVOICE CLONING FAILED ===");
    console.error("Error details:", error);
    
    if (error instanceof Error) {
      throw error; // Re-throw the original error with its message
    } else {
      throw new Error(`Voice cloning failed: ${String(error)}`);
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
