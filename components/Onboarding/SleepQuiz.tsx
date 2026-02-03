import React from "react";
import { useNavigate } from "react-router-dom";

const SleepQuiz: React.FC = () => {
  const navigate = useNavigate();

  // Placeholder stepper logic
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Sleep Quiz (placeholder)</h2>
      <p className="mt-2 text-gray-600">
        Questions about sleep position, weight range, and pain points.
      </p>
      <div className="mt-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate("/onboarding/result")}
        >
          Submit Quiz (go to result)
        </button>
      </div>
    </div>
  );
};

export default SleepQuiz;
