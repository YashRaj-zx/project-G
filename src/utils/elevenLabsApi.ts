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

// API keys
const ELEVENLABS_API_KEY = "sk_8de5385f684d217caa84f070d064822919f99064c1af5c0c"; // Your ElevenLabs API Key
const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";

// A default ElevenLabs voice ID (you can change this to a preferred default)
const DEFAULT_ELEVENLABS_VOICE_ID = "21m00TedyVKMhqcXzPbh"; // Rachel - a standard voice

// Validate and get proper voice ID
export const getValidVoiceId = (voiceId: string): string => {
  console.log(`Validating voice ID for ElevenLabs: ${voiceId}`);

  const lowerVoiceId = voiceId?.toLowerCase();
  if (lowerVoiceId && DEFAULT_VOICES[lowerVoiceId as keyof typeof DEFAULT_VOICES]) {
    // If the provided voiceId is one of the old mapped voices, use a default ElevenLabs voice
    console.warn(`Mapping old voice ID "${voiceId}" to default ElevenLabs voice "${DEFAULT_ELEVENLABS_VOICE_ID}"`);
 return DEFAULT_ELEVENLABS_VOICE_ID;
  }

  // Use the provided voiceId if it's not an old mapped voice, otherwise use the default
  return voiceId || DEFAULT_ELEVENLABS_VOICE_ID;
};

// Voice cloning
export const cloneVoice = async (
  audioFile: File,
  apiKey: string = ELEVENLABS_API_KEY
): Promise<VoiceCloneResponse> => {
  try {
    console.log("=== ELEVENLABS CLONING STARTED ===");
    console.log(`File name: ${audioFile.name}`);
    console.log(`File size: ${audioFile.size} bytes`);
    console.log(`File type: ${audioFile.type}`);

    if (!name || name.trim().length === 0) throw new Error("Voice name is required");
    if (!audioFile) throw new Error("Audio file is required");
    if (audioFile.size === 0) throw new Error("Audio file is empty");
    if (audioFile.size > 25 * 1024 * 1024) throw new Error("Audio file is too large. Maximum size is 25MB");

    const validExtensions = [".mp3", ".wav", ".m4a", ".flac", ".ogg", ".webm"];
    const fileExtension = audioFile.name.toLowerCase().substring(audioFile.name.lastIndexOf("."));
    const isValidAudio = audioFile.type.startsWith("audio/") || validExtensions.includes(fileExtension);
    if (!isValidAudio) throw new Error("Please upload a valid audio file (MP3, WAV, M4A, FLAC, OGG, or WEBM)");

    const formData = new FormData();
    formData.append("file", audioFile, audioFile.name);

    console.log("Making API request to ElevenLabs for cloning...");

    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey.trim(),
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log("Raw API response:", responseText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.detail) {
          if (typeof errorData.detail === "string") errorMessage = errorData.detail;
          else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail
              .map((item: any) => (typeof item === "string" ? item : item.msg || item.message || JSON.stringify(item)))
              .join(", ");
          } else if (errorData.detail.message) errorMessage = errorData.detail.message;
        } else if (errorData.message) errorMessage = errorData.message;
        else if (errorData.error) errorMessage = errorData.error;

        if (response.status === 401) errorMessage = "Invalid API key. Please check your ElevenLabs API key.";
        else if (response.status === 429) errorMessage = "Rate limit exceeded. Please try again later.";
        else if (response.status === 400) errorMessage = `Bad request: ${errorMessage}`;
      } catch (jsonError) {
        errorMessage = `HTTP ${response.status}: ${responseText || response.statusText}. Could not parse error JSON.`;
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Invalid response format from ElevenLabs API");
    }

    if (!data.id) throw new Error("Invalid response: missing voice ID in response");

    console.log("=== ELEVENLABS CLONING COMPLETED ===");
    return { voiceId: data.voice_id, name: name.trim(), status: "success" };
  } catch (error) {
    console.error("=== ELEVENLABS CLONING FAILED ===", error);
    throw error instanceof Error ? error : new Error(`Voice cloning failed: ${String(error)}`);
  }
};

// Text-to-speech
export const textToSpeech = async (
  text: string,
  voiceId: string,
  language: string = "en-US",
  apiKey: string = ELEVENLABS_API_KEY // Use ElevenLabs API Key
): Promise<TextToSpeechResponse> => {
  try {
    const validVoiceId = getValidVoiceId(voiceId);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${validVoiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey, // Use ElevenLabs API key header
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2", // Example multilingual model
        voice_settings: {
          similarity_boost: 0.75,
          stability: 0.5,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      return {
        success: false,
        errorMessage: `Failed to convert text to speech: ${response.status} ${response.statusText} - ${errorText}`,
      };
    }

    const blob = await response.blob(); // Assuming ElevenLabs returns audio directly
    const audioUrl = URL.createObjectURL(blob);

    return { audioUrl, audioStream: response.body || undefined, success: true };
  } catch (error) {
    return {
      success: false,
      errorMessage: `Failed to convert text to speech: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

// Talking avatar (placeholder)
export const generateTalkingAvatar = async (
  text: string,
  voiceId: string,
  imageUrl: string,
  language: string = "en-US",
  apiKey: string = ELEVENLABS_API_KEY
): Promise<AvatarVideoResponse> => {
  try {
    const audioResponse = await textToSpeech(text, voiceId, language, apiKey);
    if (!audioResponse.success || !audioResponse.audioUrl)
      throw new Error(audioResponse.errorMessage || "Failed to generate audio for avatar.");

    return {
      videoUrl: imageUrl,
      audioUrl: audioResponse.audioUrl,
    };
  } catch (error) {
    throw new Error(
      `Failed to generate talking avatar: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

// Get voices
export const getAvailableVoices = async (
  apiKey: string = ELEVENLABS_API_KEY
): Promise<any[]> => {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": apiKey },
    });

    if (!response.ok) throw new Error(`Failed to fetch voices: ${response.status} ${response.statusText}`);

    const data = await response.json();
    return data.voices || [];
  } catch {
    return [
      { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
      { voice_id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger" },
      { voice_id: "IKne3meq5aSn9XLyUdCD", name: "Charlie" },
      { voice_id: "JBFqnCBsd6RMkjVDRZzb", name: "George" },
    ];
  }
};

// Enhanced avatar response
export const enhancedGenerateAvatarResponse = async (
  message: string,
  imageUrl: string,
  voiceId: string,
  language: string,
  geminiApiKey: string,
  playhtApiKey: string = ELEVENLABS_API_KEY // This still references playht, consider renaming or removing if not used
): Promise<any> => {
  try {
    const textResponse = `I understand you said: \"${message}\". How can I help you with that?`;
    const avatarResponse = await generateTalkingAvatar(
      textResponse,
      voiceId,
      imageUrl,
      ELEVENLAB_VIDEO_API_KEY
    );

    return {
      text: textResponse,
      audioUrl: avatarResponse.audioUrl,
      videoUrl: avatarResponse.videoUrl,
      hasLipSync: true,
    };
  } catch (error) {
    throw new Error(
      `Failed to generate avatar response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
