/**
 * Component Polish & Enhanced States - Phase 6
 * Loading states, disabled states, error handling, and edge cases
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// ENHANCED INPUT COMPONENT - With all state variants
// ============================================================================

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  isLoading?: boolean;
  variant?: "default" | "validated";
}

export const EnhancedInput = React.forwardRef<
  HTMLInputElement,
  EnhancedInputProps
>(
  (
    {
      label,
      error,
      success,
      hint,
      isLoading = false,
      variant = "default",
      disabled,
      value = "",
      className = "",
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = String(value).length > 0;
    const hasError = !!error;
    const hasSuccess = !!success && !hasError && hasValue;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <motion.input
            ref={ref}
            type="text"
            value={value}
            disabled={disabled || isLoading}
            {...(props as any)}
            className={`
              w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
              bg-white dark:bg-slate-900 text-slate-900 dark:text-white
              placeholder-slate-400 dark:placeholder-slate-500
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
              ${
                hasError
                  ? "border-red-500 dark:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30"
                  : hasSuccess
                    ? "border-green-500 dark:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30"
                    : "border-gray-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
              }
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Loading Indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Indicator */}
          <AnimatePresence>
            {hasSuccess && !isLoading && (
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Indicator */}
          <AnimatePresence>
            {hasError && !isLoading && (
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {hint && !hasError && !hasSuccess && (
            <motion.p
              className="text-xs text-slate-600 dark:text-slate-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              {hint}
            </motion.p>
          )}

          {hasError && (
            <motion.p
              className="text-xs text-red-600 dark:text-red-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              role="alert"
            >
              {error}
            </motion.p>
          )}

          {hasSuccess && (
            <motion.p
              className="text-xs text-green-600 dark:text-green-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              role="status"
            >
              {success}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

EnhancedInput.displayName = "EnhancedInput";

// ============================================================================
// ENHANCED BUTTON - With loading states and variants
// ============================================================================

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const EnhancedButton = React.forwardRef<
  HTMLButtonElement,
  EnhancedButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText = "Loading...",
      icon,
      fullWidth = false,
      children,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl transition-all duration-200";

    const variantStyles = {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300 disabled:bg-indigo-600/50",
      secondary:
        "bg-gray-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-gray-300 focus:ring-gray-300 disabled:bg-gray-200/50",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 disabled:bg-red-600/50",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300 disabled:bg-green-600/50",
    };

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        {...(props as any)}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"}
          ${className}
        `}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <motion.span
                className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {loadingText}
            </motion.span>
          ) : (
            <motion.span
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {icon && <span>{icon}</span>}
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  },
);

EnhancedButton.displayName = "EnhancedButton";

// ============================================================================
// LOADING SKELETON - For content placeholders
// ============================================================================

interface SkeletonProps {
  variant?: "text" | "heading" | "button" | "card" | "avatar";
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  count = 1,
  className = "",
}) => {
  const variants = {
    text: "h-4 w-full",
    heading: "h-8 w-3/4",
    button: "h-10 w-24",
    card: "h-48 w-full",
    avatar: "h-12 w-12 rounded-full",
  };

  const skeleton = (
    <motion.div
      className={`
        ${variants[variant]}
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        dark:from-slate-700 dark:via-slate-600 dark:to-slate-700
        rounded-lg
        ${className}
      `}
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  );

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{skeleton}</div>
      ))}
    </div>
  );
};

// ============================================================================
// TOAST NOTIFICATION - Feedback notifications
// ============================================================================

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 4000,
  onClose,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
    warning: "bg-yellow-500 text-white",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ⓘ",
    warning: "⚠",
  };

  return (
    <motion.div
      className={`
        px-6 py-4 rounded-xl shadow-lg flex items-center gap-3
        ${typeStyles[type]}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-xl">{icons[type]}</span>
      <p>{message}</p>
      <button
        onClick={onClose}
        className="ml-auto opacity-70 hover:opacity-100"
        aria-label="Close notification"
      >
        ✕
      </button>
    </motion.div>
  );
};

// ============================================================================
// ERROR BOUNDARY WRAPPER - Enhanced error display
// ============================================================================

interface ErrorDisplayProps {
  title: string;
  message: string;
  onRetry?: () => void;
  details?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  onRetry,
  details,
}) => {
  return (
    <motion.div
      className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-red-900 dark:text-red-200">{title}</h3>
          <p className="text-sm text-red-800 dark:text-red-300 mt-2">
            {message}
          </p>
          {details && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-red-700 dark:text-red-400 font-semibold">
                Technical Details
              </summary>
              <code className="block mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs text-red-900 dark:text-red-200 overflow-auto">
                {details}
              </code>
            </details>
          )}
          {onRetry && (
            <motion.button
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// EMPTY STATE - For no data scenarios
// ============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📭",
  title,
  description,
  action,
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        {title}
      </h3>
      {description && (
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <EnhancedButton variant="primary" onClick={action.onClick}>
          {action.label}
        </EnhancedButton>
      )}
    </motion.div>
  );
};

// ============================================================================
// PROGRESS INDICATOR - For multi-step processes
// ============================================================================

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <div key={idx}>
            <motion.button
              onClick={() => onStepClick?.(idx)}
              className={`
                flex items-center justify-center w-10 h-10 rounded-full font-bold
                transition-all duration-200
                ${
                  isCompleted
                    ? "bg-green-600 text-white"
                    : isCurrent
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/30"
                      : "bg-gray-200 dark:bg-slate-700 text-slate-900 dark:text-white"
                }
                ${onStepClick ? "cursor-pointer hover:shadow-lg" : "cursor-default"}
              `}
              whileHover={onStepClick && !isCompleted ? { scale: 1.1 } : {}}
              whileTap={onStepClick ? { scale: 0.95 } : {}}
            >
              {isCompleted ? "✓" : idx + 1}
            </motion.button>

            {idx < steps.length - 1 && (
              <motion.div
                className="flex-1 h-1 bg-gray-200 dark:bg-slate-700 mx-2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ originX: 0 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// TOOLTIP COMPONENT - Contextual help
// ============================================================================

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: "-top-12 left-1/2 -translate-x-1/2",
    bottom: "top-12 left-1/2 -translate-x-1/2",
    left: "left-0 top-1/2 -translate-y-1/2 -translate-x-12",
    right: "right-0 top-1/2 -translate-y-1/2 translate-x-12",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              absolute ${positionStyles[position]} bg-slate-900 dark:bg-white
              text-white dark:text-slate-900 px-3 py-2 rounded-lg text-sm
              whitespace-nowrap pointer-events-none z-50
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
