import React, { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingState {
  step: string;
  guest: boolean;
  setGuest: (g: boolean) => void;
}

const defaultState: OnboardingState = {
  step: "start",
  guest: false,
  setGuest: () => {},
};

const OnboardingContext = createContext<OnboardingState>(defaultState);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [guest, setGuest] = useState(false);
  return (
    <OnboardingContext.Provider value={{ step: "start", guest, setGuest }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
