"use client";
import React, { useState } from "react";

const Gloomie = () => {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello 👋 Ask me anything about Project G!" }]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
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
                    
                    User: ${input}`
                  }
                ]
              }
            ]
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini raw response:", data);

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const botMessage = {
          sender: "bot",
          text: data.candidates[0].content.parts[0].text,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Error: Could not get a response." }]);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
      <div className="flex items-center bg-gray-900 text-white px-3 py-2 rounded-t-lg">
        <img src="/gloomie.png" alt="Gloomie" className="w-6 h-6 mr-2" />
        <h2 className="text-lg font-bold">Gloomie</h2>
      </div>
      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg text-sm max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about Project G..."
          className="flex-grow px-2 py-2 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-3 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Gloomie;
