import React from "react";
import { Link } from "react-router-dom";

const SleepQuizResult: React.FC = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold">Your Sleep Profile</h2>
      <p className="mt-3 text-gray-600">
        Recommended product: Medium-Firm Pocket Spring
      </p>
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
