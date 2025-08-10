import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TourContextType {
  tourCompleted: boolean;
  setTourCompleted: (completed: boolean) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tourCompleted, setTourCompletedState] = useState<boolean>(() => {
    const storedValue = localStorage.getItem('gloomieTourCompleted');
    return storedValue === 'true';
  });

  useEffect(() => {
    localStorage.setItem('gloomieTourCompleted', String(tourCompleted));
  }, [tourCompleted]);

  const setTourCompleted = (completed: boolean) => {
    setTourCompletedState(completed);
  };

  return (
    <TourContext.Provider value={{ tourCompleted, setTourCompleted }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};