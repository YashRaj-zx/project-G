"use client";
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default function Gloomie() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      // Restrict Gemini to only website-related Q&A
      const result = await model.generateContent([
        {
          role: "system",
          parts: [
            {
              text: `You are Gloomie, the official assistant for the website "Project G".
              Only answer questions related to this website (its purpose, features, usage, etc).
              If a question is unrelated, reply with:
              "⚠️ I can only answer questions about this website."`,
            },
          ],
        },
        { role: "user", parts: [{ text: userMessage }] },
      ]);

      const response = await result.response.text();

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
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2">
      {/* Floating Gloomie Icon */}
      <img
        src="/gloomie.png" // Place gloomie.png inside public/
        alt="Gloomie"
        className="w-16 h-16 rounded-full border-2 border-purple-400 shadow-md cursor-pointer hover:scale-105 transition"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Chatbox (toggleable) */}
      {isOpen && (
        <div className="w-80 shadow-xl rounded-2xl border border-purple-300 bg-white flex flex-col">
          <div className="bg-purple-600 text-white font-bold px-4 py-3 rounded-t-2xl flex justify-between items-center">
            <span>Gloomie Chat</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 font-bold"
            >
              ✕
            </button>
          </div>

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
              <div className="px-3 py-2 bg-gray-100 rounded-xl text-left">
                Gloomie is typing...
              </div>
            )}
          </div>

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
      )}
    </div>
  );
}
