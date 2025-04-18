
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ExperienceSection = () => {
  return (
    <section className="py-24 bg-echoes-light/30 dark:bg-echoes-dark/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-echoes-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-echoes-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white/80 dark:bg-echoes-dark/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-md border border-echoes-light/50">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-echoes-purple/20 flex items-center justify-center">
                    <span className="text-echoes-purple font-bold">01</span>
                  </div>
                  <h3 className="text-xl font-semibold">Upload Photos & Voice</h3>
                </div>
                <p className="text-foreground/80 pl-16">
                  Start by uploading clear photos of your loved one and voice recordings to train the AI to recognize their appearance and speech patterns.
                </p>
                
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-echoes-purple/20 flex items-center justify-center">
                    <span className="text-echoes-purple font-bold">02</span>
                  </div>
                  <h3 className="text-xl font-semibold">Share Memories</h3>
                </div>
                <p className="text-foreground/80 pl-16">
                  Input personal memories, conversations, and stories that help shape the AI personality to reflect your loved one's character.
                </p>
                
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-echoes-purple/20 flex items-center justify-center">
                    <span className="text-echoes-purple font-bold">03</span>
                  </div>
                  <h3 className="text-xl font-semibold">Connect & Converse</h3>
                </div>
                <p className="text-foreground/80 pl-16">
                  Initiate video calls and enjoy meaningful conversations with a lifelike AI recreation that responds based on your shared memories.
                </p>
                
                <div className="pt-6">
                  <Link to="/signup">
                    <Button className="bg-echoes-purple hover:bg-echoes-accent text-white">
                      Start Your Journey
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experience Heartfelt <span className="text-gradient">Connections</span> Again
              </h2>
              <p className="text-lg text-foreground/80 mb-8 max-w-lg mx-auto lg:mx-0">
                Our platform creates a bridge between memories and meaningful interaction,
                allowing you to speak with and see your loved ones through respectful AI recreation.
              </p>
              
              <div className="space-y-4 text-foreground/80 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-echoes-purple flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Share cherished memories with family</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-echoes-purple flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Find comfort and closure through conversation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-echoes-purple flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Preserve stories for future generations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-echoes-purple flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Create a legacy that honors their memory</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
