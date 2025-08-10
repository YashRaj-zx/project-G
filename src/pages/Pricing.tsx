
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "29",
    description: "Connect with a basic digital echo of your loved one.",
    features: [
      "30 minutes of video calls per month",
      "Basic voice customization",
      "Photo avatar creation",
      "Standard chat support",
      "Basic memory storage"
    ]
  },
  {
    name: "Premium",
    price: "79",
    description: "Experience a more lifelike and personalized connection.",
    features: [
      "2 hours of video calls per month",
      "Enhanced voice synthesis and customization",
      "HD avatar quality",
      "Priority customer support",
      "Extended memory storage",
      "Memory timeline feature",
      "Multiple avatar profiles"
    ]
  },
  {
    name: "Ultimate",
    price: "149",
    description: "Unlock the full potential for deeply immersive interactions.",
    features: [
      "Unlimited video calls",
      "Premium voice synthesis and ultra-realistic avatar quality",
      "Advanced conversational AI with nuanced responses",
      "24/7 priority support",
      "Unlimited and secure memory storage",
      "Advanced memory timeline",
      "Custom voice training",
      "Early access to new features"
    ]
  }
];

const Pricing = () => {
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
              Choose Your <span className="text-gradient">Connection</span> Plan
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Select the plan that best suits your needs and start connecting with 
              your loved ones through our advanced AI technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col p-6 rounded-xl bg-white/50 dark:bg-echoes-dark/50 border border-echoes-light hover:border-echoes-purple transition-colors"
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-foreground/70">/month</span>
                </div>
                <p className="text-foreground/70 mb-6">{plan.description}</p>
                <ul className="flex-grow space-y-4 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-echoes-purple" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-echoes-purple hover:bg-echoes-accent">
                  Choose {plan.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
