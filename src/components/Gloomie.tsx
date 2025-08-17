import React, { useState, useEffect } from 'react';
import { sendChatMessage } from '../utils/geminiApi'; // Assuming sendChatMessage is in this path
import '../styles/spooky-animation.css'; // Import the CSS file
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext is in this path

type AnimationState = 'visible' | 'fading-out' | 'fading-in';

interface GloomieProps {
  onClick?: () => void;
}

const Gloomie: React.FC<GloomieProps> = ({ onClick }) => {
  const { user } = useAuth(); // Access user from AuthContext
  const [isChatVisible, setIsChatVisible] = useState(false);
  const handleClick = () => {
    setAnimationState('visible'); // Reset animation state when clicked
    // Close the chat if it's visible
    if (isChatVisible) {
      setIsChatVisible(false);
      setAnimationState('fading-in'); // Start fade-in animation when closing
    } else {
    // Only toggle visibility if Gloomie itself is clicked, not the chat interface
    // This needs refinement if the chat interface becomes a separate component
    // and we want to close it by clicking outside. For now, clicking the Gloomie
    // icon toggles the chat visibility.
    // This onClick handler is currently only used to toggle the chat, 
    // the original onClick prop is not used here directly.
      setIsChatVisible(!isChatVisible);
    }
  };

  const [animationState, setAnimationState] = useState<AnimationState>('visible');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChatVisible(false);
      setAnimationState('fading-out'); // Start fade-out animation
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [isChatVisible]); // Rerun timer effect when chat visibility changes

  useEffect(() => {
    const userId = user?.id; // Get user ID for local storage key
    const hasShownWelcome = userId ? localStorage.getItem(`gloomieWelcome_${userId}`) : null;

    if (user && !hasShownWelcome) {
      // Show the chat automatically on login if welcome hasn't been shown
      setIsChatVisible(true);
      setAnimationState('fading-in'); // Start with fade-in
      // Mark welcome message as shown for this user
      if (userId) {
        localStorage.setItem(`gloomieWelcome_${userId}`, 'true');
      }

      return () => clearTimeout(timer);
    }
  }, [user]); // Run this effect when the user object changes

  useEffect(() => {
    if (animationState === 'fading-out' && !isChatVisible) {
      const timer = setTimeout(() => {
        // Optionally hide the icon after fading out if needed, keep it visible to fade back in.
      }, 500); // Match this duration to your CSS animation duration for fading out
      return () => clearTimeout(timer);
    }
    if (animationState === 'fading-in') {
      // No timer needed for fading in, as it happens immediately on state change
    }
  }, [animationState]);

  return (
    <>
      <div 
        className={`fixed bottom-4 right-4 z-50 cursor-pointer ${animationState === 'fading-out' ? 'gloomie-fade-out' : animationState === 'fading-in' ? 'gloomie-fade-in' : 'gloomie-fade-in'}`} // Default to fade-in when visible
        onClick={handleClick}
      >
 <img src="/Gloomie.png" alt="Gloomie the Ghost" className={`h-24 w-24 ${animationState === 'fading-out' ? 'gloomie-fade-out' : animationState === 'fading-in' ? 'gloomie-fade-in' : ''}`} />
      </div>

      {isChatVisible && (
        <div className="fixed bottom-32 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-[1000]">
          <ChatInterface onClose={() => setIsChatVisible(false)} />
        </div>
      )}
    </>
  );
};

interface Message {
  text: string;
  sender: 'user' | 'gloomie';
}

interface ChatInterfaceProps {
  onClose: () => void;
  userName?: string; // Add userName prop
}

interface Message {
  text: string;
  sender: 'user' | 'gloomie';
}

interface ChatInterfaceProps {
  onClose: () => void;
  userName?: string;
}
const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose, userName }) => {
  const initialMessage = userName 
    ? `Hello ${userName}! I am Gloomie. What can I help you with?`
    : 'Hello! I am Gloomie. What can I help you with?';

  const [messages, setMessages] = useState<Message[]>([{ text: initialMessage, sender: 'gloomie' }]);
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

export default Gloomie;