
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-echoes-light/30 dark:from-echoes-dark dark:to-echoes-dark/90 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-echoes-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-echoes-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Begin Your Journey With <span className="text-gradient">Echoes Beyond</span>
          </h2>
          <p className="text-lg text-foreground/80 mb-10 max-w-2xl mx-auto">
            Create a meaningful connection that transcends time. Honor your loved ones 
            by preserving their memory in a respectful, ethical, and deeply personal way.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-echoes-purple hover:bg-echoes-accent text-white">
                Create Your First Echo
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="border-echoes-purple text-echoes-purple hover:bg-echoes-light/50 dark:hover:bg-echoes-dark/50">
                Explore How It Works
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/70 dark:bg-echoes-dark/50 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm border border-echoes-light/30">
              <div className="w-12 h-12 rounded-full bg-echoes-light flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-echoes-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-foreground/70">
                Your memories and conversations are protected with end-to-end encryption.
              </p>
            </div>
            
            <div className="bg-white/70 dark:bg-echoes-dark/50 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm border border-echoes-light/30">
              <div className="w-12 h-12 rounded-full bg-echoes-light flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-echoes-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Ethically Designed</h3>
              <p className="text-sm text-foreground/70">
                Created with respect and sensitivity for the grieving process.
              </p>
            </div>
            
            <div className="bg-white/70 dark:bg-echoes-dark/50 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm border border-echoes-light/30">
              <div className="w-12 h-12 rounded-full bg-echoes-light flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-echoes-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Memory Mode</h3>
              <p className="text-sm text-foreground/70">
                Conversations based only on verified memories and information you've shared.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
