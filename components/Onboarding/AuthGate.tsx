import React from "react";
import { useNavigate } from "react-router-dom";

const AuthGate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Sign in or continue</h2>
      <p className="mt-2 text-gray-600">Choose how you'd like to continue.</p>
      <div className="mt-4 flex flex-col gap-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate("/onboarding/quiz")}
        >
          Continue with Email
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => navigate("/onboarding/quiz")}
        >
          Continue with Phone (OTP)
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => navigate("/home")}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default AuthGate;
