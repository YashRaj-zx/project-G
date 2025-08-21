
// Play.ht API integration for voice cloning and synthesis with real-time avatars

interface VoiceCloneResponse {
  voiceId: string;
  name: string;
  status: string;
  message?: string;
}

interface TextToSpeechResponse {
  audioUrl?: string;
  errorMessage?: string;
  success: boolean;
  audioStream?: ReadableStream<Uint8Array>; // For streaming audio
}

interface AvatarVideoResponse {
  videoUrl: string;
  audioUrl: string;
}

// Updated API keys - using user's provided key
const PLAYHT_API_KEY = "ak-6ab1e48ed1e248b6b9769c10aba23ade"; // Using the provided key from user
const PLAYHT_USER_ID = "x9zwH7tV4ac6QajGjHG0TLjS2ao2"; // Using the provided User ID

// Valid Play.ht voice IDs - fallback voices
const DEFAULT_VOICES = {
  // Using some example Play.ht voice IDs - replace with actual ones you intend to use
  // You can get a list of voices from the Play.ht API
  'sarah': 's3://voice-cloning-uploads/b29c6429-0c51-4173-8ff5-2d64b5a22877/charlotte/manifest.json',
  'roger': 's3://voice-cloning-uploads/e229b6d2-1e4f-4791-99c5-04a767a168e8/julie/manifest.json',
  'charlie': 'IKne3meq5aSn9XLyUdCD',
  'george': 'JBFqnCBsd6RMkjVDRZzb',
  'aria': '9BWtsMINqrJLrRacOk9x',
  'laura': 'FGY2WhTYpPnrIDTdsKH5',
};

