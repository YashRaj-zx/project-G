import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  sender: "user" | "gloomie";
  text: string;
}

const Gloomie: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "gloomie", text: "Hello! I am Gloomie 💜. What can I help you with?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Gemini setup
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      // Ask Gemini 2.0
      const result = await model.generateContent(userMessage);
      const response = await result.response.text();

      // Add AI reply
      setMessages((prev) => [...prev, { sender: "gloomie", text: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "gloomie", text: "⚠️ Error: Could not get a response from the AI." },
      ]);
      console.error("Gemini Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 shadow-xl rounded-2xl border border-purple-300 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white font-bold px-4 py-3 rounded-t-2xl">
        Gloomie Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-96">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-3 py-2 rounded-xl max-w-[80%] ${
              msg.sender === "user"
                ? "bg-purple-100 text-right self-end ml-auto"
                : "bg-gray-100 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="px-3 py-2 bg-gray-100 rounded-xl text-left">Gloomie is typing...</div>
        )}
      </div>

      {/* Input */}
      <div className="flex border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gloomie..."
          className="flex-1 px-3 py-2 rounded-bl-2xl focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 text-white px-4 py-2 rounded-br-2xl hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Gloomie;
