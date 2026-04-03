import React from "react";
import { motion } from "framer-motion";
import { buttonHover } from "../../src/utils/animations";

// Re-export all components from this file and submodules
export * from "./Advanced";
export * from "./Layouts";
export * from "./Forms";
export * from "./Polish";
export { default as BrandLogo } from "./BrandLogo";

// ============================================================================
// BUTTON COMPONENT - Premium, Accessible, Multiple Variants
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "accent"
    | "success"
    | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      icon,
      iconPosition = "left",
      children,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-bold focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const sizeStyles = {
      sm: "px-4 py-2 rounded-lg text-sm",
      md: "px-6 py-3 rounded-xl text-base",
      lg: "px-8 py-4 rounded-2xl text-lg",
    };

    const variantStyles = {
      primary: `
        bg-gradient-to-r from-[#1740D1] to-[#0C1F63]
        hover:from-[#1237B5] hover:to-[#09174A]
        text-white shadow-md hover:shadow-lg
        focus:ring-[rgba(23,64,209,0.25)]
      `,
      secondary: `
        border-2 border-[var(--brand-primary)] text-[var(--brand-primary)]
        hover:bg-[rgba(23,64,209,0.06)] dark:hover:bg-[rgba(23,64,209,0.16)]
        focus:ring-[rgba(23,64,209,0.2)]
      `,
      tertiary: `
        text-[var(--brand-primary)] hover:bg-[rgba(23,64,209,0.06)]
        dark:text-[#7F9CFF] dark:hover:bg-[rgba(23,64,209,0.18)]
        focus:ring-[rgba(23,64,209,0.15)]
      `,
      accent: `
        bg-gradient-to-r from-[#C8A55B] to-[#9A7A39]
        hover:from-[#B3914B] hover:to-[#7F632E]
        text-[#09174A] shadow-lg hover:shadow-xl
        focus:ring-[rgba(200,165,91,0.3)]
      `,
      success: `
        bg-gradient-to-r from-[#0A7D67] to-[#095B5D]
        hover:from-[#086A59] hover:to-[#074A4A]
        text-white shadow-lg hover:shadow-xl
        focus:ring-[rgba(10,125,103,0.25)]
      `,
      danger: `
        bg-gradient-to-r from-[#C25158] to-[#9E2F49]
        hover:from-[#A7444C] hover:to-[#83253D]
        text-white shadow-lg hover:shadow-xl
        focus:ring-[rgba(194,81,88,0.25)]
      `,
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={buttonHover}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && icon}
            {children}
            {icon && iconPosition === "right" && icon}
          </>
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

// ============================================================================
// CARD COMPONENT - Premium Card with Multiple Styles
// ============================================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "minimal" | "elevated" | "gradient" | "glass";
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "minimal",
      interactive = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = `rounded-2xl transition-all duration-300`;

    const variantStyles = {
      minimal: `
        bg-white dark:bg-[var(--color-card-background)]
        border border-gray-100 dark:border-[var(--color-border)]
        shadow-sm hover:shadow-md
      `,
      elevated: `
        bg-white dark:bg-[var(--color-card-background)]
        border border-gray-200 dark:border-[var(--color-border)]
        shadow-md hover:shadow-lg
      `,
      gradient: `
        bg-gradient-to-br from-gray-50 to-gray-100
        dark:from-[var(--color-card-background)] dark:to-[var(--color-card-background-hover)]
        border border-gray-200 dark:border-[var(--color-border)]
        shadow-md
      `,
      glass: `
        bg-white/80 dark:bg-slate-900/70
        backdrop-blur-lg
        border border-white/30 dark:border-slate-700/40
        shadow-lg
      `,
    };

    const interactiveStyle = interactive ? `cursor-pointer` : "";

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyle} ${className}`}
        variants={interactive ? { rest: { y: 0 }, hover: { y: -5 } } : {}}
        initial="rest"
        whileHover={interactive ? "hover" : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

// ============================================================================
// LABEL COMPONENT - Form Label with Accessibility
// ============================================================================

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required = false, className = "", children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`
          block text-sm font-semibold
          text-slate-700 dark:text-slate-300
          mb-2 uppercase tracking-wider
          ${className}
        `}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    );
  },
);

Label.displayName = "Label";

// ============================================================================
// INPUT COMPONENT - Premium Text Input with Variants
// ============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "large" | "minimal";
  error?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      error = false,
      success = false,
      icon,
      iconPosition = "left",
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      w-full px-4 py-3 rounded-lg text-base
      bg-white dark:bg-[var(--color-input-bg)]
      text-slate-900 dark:text-white
      placeholder-slate-400 dark:placeholder-slate-400
      border-2 border-gray-300 dark:border-[var(--color-input-border)]
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      focus:border-indigo-500 focus:ring-indigo-200 dark:focus:border-[var(--color-input-border-focus)] dark:focus:ring-[rgba(125,152,255,0.18)]
      hover:border-slate-400 dark:hover:border-[#5875BC]
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variantStyles = {
      default: "px-4 py-3 rounded-lg",
      large: "px-5 py-4 rounded-xl text-lg",
      minimal: "px-0 py-2 border-none border-b-2 rounded-none",
    };

    const stateStyles = `
      ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
      ${success ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-200" : ""}
    `;

    const containerClass = icon ? "relative" : "";
    const inputClass = icon
      ? iconPosition === "left"
        ? "pl-12"
        : "pr-10"
      : "";

    return (
      <div className={containerClass}>
        {icon && (
          <div
            className={`
              absolute top-1/2 -translate-y-1/2
              text-slate-400 dark:text-slate-500
              pointer-events-none
              ${iconPosition === "left" ? "left-3" : "right-3"}
            `}
          >
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${variantStyles[variant]} ${stateStyles} ${inputClass} ${className}`}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

// ============================================================================
// BADGE COMPONENT - Status & Tag Badge
// ============================================================================

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "error" | "secondary";
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "primary", icon, className = "", children, ...props }, ref) => {
    const variantStyles = {
      primary: `
        bg-indigo-100 dark:bg-indigo-900/30
        text-indigo-700 dark:text-indigo-300
      `,
      success: `
        bg-emerald-100 dark:bg-emerald-900/30
        text-emerald-700 dark:text-emerald-300
      `,
      warning: `
        bg-amber-100 dark:bg-amber-900/30
        text-amber-700 dark:text-amber-300
      `,
      error: `
        bg-red-100 dark:bg-red-900/30
        text-red-700 dark:text-red-300
      `,
      secondary: `
        bg-slate-100 dark:bg-slate-800
        text-slate-700 dark:text-slate-300
      `,
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-2
          px-3 py-1 rounded-full
          text-xs font-bold uppercase tracking-wider
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {icon && icon}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

// ============================================================================
// SECTION COMPONENT - Consistent Section Spacing
// ============================================================================

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ children, maxWidth = "xl", className = "", ...props }, ref) => {
    const maxWidthStyles = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-7xl",
      "2xl": "max-w-full",
      full: "w-full",
    };

    return (
      <section
        ref={ref}
        className={`mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 ${maxWidthStyles[maxWidth]} ${className}`}
        {...props}
      >
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";
