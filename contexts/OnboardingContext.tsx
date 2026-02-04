import React, { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingState {
  step: string;
  guest: boolean;
  setGuest: (g: boolean) => void;
  // Quiz state
  quizInProgress?: boolean;
  startQuiz?: () => void;
  saveQuizResult?: (payload: any) => Promise<void>;
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
  const [quizInProgress, setQuizInProgress] = useState(false);

  const startQuiz = () => setQuizInProgress(true);

  const saveQuizResult = async (payload: any) => {
    try {
      // Persist via quizService -> supabase
      const { saveResultToSupabase } = await import("../services/quizService");
      const res = await saveResultToSupabase(payload);
      // eslint-disable-next-line no-console
      console.log("Quiz saved:", res);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save quiz result:", err);
      // consider adding retry or local persistence here
    } finally {
      setQuizInProgress(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        step: "start",
        guest,
        setGuest,
        quizInProgress,
        startQuiz,
        saveQuizResult,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
