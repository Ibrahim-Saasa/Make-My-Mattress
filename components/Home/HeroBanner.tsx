import React from "react";

interface BannerProps {
  title?: string;
  subtitle?: string;
}

const HeroBanner: React.FC<BannerProps> = ({
  title = "New Launch",
  subtitle = "Comfort reimagined",
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-lg">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="mt-2 opacity-90">{subtitle}</p>
    </div>
  );
};

export default HeroBanner;
