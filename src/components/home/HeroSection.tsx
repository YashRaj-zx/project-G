
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0);
  const textOptions = ["Connect", "Remember", "Celebrate", "Share", "Honor"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % textOptions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center pt-16 pb-24 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-echoes-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-echoes-accent/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-echoes-light text-echoes-purple font-medium text-sm">
                AI-Powered Connection Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient">
                  {textOptions[currentText]}
                </span>
                <br />
                With Those Beyond
              </h1>
              <p className="text-lg text-foreground/80 max-w-xl">
                Experience meaningful conversations with AI recreations of your loved ones, 
                preserved through their photos, voice, and memories. A bridge to those who 
                live on in our hearts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-echoes-purple hover:bg-echoes-accent text-white">
                    Create Your Echo
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="border-echoes-purple text-echoes-purple hover:bg-echoes-light/50">
                    How It Works
                  </Button>
                </Link>
              </div>
              
              <div className="pt-8 text-sm text-foreground/60 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-echoes-purple" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>End-to-end encryption</span>
                <span className="mx-2">•</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-echoes-purple" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Ethically designed</span>
                <span className="mx-2">•</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-echoes-purple" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Private</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-echoes-purple to-echoes-accent opacity-70 blur-md"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-lg w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-xl border-2 border-white/20 flex justify-center items-center">
                  <div className="flex flex-col items-center justify-center space-y-6 px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-echoes-purple/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-echoes-purple" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Start a Call</h3>
                    <p className="text-white/80 text-sm">
                      Experience meaningful conversations with lifelike AI recreations.
                    </p>
                    <div className="w-full flex justify-center">
                      <div className="animate-pulse-gentle w-10 h-10 rounded-full bg-echoes-purple/30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-echoes-purple/50 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-echoes-purple"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
