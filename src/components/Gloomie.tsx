import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { sendChatMessage } from '../utils/geminiApi'; // Assuming sendChatMessage is in this path
interface GloomieProps {
  onClick?: () => void;
}

const Gloomie: React.FC<GloomieProps> = ({ onClick }) => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const handleClick = () => {
    // Only toggle visibility if Gloomie itself is clicked, not the chat interface
    // This needs refinement if the chat interface becomes a separate component
    // and we want to close it by clicking outside. For now, clicking the Gloomie
    // icon toggles the chat visibility.
    // This onClick handler is currently only used to toggle the chat, 
    // the original onClick prop is not used here directly.
    setIsChatVisible(!isChatVisible);
    if (onClick) {
      onClick();
    }
  };
  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 cursor-pointer" onClick={handleClick}>
        <img src="/Gloomie.png" alt="Gloomie the Ghost" className="h-24 w-24" />
      </div>

      <AnimatePresence>
        {isChatVisible && (
          <motion.div 
            className="fixed bottom-32 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-[1000]"
            initial={{ opacity: 0, scale: 0.8, originX: '100%', originY: '100%' }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 bg-purple-500 text-white rounded-t-lg">
              <h3 className="text-lg font-semibold">Gloomie Chat</h3>
              <button onClick={() => setIsChatVisible(false)} className="text-white">×</button>
            </div>
            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Messages will go here */}
            </div>
            {/* Chat Input */}
            <div className="p-4 border-t">
              <input type="text" placeholder="Ask Gloomie..." className="w-full p-2 border rounded" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gloomie;

interface Message {
  text: string;
  sender: 'user' | 'gloomie';
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{ text: 'Hello! I am Gloomie. What can I help you with?', sender: 'gloomie' }]);
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');

      try {
        const gloomieResponse = await sendChatMessage(input);
        const aiMessage: Message = { text: gloomieResponse, sender: 'gloomie' };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error sending message to language model:', error);
        const errorMessage: Message = { text: 'Oops! Something went wrong.', sender: 'gloomie' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <>
      {/* Chat Header */}
      <div className="flex justify-between items-center p-4 bg-purple-500 text-white rounded-t-lg">
        <h3 className="text-lg font-semibold">Gloomie Chat</h3>
        {/* Close button handled by parent Gloomie component */}
      </div>
      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-1 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      {/* Chat Input */}
      <div className="p-4 border-t flex">
        <input
          type="text"
          placeholder="Ask Gloomie..."
          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={input}
          onChange={handleInputChange}
          onKeyPress={(event) => { if (event.key === 'Enter') handleSendMessage(); }}
        />
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-r hover:bg-purple-600 focus:outline-none"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </>
  );
};