import React from "react";

const StudioSummary: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Summary</h2>
      <p className="mt-3 text-gray-600">
        Price breakdown, save to profile, add to cart.
      </p>
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Add to Cart
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded">
          Save to Profile
        </button>
      </div>
    </div>
  );
};

export default StudioSummary;
