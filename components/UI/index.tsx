import React from "react";

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
      font-bold transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95 hover:scale-105
    `;

    const sizeStyles = {
      sm: "px-4 py-2 rounded-lg text-sm",
      md: "px-6 py-3 rounded-xl text-base",
      lg: "px-8 py-4 rounded-2xl text-lg",
    };

    const variantStyles = {
      primary: `
        bg-gradient-to-r from-indigo-600 to-indigo-700
        hover:from-indigo-700 hover:to-indigo-800
        text-white shadow-lg hover:shadow-xl
        focus:ring-indigo-300
      `,
      secondary: `
        border-2 border-indigo-600 text-indigo-600
        hover:bg-indigo-50 dark:hover:bg-indigo-900/20
        focus:ring-indigo-300
      `,
      tertiary: `
        text-indigo-600 hover:bg-indigo-50
        dark:text-indigo-400 dark:hover:bg-indigo-900/20
        focus:ring-indigo-200
      `,
      accent: `
        bg-gradient-to-r from-rose-500 to-pink-600
        hover:from-rose-600 hover:to-pink-700
        text-white shadow-lg hover:shadow-xl
        focus:ring-rose-300
      `,
      success: `
        bg-gradient-to-r from-emerald-500 to-teal-600
        hover:from-emerald-600 hover:to-teal-700
        text-white shadow-lg hover:shadow-xl
        focus:ring-emerald-300
      `,
      danger: `
        bg-gradient-to-r from-red-500 to-rose-600
        hover:from-red-600 hover:to-rose-700
        text-white shadow-lg hover:shadow-xl
        focus:ring-red-300
      `,
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
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
      </button>
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
        bg-white dark:bg-slate-900
        border border-gray-100 dark:border-slate-800
        shadow-sm hover:shadow-md
      `,
      elevated: `
        bg-white dark:bg-slate-900
        border border-gray-200 dark:border-slate-700
        shadow-lg hover:shadow-2xl
      `,
      gradient: `
        bg-gradient-to-br from-gray-50 to-gray-100
        dark:from-slate-800 dark:to-slate-900
        border border-gray-200 dark:border-slate-700
        shadow-md
      `,
      glass: `
        bg-white/80 dark:bg-slate-900/70
        backdrop-blur-lg
        border border-white/20 dark:border-slate-700/30
        shadow-lg
      `,
    };

    const interactiveStyle = interactive
      ? `cursor-pointer transform hover:scale-105 hover:-translate-y-1`
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
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
          text-gray-700 dark:text-gray-300
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
      bg-white dark:bg-slate-800
      text-gray-900 dark:text-white
      placeholder-gray-500 dark:placeholder-gray-400
      border-2 border-gray-300 dark:border-slate-600
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/30
      hover:border-gray-400 dark:hover:border-slate-500
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
        ? "pl-10"
        : "pr-10"
      : "";

    return (
      <div className={containerClass}>
        {icon && (
          <div
            className={`
              absolute top-1/2 -translate-y-1/2
              text-gray-400 dark:text-gray-500
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
