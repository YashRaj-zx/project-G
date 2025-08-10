import React from 'react';
import { useState } from 'react';

import { sendChatMessage } from '../utils/geminiApi';
interface AIAssistantProps {
  onClose: () => void;
}

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([{ text: 'Welcome! Ask me anything about Echoes Beyond.', sender: 'ai' }]);
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      sendChatMessage(input) // Assuming sendChatMessage takes the user's message
        .then(aiResponse => {
          setMessages(prevMessages => [...prevMessages, { text: aiResponse, sender: 'ai' }]);
        })
        .catch(error => {
          console.error('Error sending message to Gemini API:', error);
        });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg flex flex-col max-h-[400px]">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">AI Assistant</h3>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-1 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Ask a question..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={handleInputChange}
          onKeyPress={(event) => { if (event.key === 'Enter') handleSendMessage(); }}
        />
      </div>
    </div>
  );
};
export default AIAssistant;