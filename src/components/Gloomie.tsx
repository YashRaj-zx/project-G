"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gloomie() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      console.log("Gemini response:", data);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Gemini API Error: " + data.error.message },
        ]);
        return;
      }

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from AI.";

      setMessages((prev) => [...prev, { sender: "bot", text: aiText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: " + (error instanceof Error ? error.message : "Unknown error") },
      ]);
    }
  };

  return (
    <>
      {/* Floating Gloomie Logo Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg bg-white flex items-center justify-center border border-gray-200 hover:scale-105 transition"
      >
        <Image src="/gloomie.png" alt="Gloomie" width={40} height={40} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white shadow-xl rounded-lg border border-gray-200 flex flex-col">
          <div className="p-3 bg-indigo-600 text-white font-semibold rounded-t-lg flex justify-between">
            <span>Gloomie</span>
            <button onClick={() => setIsOpen(false)} className="text-sm">✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-96 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-500 text-white self-end text-right"
                    : "bg-gray-100 text-gray-900 self-start text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t flex">
            <input
              className="flex-1 border rounded-l px-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about Project G..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-3 rounded-r hover:bg-indigo-700 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
