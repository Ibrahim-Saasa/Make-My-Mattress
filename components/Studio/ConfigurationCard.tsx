import React from "react";

interface Props {
  title: string;
  description?: string;
}

const ConfigurationCard: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h4 className="font-bold">{title}</h4>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      <div className="mt-3">
        <button className="px-3 py-1 bg-gray-200 rounded">Choose</button>
      </div>
    </div>
  );
};

export default ConfigurationCard;
