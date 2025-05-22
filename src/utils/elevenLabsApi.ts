
// ElevenLabs API integration for voice cloning and synthesis

interface VoiceCloneResponse {
  voiceId: string;
  name: string;
}

interface TextToSpeechResponse {
  audioUrl: string;
}

// Function to clone a voice using ElevenLabs API
export const cloneVoice = async (
  name: string,
  audioFile: File,
  apiKey: string = "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347"
): Promise<VoiceCloneResponse> => {
  try {
    console.log(`Cloning voice with name: ${name}`);
    
    // Create a form data object
    const formData = new FormData();
    formData.append('name', name);
    formData.append('files', audioFile);
    formData.append('description', `Cloned voice for ${name}`);
    
    // Make the actual API call to ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey || "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347",
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs API error:", errorData);
      throw new Error(`Failed to clone voice: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Voice cloning response:", data);
    
    // Return the voice ID and name from the API response
    return {
      voiceId: data.voice_id,
      name: name,
    };
  } catch (error) {
    console.error("Error cloning voice:", error);
    throw new Error(`Failed to clone voice: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Function to convert text to speech using ElevenLabs
export const textToSpeech = async (
  text: string,
  voiceId: string,
  apiKey: string = "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347"
): Promise<TextToSpeechResponse> => {
  try {
    console.log(`Converting text to speech using voice ID: ${voiceId}`);
    console.log(`Text to synthesize: "${text}"`);
    
    // Make the API call to ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey || "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347",
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
      const errorData = await response.json().catch(() => ({}));
      console.error("Text to speech API error:", errorData);
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

// Get available voices from ElevenLabs
export const getAvailableVoices = async (apiKey: string = "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347"): Promise<any[]> => {
  try {
    console.log("Fetching available voices from ElevenLabs API");
    
    // Fetch available voices from ElevenLabs
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        'xi-api-key': apiKey || "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347",
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

// Enhanced function to generate avatar response with voice
export const enhancedGenerateAvatarResponse = async (
  message: string,
  imageUrl: string,
  voiceId: string,
  language: string,
  geminiApiKey: string,
  elevenLabsApiKey: string = "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347"
): Promise<any> => {
  try {
    console.log(`Generating enhanced avatar response:
      - Message: ${message}
      - Image URL: ${imageUrl}
      - Voice ID: ${voiceId}
      - Language: ${language}
      - API Key: [REDACTED]`);
    
    // For demo, we'll use the input message as the response text instead of Gemini API
    // In a production app, you would integrate with Gemini API here
    const textResponse = message;
    
    console.log(`Generated text response: "${textResponse}"`);
    
    // Generate audio using ElevenLabs
    console.log("Calling text-to-speech API...");
    const speechResponse = await textToSpeech(
      textResponse,
      voiceId,
      elevenLabsApiKey
    );
    
    console.log("Successfully generated speech response with audio URL:", speechResponse.audioUrl);
    
    // Return combined response
    return {
      text: textResponse,
      audioUrl: speechResponse.audioUrl,
      videoUrl: imageUrl, // Using the same image URL for now
    };
  } catch (error) {
    console.error("Error generating enhanced avatar response:", error);
    throw new Error(`Failed to generate avatar response: ${error instanceof Error ? error.message : String(error)}`);
  }
};
