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
  audioStream?: ReadableStream<Uint8Array>;
}

interface AvatarVideoResponse {
  videoUrl: string;
  audioUrl: string;
}

// Play.ht credentials
const PLAYHT_API_KEY = "ak-6ab1e48ed1e248b6b9769c10aba23ade";
const PLAYHT_USER_ID = "x9zwH7tV4ac6QajGjHG0TLjS2ao2";

// Default voices for fallback
const DEFAULT_VOICES = {
  sarah: "s3://voice-cloning-uploads/b29c6429-0c51-4173-8ff5-2d64b5a22877/charlotte/manifest.json",
  roger: "s3://voice-cloning-uploads/e229b6d2-1e4f-4791-99c5-04a767a168e8/julie/manifest.json",
  charlie: "IKne3meq5aSn9XLyUdCD",
  george: "JBFqnCBsd6RMkjVDRZzb",
  aria: "9BWtsMINqrJLrRacOk9x",
  laura: "FGY2WhTYpPnrIDTdsKH5",
};

// Helper: Validate and map voice IDs
export const getValidVoiceId = (voiceId: string): string => {
  if (voiceId?.startsWith("s3://")) return voiceId;

  const lower = voiceId?.toLowerCase();
  if (lower && DEFAULT_VOICES[lower as keyof typeof DEFAULT_VOICES]) {
    return DEFAULT_VOICES[lower as keyof typeof DEFAULT_VOICES];
  }

  return DEFAULT_VOICES.sarah;
};

// Play.ht API base
const PLAYHT_API_BASE = "https://api.play.ht/api/v2";

// -------- Voice Cloning --------
export const cloneVoice = async (
  audioFile: File,
  name: string
): Promise<VoiceCloneResponse> => {
  try {
    if (!audioFile) throw new Error("Audio file is required");
    if (!name || !name.trim()) throw new Error("Voice name is required");

    const formData = new FormData();
    formData.append("file", audioFile, audioFile.name);
    formData.append("voice", name); // voice name required by Play.ht

    const response = await fetch(`${PLAYHT_API_BASE}/cloned-voices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PLAYHT_API_KEY}`,
        "X-User-ID": PLAYHT_USER_ID,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || `Failed to clone voice: ${response.statusText}`);
    }

    return {
      voiceId: data.id,
      name: data.name || name,
      status: data.status || "success",
    };
  } catch (err) {
    throw new Error(`Voice cloning failed: ${(err as Error).message}`);
  }
};

// -------- Text-to-Speech --------
export const textToSpeech = async (
  text: string,
  voiceId: string,
  language: string = "en-US"
): Promise<TextToSpeechResponse> => {
  try {
    const validVoiceId = getValidVoiceId(voiceId);

    const response = await fetch(`${PLAYHT_API_BASE}/tts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PLAYHT_API_KEY}`,
        "X-User-ID": PLAYHT_USER_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice: validVoiceId,
        quality: "high",
        output_format: "mp3",
        sample_rate: 44100,
        voice_engine: "PlayHT2.0-turbo", // recommended latest
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, errorMessage: errText };
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);

    return { success: true, audioUrl };
  } catch (err) {
    return { success: false, errorMessage: (err as Error).message };
  }
};

// -------- Talking Avatar (Placeholder) --------
export const generateTalkingAvatar = async (
  text: string,
  voiceId: string,
  imageUrl: string,
  language: string = "en-US"
): Promise<AvatarVideoResponse> => {
  const audioResponse = await textToSpeech(text, voiceId, language);

  if (!audioResponse.success || !audioResponse.audioUrl) {
    throw new Error(audioResponse.errorMessage || "Failed to generate audio");
  }

  // Stubbed video response (replace with D-ID, Synthesia, etc. in real apps)
  return {
    videoUrl: imageUrl,
    audioUrl: audioResponse.audioUrl,
  };
};
