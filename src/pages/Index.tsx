
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CtaSection from "@/components/home/CtaSection";
import Gloomie from "@/components/Gloomie";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturesSection />
        <ExperienceSection />
        <TestimonialSection />
        <CtaSection />
      </main>
      <Footer />
      <Gloomie />
    </div>
  );
};

export default Index;
