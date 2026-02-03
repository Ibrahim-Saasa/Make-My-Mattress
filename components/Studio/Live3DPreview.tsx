import React from "react";

interface Props {
  modelUrl?: string;
}

const Live3DPreview: React.FC<Props> = ({ modelUrl }) => {
  // MVP placeholder. Later replace with <model-viewer> or r3f implementation.
  return (
    <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
      <div className="text-center text-gray-600">
        <p>3D Preview Placeholder</p>
        {modelUrl && <p className="text-xs">{modelUrl}</p>}
      </div>
    </div>
  );
};

export default Live3DPreview;
