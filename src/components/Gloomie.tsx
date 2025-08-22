import React, { useState, useEffect } from 'react';
import { sendChatMessage } from '../utils/geminiApi'; // ✅ using env-safe API call
import '../styles/spooky-animation.css';
import { useAuth } from '../contexts/AuthContext';

type AnimationState = 'visible' | 'fading-out' | 'fading-in';

interface GloomieProps {
  onClick?: () => void;
}

interface Message {
  text: string;
  sender: 'user' | 'gloomie';
}

interface ChatInterfaceProps {
  onClose: () => void;
  userName?: string;
}

const Gloomie: React.FC<GloomieProps> = ({ onClick }) => {
  const { user } = useAuth();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [animationState, setAnimationState] = useState<AnimationState>('visible');

  const handleClick = () => {
    setAnimationState('visible');
    if (isChatVisible) {
      setIsChatVisible(false);
      setAnimationState('fading-in');
    } else {
      setIsChatVisible(true);
    }
  };

  // Show welcome message only once per user
  useEffect(() => {
    const userId = user?.id;
    const hasShownWelcome = userId
      ? localStorage.getItem(`gloomieWelcome_${userId}`)
      : null;

    if (user && !hasShownWelcome) {
      setIsChatVisible(true);
      setAnimationState('fading-in');

      if (userId) {
        localStorage.setItem(`gloomieWelcome_${userId}`, 'true');
      }
    }
  }, [user]);

  return (
    <>
      {!isChatVisible && (
        <div
          className={`fixed bottom-4 right-4 z-50 cursor-pointer ${
            animationState === 'fading-out'
              ? 'gloomie-fade-out'
              : 'gloomie-fade-in'
          }`}
          onClick={handleClick}
        >
          <img
            src="/Gloomie.png"
            alt="Gloomie the Ghost"
            className={`h-24 w-24 ${
              animationState === 'fading-out'
                ? 'gloomie-fade-out'
                : 'gloomie-fade-in'
            }`}
          />
        </div>
      )}

      {isChatVisible && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-lg flex flex-col z-50">
          <ChatInterface
            onClose={() => {
              setIsChatVisible(false);
              setAnimationState('fading-in');
            }}
            userName={user?.name}
          />
        </div>
      )}
    </>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose, userName }) => {
  const initialMessage = userName
    ? `Hello ${userName}! I am Gloomie 👻. What can I help you with?`
    : 'Hello! I am Gloomie 👻. What can I help you with?';

  const [messages, setMessages] = useState<Message[]>([
    { text: initialMessage, sender: 'gloomie' },
  ]);
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const gloomieResponse = await sendChatMessage(input);
      const aiMessage: Message = { text: gloomieResponse, sender: 'gloomie' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: 'Oops! Something went wrong.',
        sender: 'gloomie',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-purple-500 text-white rounded-t-lg">
        <h3 className="text-lg font-semibold">Gloomie Chat</h3>
        <button className="text-white hover:text-gray-200" onClick={onClose}>
          &times;
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto max-h-60">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex">
        <input
          type="text"
          placeholder="Ask Gloomie..."
          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSendMessage();
          }}
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

export default Gloomie;

