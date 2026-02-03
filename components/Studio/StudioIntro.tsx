import React from "react";
import { Link } from "react-router-dom";

const StudioIntro: React.FC = () => (
  <div className="p-6 max-w-3xl mx-auto text-center">
    <h2 className="text-3xl font-bold">Start Building Your Comfort</h2>
    <p className="mt-3 text-gray-600">
      Choose layers and preview live. This is a preview scaffold.
    </p>
    <div className="mt-6">
      <Link
        to="/studio/stepper"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Start Building
      </Link>
    </div>
  </div>
);

export default StudioIntro;
