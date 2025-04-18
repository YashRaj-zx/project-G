
import { motion } from 'framer-motion';
import { Upload, Mic, MessageCircle, Video, Shield, Clock } from 'lucide-react';

const features = [
  {
    icon: <Upload className="h-8 w-8 text-echoes-purple" />,
    title: "Photo Upload",
    description: "Upload photos to create a realistic avatar that captures your loved one's appearance and expressions."
  },
  {
    icon: <Mic className="h-8 w-8 text-echoes-purple" />,
    title: "Voice Cloning",
    description: "Provide voice recordings to recreate their unique tone, speaking style, and verbal mannerisms."
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-echoes-purple" />,
    title: "Memory Input",
    description: "Share stories, conversations, and memories to build an authentic personality profile."
  },
  {
    icon: <Video className="h-8 w-8 text-echoes-purple" />,
    title: "Video Calls",
    description: "Experience real-time conversations with a lifelike AI avatar that responds naturally."
  },
  {
    icon: <Shield className="h-8 w-8 text-echoes-purple" />,
    title: "Privacy & Security",
    description: "End-to-end encryption ensures your personal data and conversations remain completely private."
  },
  {
    icon: <Clock className="h-8 w-8 text-echoes-purple" />,
    title: "Memory Timeline",
    description: "Organize and access memories chronologically to relive specific moments and stories."
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col p-6 bg-white/50 dark:bg-echoes-dark/50 rounded-xl border border-echoes-light backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
    >
      <div className="p-3 bg-echoes-light rounded-lg w-fit mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-foreground/70">{feature.description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-echoes-light/50 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How <span className="text-gradient">Echoes Beyond</span> Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
          >
            Our platform combines advanced AI technologies to create meaningful connections 
            with personalized digital recreations of your loved ones.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
