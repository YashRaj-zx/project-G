"use client";

import { useState } from "react";

export default function Gloomie() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are Gloomie, the Project G assistant. Only answer questions related to Project G website. 
                    If the question is not related, reply: "I can only answer questions about Project G." 

                    User: ${userMessage}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini full response:", data); // 🔍 Debugging

      // Check API error
      if (data.error) {
        console.error("Gemini API Error:", data.error);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Gemini API Error: " + data.error.message },
        ]);
        return;
      }

      // Extract AI text
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from AI.";

      setMessages((prev) => [...prev, { sender: "bot", text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Error: " + (error instanceof Error ? error.message : "Unknown error"),
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-xl rounded-lg border border-gray-300 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-3 rounded-t-lg font-bold">👻 Gloomie</div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 max-h-80">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex border-t p-2">
        <input
          className="flex-1 border rounded px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about Project G..."
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
