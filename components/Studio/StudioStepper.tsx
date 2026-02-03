import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ConfigurationCard from "./ConfigurationCard";
import Live3DPreview from "./Live3DPreview";

const StudioStepper: React.FC = () => {
  // Simple placeholder stepper UI
  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h3 className="text-xl font-bold mb-4">Build your mattress</h3>
        <div className="space-y-4">
          <ConfigurationCard title="Core" description="Select base layer" />
          <ConfigurationCard
            title="Comfort"
            description="Choose comfort layers"
          />
          <ConfigurationCard title="Cover" description="Pick fabric & color" />
        </div>
        <div className="mt-6">
          <Link
            to="/studio/summary"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go to Summary
          </Link>
        </div>
      </div>

      <div className="md:col-span-1">
        <Live3DPreview />
      </div>
    </div>
  );
};

export default StudioStepper;
