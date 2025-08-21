import fs from "fs";

// -------- Types --------
export interface VoiceCloneResponse {
  voiceId: string;
  name: string;
  status: string;
}

// -------- Config --------
const PLAYHT_API_BASE = "https://api.play.ht/api/v2";
const PLAYHT_API_KEY = process.env.PLAYHT_API_KEY || "";
const PLAYHT_USER_ID = process.env.PLAYHT_USER_ID || "";

// -------- Voice Cloning (MP3 Input) --------
export const cloneVoice = async (
  audioFile: File | Blob | Buffer | string,
  name?: string
): Promise<VoiceCloneResponse> => {
  try {
    if (!audioFile) throw new Error("Audio file is required");

    let fileBlob: Blob;
    let fileName: string = "sample.mp3";

    if (typeof audioFile === "string") {
      // File path case (Node.js)
      const buffer = fs.readFileSync(audioFile);
      fileBlob = new Blob([buffer], { type: "audio/mpeg" });
      fileName = audioFile.split("/").pop() || "sample.mp3";
    } else if (audioFile instanceof Buffer) {
      fileBlob = new Blob([audioFile], { type: "audio/mpeg" });
    } else if (audioFile instanceof Blob) {
      fileBlob = audioFile;
    } else {
      // Browser File case
      fileBlob = audioFile as File;
      fileName = (audioFile as File).name || "sample.mp3";
    }

    // Generate safe name if not provided
    let voiceName: string;
    if (typeof name === "string" && name.trim()) {
      voiceName = name.trim();
    } else {
      voiceName = fileName.replace(/\.[^/.]+$/, "") || "custom-voice";
    }

    const formData = new FormData();
    formData.append("file", fileBlob, fileName);
    formData.append("voice", voiceName);

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
      name: data.name || voiceName,
      status: data.status || "success",
    };
  } catch (err) {
    throw new Error(`Voice cloning failed: ${(err as Error).message}`);
  }
};

// -------- Text to Speech --------
export const textToSpeech = async (
  text: string,
  voiceId: string,
  languageCode: string = "en-US" // Default to English, can be updated for other languages like 'te-IN' for Telugu
): Promise<{ audioUrl: string }> => {
  try {
    const response = await fetch(`${PLAYHT_API_BASE}/tts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PLAYHT_API_KEY}`,
        "X-User-ID": PLAYHT_USER_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice_id: voiceId,
        output_format: "mp3", // Or other supported formats
        // Add other parameters for emotional tone or style if supported by Play.ht API
        // For multi-language, Play.ht often handles this based on the voice_id or text content,
        // but some APIs might require a language code parameter.
        // language_code: languageCode, // Uncomment if Play.ht requires this
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || `Failed to convert text to speech: ${response.statusText}`);
    return { audioUrl: data.audio_url };
  } catch (err) {
    throw new Error(`Text to speech failed: ${(err as Error).message}`);
  }
};