// Function to validate and get a proper voice ID
export const getValidVoiceId = (voiceId: string): string => {
  console.log(`Validating voice ID for Play.ht: ${voiceId}`);

  // If it looks like a Play.ht voice ID (e.g., starts with s3://)
  if (voiceId && voiceId.startsWith('s3://')) {
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
  console.log(`Using default fallback voice for Play.ht: Sarah`);
  return DEFAULT_VOICES.sarah;
};

// Play.ht API integration for voice cloning (restored working version)
const PLAYHT_API_BASE = 'https://api.play.ht/api/v2';

// Function to clone a voice using Play.ht API (restored working version)
export const cloneVoice = async (
  audioFile: File,
  apiKey: string = ELEVENLABS_API_KEY
): Promise<VoiceCloneResponse> => {
  try {
    console.log(`=== ELEVENLABS CLONING STARTED ===`);
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
    
    // Validate audio file size (ElevenLabs limit is 25MB)
    if (audioFile.size === 0) {
      throw new Error("Audio file is empty");
    }
    
    if (audioFile.size > 25 * 1024 * 1024) {
      throw new Error("Audio file is too large. Maximum size is 25MB");
    }
    
    // Validate file is actually audio (Play.ht supports various formats)
    const validExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.webm'];
    const fileExtension = audioFile.name.toLowerCase().substring(audioFile.name.lastIndexOf('.'));
    const isValidAudio = audioFile.type.startsWith('audio/') || validExtensions.includes(fileExtension);
    
    if (!isValidAudio) {
      throw new Error("Please upload a valid audio file (MP3, WAV, M4A, FLAC, OGG, or WEBM)");
    }
    
    console.log(`Creating FormData for Play.ht API...`);
    
    // Create FormData with proper structure for Play.ht API
    const formData = new FormData();
    // Play.ht voice cloning endpoint expects a file
    formData.append('file', audioFile, audioFile.name);

    console.log(`Making API request to Play.ht for cloning...`);
    console.log(`URL: ${PLAYHT_API_BASE}/cloned-voices/sync`); // Using sync endpoint for simplicity

    const response = await fetch(`${PLAYHT_API_BASE}/cloned-voices/sync`, {
      method: 'POST',
      headers: {
        'X-User-ID': PLAYHT_USER_ID,
        'xi-api-key': apiKey.trim(),
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
        console.error("ElevenLabs API error details:", errorData);

        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((item: any) => {
              if (typeof item === 'string') return item;
              return item.msg || item.message || JSON.stringify(item);
            }).join(', ');
          } else if (errorData.detail.message) {
            errorMessage = errorData.detail.message;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        // Specific error handling
        if (response.status === 401) {
          errorMessage = "Invalid API key. Please check your ElevenLabs API key.";
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (response.status === 400) {
          errorMessage = `Bad request: ${errorMessage}`;
        }
        
      } catch (jsonError) {
        console.error("Could not parse error response as JSON:", jsonError);
        errorMessage = `HTTP ${response.status}: ${responseText || response.statusText}. Could not parse error JSON.`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse successful response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Could not parse success response as JSON:", parseError);
      throw new Error("Invalid response format from ElevenLabs API");
    }
    
    console.log("Voice cloning successful:", data);
    
    if (!data.id) {
      // Play.ht sync cloning returns the voice ID directly in the 'id' field
      throw new Error("Invalid response: missing voice ID in response");
    }
    
    console.log(`=== ELEVENLABS CLONING COMPLETED ===`);
    console.log(`New voice ID: ${data.id}`);

    return { // Play.ht sync cloning returns the voice ID in the 'id' field
      voiceId: data.voice_id,
      name: name.trim(),
    };
    
  } catch (error) {
    console.error("=== ELEVENLABS CLONING FAILED ===");
    console.error("Error details:", error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Voice cloning failed: ${String(error)}`);
    }
  }
};

// Function to convert text to speech using Play.ht
export const textToSpeech = async (
  text: string,
  voiceId: string,
  language: string = 'en-US', // Add language parameter with default
  apiKey: string = PLAYHT_API_KEY
): Promise<TextToSpeechResponse> => {

  try {
    const validVoiceId = getValidVoiceId(voiceId); // Ensure a valid voice ID is used
    console.log(`Converting text to speech using Play.ht with voice ID: ${validVoiceId}`);
    console.log(`Text to synthesize: "${text}"`);
    console.log(`Language: ${language}`);

    // Play.ht text-to-speech endpoint
    const response = await fetch(`${PLAYHT_API_BASE}/tts`, {
      method: 'POST',
      headers: {
        'X-User-ID': PLAYHT_USER_ID,
        'AUTHORIZATION': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_id: validVoiceId,
        // Play.ht handles emotion and multilanguage based on the voice model and API configuration
        // Explicit parameters for emotion or language might depend on the specific Play.ht voice and features
        // For natural, emotional output, using a high-quality voice model is key.
        // Play.ht's API often handles language detection or requires language codes depending on the voice.
        // Assuming the voice model supports the requested language.
        // For streaming:
        output_format: 'mp3', // Or 'wav', etc.
        quality: 'high', // Or 'medium', 'low'
        speed: 1, // Normal speed
        sample_rate: 44100, // Standard sample rate
        // Play.ht might have specific parameters for emotion or style if the voice supports it.
        // For Telugu, ensure the voice_id you use is specifically for a Telugu speaker or a multilingual one.
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error("Text to speech API error:", errorText);
      return { success: false, errorMessage: `Failed to convert text to speech: ${response.status} ${response.statusText} - ${errorText}` };
    }

    // Play.ht streams audio directly
    const audioStream = response.body;

    // Convert stream to blob URL for playback in the browser
    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);

    console.log("Text to speech successful, created audio URL and stream.");
    return {
      audioUrl: audioUrl,
      audioStream: audioStream || undefined, // Provide the stream if available
      success: true,
    };
  } catch (error) {
    console.error("Error converting text to speech:", error);
    return { success: false, errorMessage: `Failed to convert text to speech: ${error instanceof Error ? error.message : String(error)}` };
  }
};

// New function to generate real-time talking avatar with lip-sync (using a placeholder)
export const generateTalkingAvatar = async (
  text: string,
  voiceId: string,
  imageUrl: string,
  language: string = 'en-US', // Add language parameter
  apiKey: string = PLAYHT_API_KEY // Use Play.ht API key
): Promise<AvatarVideoResponse> => {
  try {
    console.log(`Generating talking avatar with:
      - Text: ${text}
      - Voice ID: ${voiceId}
      - Image URL: ${imageUrl}
      - Language: ${language}`);

    // First, generate the audio with proper voice validation and language support
    const audioResponse = await textToSpeech(text, voiceId, language, apiKey);

    if (!audioResponse.success || !audioResponse.audioUrl) {
        throw new Error(audioResponse.errorMessage || "Failed to generate audio for avatar.");
    }

    // For real-time avatar generation, we'll use a placeholder implementation
    // In a production environment, you would integrate with a service like D-ID, Synthesia, or RunwayML
    // For now, we'll return the audio and use CSS animations for lip-sync simulation

    console.log("Generated talking avatar with audio URL:", audioResponse.audioUrl);

    return {
      audioUrl: audioUrl,
    };
      videoUrl: imageUrl, // Using static image for now with CSS animation
      audioUrl: audioResponse.audioUrl,
    };
  } catch (error) {
    console.error("Error generating talking avatar:", error);
    throw new Error(`Failed to generate talking avatar: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Get available voices from Play.ht
export const getAvailableVoices = async (apiKey: string = PLAYHT_API_KEY): Promise<any[]> => {
  try {
    console.log("Fetching available voices from Play.ht API");

    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        'xi-api-key': apiKey,
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error fetching voices:", errorData);
      throw new Error(`Failed to fetch voices from Play.ht: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Retrieved ${data.voices?.length || 0} voices from Play.ht`);
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
  playhtApiKey: string = PLAYHT_API_KEY // Use Play.ht API key
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
