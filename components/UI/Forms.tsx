/**
 * Advanced Form Components - Phase 5
 * Accessible, animated form inputs with full design system integration
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, fadeInDown } from "../../src/utils/animations";

// ============================================================================
// CHECKBOX COMPONENT - Accessible Checkbox with Animation
// ============================================================================

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  variant?: "default" | "toggle";
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      variant = "default",
      id,
      className = "",
      ...props
    },
    ref,
  ) => {
    const checkboxId = id || `checkbox-${Math.random()}`;

    return (
      <div className="flex flex-col gap-2">
        {variant === "default" ? (
          <label
            htmlFor={checkboxId}
            className={`flex items-start gap-3 cursor-pointer group ${className}`}
          >
            <motion.div
              className="relative mt-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                ref={ref}
                type="checkbox"
                id={checkboxId}
                className="sr-only"
                {...props}
              />
              <div className="w-5 h-5 rounded-lg border-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-slate-900 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                <motion.svg
                  className="w-full h-full text-indigo-600 dark:text-indigo-400 p-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    props.checked
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </div>
            </motion.div>

            <div className="flex-1">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {label}
              </span>
              {description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </label>
        ) : (
          // Toggle variant
          <label htmlFor={checkboxId} className="flex items-center gap-3">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className="sr-only"
              {...props}
            />
            <motion.div
              className="relative w-12 h-6 bg-gray-300 dark:bg-slate-700 rounded-full cursor-pointer overflow-hidden"
              animate={{
                backgroundColor: props.checked
                  ? "#4F46E5"
                  : "var(--color-gray-300)",
              }}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: props.checked ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.div>
            {label && (
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {label}
              </span>
            )}
          </label>
        )}

        {error && (
          <motion.p
            className="text-xs text-red-600 dark:text-red-400"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

// ============================================================================
// RADIO GROUP COMPONENT - Accessible Radio Buttons with Animation
// ============================================================================

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
  variant?: "default" | "card";
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  className = "",
  variant = "default",
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-900 dark:text-white">
          {label}
        </label>
      )}

      <fieldset className="space-y-3">
        {options.map((option) => (
          <motion.label
            key={option.value}
            className={`relative flex items-start gap-3 cursor-pointer group ${
              variant === "card"
                ? "p-4 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors"
                : ""
            }`}
            whileHover={{ y: -2 }}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              className="sr-only"
            />
            <motion.div
              className="relative mt-1 w-5 h-5 rounded-full border-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-slate-900 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence>
                {value === option.value && (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex-1">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {option.label}
              </span>
              {option.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </motion.label>
        ))}
      </fieldset>

      {error && (
        <motion.p
          className="text-xs text-red-600 dark:text-red-400"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ============================================================================
// TEXTAREA COMPONENT - Rich Textarea with Animations
// ============================================================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  charLimit?: number;
  showCharCount?: boolean;
  variant?: "default" | "large";
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      error,
      charLimit,
      showCharCount = false,
      variant = "default",
      value = "",
      className = "",
      ...props
    },
    ref,
  ) => {
    const charCount = String(value).length;
    const isFull = charLimit && charCount >= charLimit;

    const baseStyles = `
      w-full rounded-xl border-2 border-gray-200 dark:border-slate-700
      bg-white dark:bg-slate-900
      text-slate-900 dark:text-white
      placeholder-slate-500 dark:placeholder-slate-400
      focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400
      focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30
      transition-all duration-200 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const sizeStyles = {
      default: "px-4 py-3 min-h-28 text-sm",
      large: "px-6 py-4 min-h-40 text-base",
    };

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {label}
          </label>
        )}

        {description && (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}

        <motion.textarea
          ref={ref}
          value={value}
          className={`${baseStyles} ${sizeStyles[variant]} ${className}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          disabled={charLimit && charCount >= charLimit}
          {...(props as any)}
        />

        <div className="flex items-center justify-between">
          {error && (
            <motion.p
              className="text-xs text-red-600 dark:text-red-400"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              {error}
            </motion.p>
          )}

          {showCharCount && charLimit && (
            <motion.span
              className={`text-xs font-semibold ${
                isFull
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
              animate={{ color: isFull ? "#DC2626" : "currentColor" }}
            >
              {charCount} / {charLimit}
            </motion.span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

// ============================================================================
// SELECT COMPONENT - Custom Dropdown with Animation
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  error,
  disabled = false,
  searchable = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-900 dark:text-white">
          {label}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Select Button */}
        <motion.button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-indigo-600 dark:hover:border-indigo-400 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          whileHover={!disabled ? { backgroundColor: "rgba(0,0,0,0.02)" } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          <span className={selectedOption ? "font-medium" : "text-slate-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.svg
            className="w-5 h-5 text-slate-600 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ transformOrigin: "top" }}
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                    autoFocus
                  />
                </div>
              )}

              {/* Options */}
              <motion.div className="overflow-y-auto flex-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange?.(option.value);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      disabled={option.disabled}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border-0 ${
                        value === option.value
                          ? "bg-indigo-100 dark:bg-indigo-900/30 font-semibold text-indigo-700 dark:text-indigo-300"
                          : "text-slate-900 dark:text-white"
                      } ${option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      {option.icon && (
                        <span className="text-lg">{option.icon}</span>
                      )}
                      {option.label}
                      {value === option.value && (
                        <svg
                          className="w-5 h-5 ml-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          />
                        </svg>
                      )}
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                    No options found
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          className="text-xs text-red-600 dark:text-red-400"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ============================================================================
// DIALOG/MODAL COMPONENT - Accessible Modal Dialog with Animation
// ============================================================================

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
  closeButtonLabel?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  actions = [],
  closeButtonLabel = "Close",
}) => {
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants: any = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={`${sizeStyles[size]} w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl`}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {title}
                  </h2>
                  {description && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {description}
                    </p>
                  )}
                </div>
                <motion.button
                  onClick={onClose}
                  className="ml-4 p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6 text-slate-600 dark:text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                {children}
              </div>

              {/* Footer */}
              {actions.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-end gap-3">
                  <motion.button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-semibold text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {closeButtonLabel}
                  </motion.button>
                  {actions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      onClick={action.onClick}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        action.variant === "danger"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : action.variant === "secondary"
                            ? "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// FORM GROUP COMPONENT - Wrapper for grouped form fields
// ============================================================================

interface FormGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  title,
  description,
  children,
  columns = 1,
}) => {
  const columnStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <motion.fieldset
      className="space-y-6"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={`grid ${columnStyles[columns]} gap-6`}>{children}</div>
    </motion.fieldset>
  );
};
