import React from "react";
import logoImage from "../../src/assets/logo.png";

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
  inverted?: boolean;
  compact?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  layout?: "horizontal" | "stacked";
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  showWordmark = true,
  showTagline = false,
  compact = false,
  size = "md",
  layout = "horizontal",
}) => {
  const isStacked = layout === "stacked";
  const imageSize = {
    sm: compact ? "h-8" : "h-10",
    md: compact ? "h-10" : "h-14",
    lg: compact ? "h-12" : "h-24",
    xl: compact ? "h-14" : "h-36",
  };
  const wordmarkSize = {
    sm: "text-[11px] tracking-[0.18em]",
    md: "text-sm tracking-[0.22em]",
    lg: "text-base tracking-[0.26em]",
    xl: "text-lg tracking-[0.3em]",
  };
  const taglineSize = {
    sm: "text-[10px] tracking-[0.08em]",
    md: "text-[11px] tracking-[0.1em]",
    lg: "text-xs tracking-[0.12em]",
    xl: "text-sm tracking-[0.14em]",
  };

  return (
    <div
      className={`${isStacked ? "flex flex-col items-center text-center" : "flex items-center"} ${className}`}
    >
      <img
        src={logoImage}
        alt="Make My Mattress logo"
        className={`${imageSize[size]} w-auto shrink-0 object-contain`}
      />

      {(showWordmark || showTagline) && (
        <div className={`flex flex-col ${isStacked ? "items-center mt-4" : "ml-3"}`}>
          {showWordmark && (
            <span
              className={`text-theme-primary brand-header font-extrabold uppercase leading-none ${wordmarkSize[size]}`}
            >
              Make My Mattress
            </span>
          )}
          {showTagline && (
            <span
              className={`text-theme-secondary font-semibold leading-none ${showWordmark ? "mt-2" : ""} ${taglineSize[size]}`}
            >
              Equality in comfort.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
