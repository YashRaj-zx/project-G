"use client";

import { useState } from "react";
import Image from "/Gloomie.png";

type Message = {
  sender: "user";
  text: string;
};

export default function Gloomie() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // 👇 Replace with your Gemini API Key
  const GEMINI_API_KEY = <div className="env">NEXT_PUBLIC_GEMINI_API_KEY</div>;

  const WEBSITE_CONTEXT = `
  You are Gloomie, the friendly assistant for our website.
  Your job is to answer ONLY about this website, its features, services,
  and how users can interact with it. 
  If asked unrelated questions, politely say you only provide help about this website.
  `;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: WEBSITE_CONTEXT },
                  { text: `User asked: ${input}` },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const botMessage: Message = {
        sender: "bot",
        text:
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Sorry, I can only help with our website.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: Could not respond." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Gloomie Logo */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full shadow-lg bg-white hover:scale-105 transition"
        >
          <Image src="/Gloomie.png" alt="Gloomie" width={60} height={60} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-xl flex flex-col p-2">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-1 mb-2">
            <h2 className="font-bold text-blue-600">Gloomie Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[70%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 mt-2">
            <input
              className="flex-1 border rounded-lg px-2 py-1 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me about our site..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
