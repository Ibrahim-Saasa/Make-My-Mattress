import React from "react";
import { Link, useLocation } from "react-router-dom";

const SleepQuizResult: React.FC = () => {
  const location = useLocation();
  // result passed via navigation state by SleepQuiz
  const payload = (location.state as any)?.result;

  const headline = payload?.recommended_type || "Recommended Mattress";
  const blurb =
    payload?.recommended_models?.join(", ") ||
    "We couldn't compute a recommendation yet.";

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold">Your Sleep Profile</h2>
      <p className="mt-3 text-gray-600">{headline}</p>
      <p className="mt-2 text-sm text-gray-500">{blurb}</p>
      <div className="mt-6 flex justify-center gap-4">
        <Link to="/studio" className="px-4 py-2 bg-blue-600 text-white rounded">
          Try Studio
        </Link>
        <Link to="/" className="px-4 py-2 bg-gray-200 rounded">
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default SleepQuizResult;
