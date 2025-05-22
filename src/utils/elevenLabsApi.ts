
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
    formData.append('audio', audioFile);
    
    // This would be the actual API call in production
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey || "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347",
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to clone voice');
    }
    
    const data = await response.json();
    
    // Return the voice ID and name from the API response
    return {
      voiceId: data.voice_id,
      name: name,
    };
  } catch (error) {
    console.error("Error cloning voice:", error);
    throw new Error("Failed to clone voice");
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
    
    // Make the actual API call to ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey || "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to convert text to speech');
    }
    
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return {
      audioUrl: audioUrl,
    };
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw new Error("Failed to convert text to speech");
  }
};

// Get available voices from ElevenLabs
export const getAvailableVoices = async (apiKey: string = "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347"): Promise<any[]> => {
  try {
    // Fetch available voices from ElevenLabs
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        'xi-api-key': apiKey || "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347",
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }
    
    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error("Error fetching voices:", error);
    return [
      { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
      { voice_id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger" },
      { voice_id: "IKne3meq5aSn9XLyUdCD", name: "Charlie" },
      { voice_id: "JBFqnCBsd6RMkjVDRZzb", name: "George" }
    ];
  }
};

// Now let's update the existing Gemini API integration to use voice synthesis
export const enhancedGenerateAvatarResponse = async (
  message: string,
  imageUrl: string,
  voiceId: string,
  language: string,
  geminiApiKey: string,
  elevenLabsApiKey: string = "sk_a358fd141a5dfcbbabf5b62557a4b7b503b132c84a710347"
): Promise<any> => {
  try {
    // First generate the text response using Gemini (simulated)
    console.log(`Generating response with Gemini API:
      - Message: ${message}
      - Image URL: ${imageUrl}
      - Voice ID: ${voiceId}
      - Language: ${language}
      - API Key: [REDACTED]`);
    
    // Simulate API processing time for the text generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a simulated text response
    const textResponse = "Hello! It's great to see you. How can I help you today?";
    
    // Then generate audio using ElevenLabs
    const speechResponse = await textToSpeech(
      textResponse,
      voiceId,
      elevenLabsApiKey
    );
    
    // Return combined response
    return {
      text: textResponse,
      audioUrl: speechResponse.audioUrl,
      videoUrl: imageUrl, // Using the same image URL for now
    };
  } catch (error) {
    console.error("Error generating enhanced avatar response:", error);
    throw new Error("Failed to generate avatar response");
  }
};
