import React from 'react';

const Gloomie: React.FC = () => {
  const handleClick = () => {
    console.log('Gloomie clicked!');
    // Add your tour initiation logic or other functionality here
  };
  return (
    <div className="fixed bottom-4 right-4 z-50" onClick={handleClick}>
      <img src="/Gloomie.png" alt="Gloomie the Ghost" className="h-16 w-16" />
    </div>
  );
};

export default Gloomie;