import React from "react";
import { Hero } from "../UI";

interface BannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  onCTA?: () => void;
}

const HeroBanner: React.FC<BannerProps> = ({
  title = "New Collection Launch",
  subtitle = "Comfort Reimagined",
  description = "Discover our latest premium mattress collection with advanced cooling technology and customizable firmness",
  onCTA,
}) => {
  return (
    <Hero
      title={title}
      subtitle={subtitle}
      description={description}
      primaryCTA={{
        text: "Explore Now",
        onClick:
          onCTA || (() => window.scrollTo({ top: 500, behavior: "smooth" })),
      }}
      backgroundGradient="from-indigo-600 via-purple-600 to-pink-600"
      statsSection={[
        { label: "Premium Collections", value: "6" },
        { label: "Customization Options", value: "10k+" },
        { label: "Industry Awards", value: "15+" },
        { label: "Customer Satisfaction", value: "4.8★" },
      ]}
    />
  );
};

export default HeroBanner;
