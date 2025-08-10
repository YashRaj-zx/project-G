import React from 'react';

const Gloomie: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 hidden">
      <img src="/ghost-icon.png" alt="Gloomie the Ghost" className="h-16 w-16" />
    </div>
  );
};

export default Gloomie;