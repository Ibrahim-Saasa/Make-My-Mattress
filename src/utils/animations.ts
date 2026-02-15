/**
 * Animation Variants and Utilities for Framer Motion
 * Centralized animation definitions for consistent animations across the app
 */

import { Variants } from "framer-motion";

// ============================================================================
// ENTRANCE ANIMATIONS
// ============================================================================

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// STAGGER CONTAINER (for animating children sequentially)
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// ============================================================================
// HOVER ANIMATIONS (for cards, buttons)
// ============================================================================

export const hoverScale: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

export const hoverGrow: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.08,
    y: -5,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const hoverShadow: Variants = {
  rest: { boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" },
  hover: { boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" },
};

export const hoverLift: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonPress: Variants = {
  rest: { scale: 1 },
  tap: { scale: 0.95 },
};

export const buttonHover: Variants = {
  rest: { scale: 1, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.05,
    boxShadow: "0 15px 30px rgba(99, 102, 241, 0.4)",
  },
};

// ============================================================================
// MODAL/DIALOG ANIMATIONS
// ============================================================================

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 50,
    transition: { duration: 0.3 },
  },
};

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export const scrollRevealLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export const scrollRevealRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// ROTATION & SPIN ANIMATIONS
// ============================================================================

export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const spinFast: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// ============================================================================
// TAB/ACCORDION ANIMATIONS
// ============================================================================

export const tabSlide: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2 },
  },
};

export const accordionContent: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const pulse: Variants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const shimmer: Variants = {
  animate: {
    backgroundPosition: ["200% center", "-200% center"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ============================================================================
// PAGE TRANSITION ANIMATIONS
// ============================================================================

export const pageEnter: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3 },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a stagger effect for children with custom delay
 */
export const createStaggerVariants = (
  baseDelay = 0.1,
  delayChildren = 0.2,
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: baseDelay,
      delayChildren,
    },
  },
});

/**
 * Create a scroll reveal animation with custom duration
 */
export const createScrollReveal = (duration = 0.7): Variants => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: "easeOut" },
  },
});

/**
 * Create a hover effect with custom scale
 */
export const createHoverScale = (scale = 1.05): Variants => ({
  rest: { scale: 1 },
  hover: {
    scale,
    transition: { duration: 0.3 },
  },
});
