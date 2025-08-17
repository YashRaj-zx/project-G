import React from 'react';
import Gloomie from '../components/Gloomie';

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
 <Gloomie />
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          Welcome to Echoes Beyond. We are a platform dedicated to recreating the voices, likeness, and conversational patterns of people who have passed away, enabling virtual video call interactions with their digital echoes.
        </p>
        <p className="mb-4">
          Our mission is to provide a unique and comforting way for individuals to connect with the memories of their loved ones through advanced AI technology. We strive to blend cutting-edge machine learning with a deep respect for personal legacy and emotional well-being.
        </p>
        <p className="mb-4">
          Founded in 2024, we have been committed to developing the complex technology required for this endeavor. Our team is made up of experienced professionals in AI, machine learning, voice synthesis, facial animation, and memory modeling.
        </p>
        <p className="mb-4">
          At Echoes Beyond, we believe in the power of technology to preserve memories and offer comfort. We utilize sophisticated machine learning algorithms to analyze extensive data sets of an individual's voice, appearance, and conversational style. This allows us to reconstruct personality traits, create lifelike video avatars, and simulate their unique voice patterns. Users can then engage in private, secure video calls with these digital echoes.
        </p>
        <p className="mb-4">
          We are constantly working to improve our technology and the user experience, ensuring the highest quality of interaction and emotional resonance.
        </p>
        <p className="mb-4">
          <strong>Note on Ethics and Privacy:</strong> At Echoes Beyond, we are deeply committed to ethical considerations and user control. The creation of a digital echo requires explicit consent. Users have full control over the data used and the digital echo's existence. All interactions are private and secure.
        </p>
        <p className="mb-4">
          Thank you for your interest in our company. We are dedicated to providing a meaningful way to keep the echoes of those we've lost alive.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;