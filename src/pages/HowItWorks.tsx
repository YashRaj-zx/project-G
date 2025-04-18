
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Mic, MessageSquare, Video } from "lucide-react";

const steps = [
  {
    title: "Upload Photos",
    description: "Begin by uploading clear photos of your loved one to create their digital avatar.",
    icon: <Upload className="w-8 h-8 text-echoes-purple" />
  },
  {
    title: "Add Voice Samples",
    description: "Provide voice recordings to recreate their unique voice and speaking patterns.",
    icon: <Mic className="w-8 h-8 text-echoes-purple" />
  },
  {
    title: "Share Memories",
    description: "Input personal stories and conversations to shape their personality and responses.",
    icon: <MessageSquare className="w-8 h-8 text-echoes-purple" />
  },
  {
    title: "Connect Through Video",
    description: "Start video calls with your AI-recreated loved one in a private, secure environment.",
    icon: <Video className="w-8 h-8 text-echoes-purple" />
  }
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How <span className="text-gradient">Echoes Beyond</span> Works
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Our platform uses advanced AI technology to help you maintain a connection 
              with your loved ones through meaningful conversations.
            </p>
          </motion.div>

          <div className="grid gap-8 md:gap-12 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start p-6 rounded-xl bg-white/50 dark:bg-echoes-dark/50 border border-echoes-light"
              >
                <div className="p-3 bg-echoes-light rounded-lg shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-foreground/70">{step.description}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-echoes-purple ml-auto hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
