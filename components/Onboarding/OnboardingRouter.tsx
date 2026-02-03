import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthGate from "./AuthGate";
import SleepQuiz from "./SleepQuiz";
import SleepQuizResult from "./SleepQuizResult";

const OnboardingRouter: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="auth" replace />} />
      <Route path="auth" element={<AuthGate />} />
      <Route path="quiz" element={<SleepQuiz />} />
      <Route path="result" element={<SleepQuizResult />} />
    </Routes>
  );
};

export default OnboardingRouter;
