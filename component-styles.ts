/**
 * COMPONENT STYLES & VARIANTS
 * Reusable component classes and styling patterns for consistent UI
 */

import {
  COLORS,
  TYPOGRAPHY,
  SHADOWS,
  BORDER_RADIUS,
  ANIMATIONS,
} from "./design-tokens";

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

export const BUTTON_VARIANTS = {
  // Primary: Main CTAs (solid gradient background)
  primary: {
    base: `
      px-6 py-3 rounded-xl font-bold text-white
      bg-gradient-to-r from-[#1740D1] to-[#0C1F63]
      hover:from-[#1237B5] hover:to-[#09174A]
      active:from-[#0C2B93] active:to-[#09174A]
      shadow-lg hover:shadow-xl
      transition-all duration-200 ease-out
      hover:scale-105 active:scale-95
      focus:outline-none focus:ring-2 focus:ring-[rgba(23,64,209,0.25)] focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    `,
    small: `px-4 py-2 rounded-lg text-sm`,
    large: `px-8 py-4 rounded-2xl text-lg`,
  },

  // Secondary: Alternative actions (outlined)
  secondary: {
    base: `
      px-6 py-3 rounded-xl font-bold
      border-2 border-[var(--brand-primary)] text-[var(--brand-primary)]
      hover:bg-[rgba(23,64,209,0.06)] dark:hover:bg-[rgba(23,64,209,0.16)]
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-[rgba(23,64,209,0.2)]
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    small: `px-4 py-2 rounded-lg text-sm border-1.5`,
    large: `px-8 py-4 rounded-2xl text-lg`,
  },

  // Tertiary: Ghost button (minimal)
  tertiary: {
    base: `
      px-6 py-3 rounded-xl font-bold text-[var(--brand-primary)]
      hover:bg-[rgba(23,64,209,0.06)] dark:hover:bg-[rgba(23,64,209,0.18)]
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-[rgba(23,64,209,0.15)]
      disabled:opacity-50
    `,
    small: `px-4 py-2 rounded-lg text-sm`,
    large: `px-8 py-4 rounded-2xl text-lg`,
  },

  // Accent: Warm CTAs (rose/orange)
  accent: {
    base: `
      px-6 py-3 rounded-xl font-bold text-[#09174A]
      bg-gradient-to-r from-[#C8A55B] to-[#9A7A39]
      hover:from-[#B3914B] hover:to-[#7F632E]
      shadow-lg hover:shadow-xl
      transition-all duration-200
      hover:scale-105 active:scale-95
      focus:outline-none focus:ring-2 focus:ring-[rgba(200,165,91,0.3)]
      disabled:opacity-50
    `,
    small: `px-4 py-2 rounded-lg text-sm`,
    large: `px-8 py-4 rounded-2xl text-lg`,
  },

  // Success: Positive actions
  success: {
    base: `
      px-6 py-3 rounded-xl font-bold text-white
      bg-gradient-to-r from-emerald-500 to-teal-600
      hover:from-emerald-600 hover:to-teal-700
      shadow-lg hover:shadow-xl
      transition-all duration-200
      disabled:opacity-50
    `,
  },

  // Danger: Destructive actions
  danger: {
    base: `
      px-6 py-3 rounded-xl font-bold text-white
      bg-gradient-to-r from-red-500 to-rose-600
      hover:from-red-600 hover:to-rose-700
      shadow-lg hover:shadow-xl
      transition-all duration-200
      disabled:opacity-50
    `,
  },
};

// ============================================================================
// CARD VARIANTS
// ============================================================================

export const CARD_VARIANTS = {
  // Minimal: Clean white card
  minimal: {
    base: `
      bg-white dark:bg-slate-900
      rounded-2xl
      border border-gray-100 dark:border-slate-800
      shadow-sm hover:shadow-md
      transition-shadow duration-200
    `,
    interactive: `cursor-pointer hover:border-[rgba(23,64,209,0.24)] dark:hover:border-[#4C72FF]`,
    padding: `p-6`,
  },

  // Elevated: Card with prominent shadow
  elevated: {
    base: `
      bg-white dark:bg-slate-900
      rounded-3xl
      border border-[#DCE3F3] dark:border-[#24408B]
      shadow-lg hover:shadow-2xl
      transition-all duration-300
    `,
    interactive: `
      cursor-pointer transform hover:scale-105 hover:-translate-y-1
      hover:border-[var(--brand-primary)] dark:hover:border-[#4C72FF]
    `,
    padding: `p-8`,
  },

  // Gradient: Cards with subtle gradient background
  gradient: {
    base: `
      bg-gradient-to-br from-[#F8FAFF] to-[#EEF3FF]
      dark:from-[#0D1B4E] dark:to-[#11235A]
      rounded-2xl
      border border-[#DCE3F3] dark:border-[#24408B]
      shadow-md
    `,
    padding: `p-6`,
  },

  // Glass: Glassmorphism effect
  glass: {
    base: `
      bg-white/80 dark:bg-slate-900/70
      backdrop-blur-lg
      rounded-2xl
      border border-white/35 dark:border-[#3151A4]/35
      shadow-lg
    `,
    padding: `p-6`,
  },
};

// ============================================================================
// INPUT VARIANTS (Text inputs, selects, etc.)
// ============================================================================

export const INPUT_VARIANTS = {
  // Default: Standard input field
  default: {
    base: `
      w-full
      px-4 py-3
      rounded-lg
      border-2 border-[#C7D2EA] dark:border-[#3151A4]
      bg-white dark:bg-slate-800
      text-gray-900 dark:text-white
      placeholder-gray-500 dark:placeholder-gray-400
      transition-all duration-200
      focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[rgba(23,64,209,0.16)] dark:focus:ring-[rgba(76,114,255,0.22)]
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:border-[#AEBBDB] dark:hover:border-[#4870D7]
    `,
    error: `border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30`,
    success: `border-emerald-500 focus:border-emerald-500 focus:ring-emerald-200`,
  },

  // Large: Bigger input for prominent forms
  large: {
    base: `
      w-full
      px-5 py-4
      rounded-xl
      text-lg
      border-2
      transition-all duration-200
    `,
  },

  // Minimal: Borderless input (underline only)
  minimal: {
    base: `
      w-full
      px-0 py-2
      border-none border-b-2 border-gray-300
      bg-transparent
      text-gray-900 dark:text-white
      focus:outline-none focus:border-indigo-600
      transition-colors duration-200
    `,
  },
};

// ============================================================================
// FORM LABEL STYLES
// ============================================================================

export const LABEL_VARIANTS = {
  // Default: Standard label
  default: {
    base: `
      block
      text-sm font-semibold
      text-gray-700 dark:text-gray-300
      mb-2
      uppercase tracking-wider
    `,
    required: `after:content-['*'] after:ml-1 after:text-red-500`,
  },
};

// ============================================================================
// BADGE & CHIP STYLES
// ============================================================================

export const BADGE_VARIANTS = {
  // Primary badge
  primary: {
    base: `
      inline-flex items-center gap-2
      px-3 py-1 rounded-full
      bg-[rgba(23,64,209,0.08)] dark:bg-[rgba(76,114,255,0.18)]
      text-[var(--brand-primary)] dark:text-[#D9E2FF]
      text-xs font-bold uppercase tracking-wider
    `,
  },

  // Success badge
  success: {
    base: `
      inline-flex items-center gap-2
      px-3 py-1 rounded-full
      bg-emerald-100 dark:bg-emerald-900/30
      text-emerald-700 dark:text-emerald-300
      text-xs font-bold
    `,
  },

  // Warning badge
  warning: {
    base: `
      inline-flex items-center gap-2
      px-3 py-1 rounded-full
      bg-amber-100 dark:bg-amber-900/30
      text-amber-700 dark:text-amber-300
      text-xs font-bold
    `,
  },

  // Error badge
  error: {
    base: `
      inline-flex items-center gap-2
      px-3 py-1 rounded-full
      bg-red-100 dark:bg-red-900/30
      text-red-700 dark:text-red-300
      text-xs font-bold
    `,
  },
};

// ============================================================================
// TYPOGRAPHY UTILITY CLASSES
// ============================================================================

export const TYPOGRAPHY_CLASSES = {
  // Display
  displayXl: `text-5xl md:text-6xl font-black leading-tight`,
  displayLg: `text-4xl md:text-5xl font-black leading-tight`,
  displayMd: `text-3xl md:text-4xl font-extrabold leading-tight`,
  displaySm: `text-2xl md:text-3xl font-extrabold leading-snug`,

  // Headline
  headlineLg: `text-2xl md:text-3xl font-bold leading-snug`,
  headlineMd: `text-xl md:text-2xl font-bold leading-normal`,
  headlineSm: `text-lg md:text-xl font-bold leading-normal`,

  // Body
  bodyLg: `text-lg leading-relaxed`,
  bodyMd: `text-base leading-relaxed`,
  bodySm: `text-sm leading-normal`,

  // Labels
  labelLg: `text-sm font-semibold uppercase tracking-wider`,
  labelMd: `text-xs font-bold uppercase tracking-widest`,
  labelSm: `text-[10px] font-extrabold uppercase tracking-widest`,
};

// ============================================================================
// CONTAINER & LAYOUT STYLES
// ============================================================================

export const LAYOUT = {
  // Container
  container: `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`,

  // Section spacing
  sectionPy: `py-12 md:py-16 lg:py-20`,
  sectionGap: `gap-8 md:gap-12 lg:gap-16`,

  // Premium grid
  gridCols: {
    auto: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`,
    cols2: `grid-cols-1 md:grid-cols-2`,
    cols3: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`,
    cols4: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`,
  },
};

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

export const ANIMATION_CLASSES = {
  // Fade animations
  fadeIn: `animate-in fade-in duration-500`,
  fadeInUp: `animate-in fade-in slide-in-from-bottom-4 duration-500`,
  fadeInDown: `animate-in fade-in slide-in-from-top-4 duration-500`,

  // Scale animations
  scaleIn: `animate-in fade-in zoom-in-95 duration-300`,
  scaleUp: `transition-transform duration-300 hover:scale-105`,

  // Pulse effect
  pulse: `animate-pulse`,

  // Smooth transitions
  smoothAll: `transition-all duration-200 ease-out`,
  smoothColors: `transition-colors duration-200`,
  smoothTransform: `transition-transform duration-200`,
};

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

export const RESPONSIVE = {
  // Padding
  padX: `px-4 md:px-6 lg:px-8`,
  padY: `py-8 md:py-12 lg:py-16`,

  // Text sizing
  textResponsive: `text-lg md:text-xl lg:text-2xl`,

  // Grid spacing
  gap: `gap-4 md:gap-6 lg:gap-8`,
};

// ============================================================================
// STATE STYLES
// ============================================================================

export const STATES = {
  // Disabled state
  disabled: `opacity-50 cursor-not-allowed pointer-events-none`,

  // Loading state overlay
  loading: `relative pointer-events-none opacity-75`,

  // Focus ring (accessible)
  focusRing: `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-primary)]`,

  // Error state
  error: `border-red-500 focus:ring-red-200`,

  // Success state
  success: `border-emerald-500 focus:ring-emerald-200`,
};
