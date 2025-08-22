// src/components/gloomie.tsx

"use client";

import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const Gloomie: React.FC = () => {
  const [messages, setMessages] = useState<
    { sender: "user" | "gloomie"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState<any>(null);

  // Create chat session once
  useEffect(() => {
    const newChat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Gloomie, assistant for Project G website." }],
        },
        {
          role: "model",
          parts: [{ text: "Hi! I can answer only questions about Project G." }],
        },
      ],
      generationConfig: { maxOutputTokens: 200 },
    });
    setChat(newChat);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chat) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      const result = await chat.sendMessage(
        `Only answer if it's about Project G. If unrelated, reply:
        "⚠️ I can only answer questions about this website."

        User: ${userMessage}`
      );

      const response = result.response.text();
      setMessages((prev) => [...prev, { sender: "gloomie", text: response }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "gloomie", text: "⚠️ Error: Could not get a response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end">
      {/* Gloomie button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-lg"
        >
          <img
            src="/gloomie.png"
            alt="Gloomie"
            className="w-16 h-16 object-contain"
          />
        </button>
      )}

      {/* Chatbox */}
      {isOpen && (
        <div className="w-80 bg-white rounded-2xl shadow-xl p-4 flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Gloomie</h2>
            <button
              className="text-sm text-red-500 hover:text-red-700"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>

          <div className="h-64 overflow-y-auto space-y-2 border p-2 rounded-md bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-sm">Gloomie is typing...</div>
            )}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-grow border rounded-lg px-3 py-2 text-sm"
              placeholder="Ask me about Project G..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gloomie;
                                        