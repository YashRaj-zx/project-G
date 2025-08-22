// src/utils/geminiApi.js
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Vite environment variable

export async function sendChatMessage(message) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }],
        }),
      }
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return "Error: Could not get a response from the AI.";
    }

    const data = await response.json();

    // Debug log (chudataniki)
    console.log("Gemini API response:", data);

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Error: Could not get a response from the AI."
    );
  } catch (error) {
    console.error("Fetch failed:", error);
    return "Error: Could not get a response from the AI.";
  }
}

