import React from "react";
import { Link } from "react-router-dom";

const SplashScreen: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">Make My Mattress</h1>
      <p className="mt-4 text-gray-600">
        Welcome — Get started with a guided sleep quiz or continue as guest.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Link
          to="/onboarding"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Get Started
        </Link>
        <Link to="/home" className="px-4 py-2 bg-gray-200 rounded">
          Browse
        </Link>
      </div>
    </div>
  );
};

export default SplashScreen;
