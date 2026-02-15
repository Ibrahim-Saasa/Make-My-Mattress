/**
 * DESIGN TOKENS - Premium Material Design System for Make-My-Mattress
 * Comprehensive design foundation for professional, premium B2C experience
 */

// ============================================================================
// COLOR SYSTEM - Premium & Trustworthy Palette
// ============================================================================

export const COLORS = {
  // Primary: Deep Indigo (trustworthy, premium)
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1", // Primary
    600: "#4F46E5", // Primary Dark
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },

  // Secondary: Warm Rose (premium accent for CTAs)
  secondary: {
    50: "#FDF2F8",
    100: "#FCE7F3",
    200: "#FBCFE8",
    300: "#F8B4D6",
    400: "#F472B6",
    500: "#EC4899", // Secondary
    600: "#DB2777",
    700: "#BE185D",
    800: "#9D174D",
    900: "#831843",
  },

  // Tertiary: Teal (trust, wellness)
  tertiary: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },

  // Accent: Warm Amber (wellness, comfort, warmth)
  accent: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B", // Accent
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  // Success: Emerald
  success: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBFAC0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#145231",
  },

  // Warning: Amber
  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  // Error: Rose
  error: {
    50: "#FDF2F8",
    100: "#FCE7F3",
    200: "#FBCFE8",
    300: "#F8B4D6",
    400: "#F472B6",
    500: "#EC4899",
    600: "#DB2777",
    700: "#BE185D",
    800: "#9D174D",
    900: "#831843",
  },

  // Neutral: Slate (text, backgrounds)
  neutral: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Light Theme Specific
  light: {
    background: "#FDFDFE",
    surface: "#FFFFFF",
    surfaceVariant: "#F9FAFB",
  },

  // Dark Theme Specific
  dark: {
    background: "#0F172A",
    surface: "#1E293B",
    surfaceVariant: "#334155",
  },
};

// ============================================================================
// TYPOGRAPHY SCALE
// ============================================================================

export const TYPOGRAPHY = {
  // Display: Hero titles
  display: {
    xl: { size: "3.5rem", weight: 900, lineHeight: "1.1" }, // 56px
    lg: { size: "3rem", weight: 900, lineHeight: "1.1" }, // 48px
    md: { size: "2.5rem", weight: 800, lineHeight: "1.2" }, // 40px
    sm: { size: "2rem", weight: 800, lineHeight: "1.2" }, // 32px
  },

  // Headline: Section titles
  headline: {
    lg: { size: "1.875rem", weight: 700, lineHeight: "1.2" }, // 30px
    md: { size: "1.5rem", weight: 700, lineHeight: "1.3" }, // 24px
    sm: { size: "1.25rem", weight: 700, lineHeight: "1.4" }, // 20px
    xs: { size: "1.125rem", weight: 600, lineHeight: "1.4" }, // 18px
  },

  // Title: Card titles, subheadings
  title: {
    lg: { size: "1.125rem", weight: 600, lineHeight: "1.4" }, // 18px
    md: { size: "1rem", weight: 600, lineHeight: "1.5" }, // 16px
    sm: { size: "0.875rem", weight: 600, lineHeight: "1.5" }, // 14px
  },

  // Body: Regular content
  body: {
    lg: { size: "1.125rem", weight: 400, lineHeight: "1.6" }, // 18px
    md: { size: "1rem", weight: 400, lineHeight: "1.6" }, // 16px
    sm: { size: "0.875rem", weight: 400, lineHeight: "1.5" }, // 14px
  },

  // Label: Form labels, small text
  label: {
    lg: { size: "0.875rem", weight: 600, lineHeight: "1.4" }, // 14px
    md: { size: "0.75rem", weight: 600, lineHeight: "1.3" }, // 12px
    sm: { size: "0.625rem", weight: 600, lineHeight: "1.2" }, // 10px
  },

  // Caption: Tiny text
  caption: {
    md: { size: "0.75rem", weight: 400, lineHeight: "1.3" }, // 12px
    sm: { size: "0.625rem", weight: 400, lineHeight: "1.2" }, // 10px
  },
};

// ============================================================================
// SPACING SCALE (4px base)
// ============================================================================

export const SPACING = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "2.5rem", // 40px
  "4xl": "3rem", // 48px
  "5xl": "3.5rem", // 56px
  "6xl": "4rem", // 64px
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// ============================================================================
// SHADOW SCALE (Premium depth)
// ============================================================================

export const SHADOWS = {
  // Elevation shadows
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",

  // Colored shadows (premium effect)
  indigo: {
    sm: "0 4px 6px -1px rgba(99, 102, 241, 0.2)",
    md: "0 10px 15px -3px rgba(99, 102, 241, 0.25)",
    lg: "0 20px 25px -5px rgba(99, 102, 241, 0.3)",
  },
  rose: {
    sm: "0 4px 6px -1px rgba(236, 72, 153, 0.2)",
    md: "0 10px 15px -3px rgba(236, 72, 153, 0.25)",
    lg: "0 20px 25px -5px rgba(236, 72, 153, 0.3)",
  },
  teal: {
    sm: "0 4px 6px -1px rgba(20, 184, 166, 0.2)",
    md: "0 10px 15px -3px rgba(20, 184, 166, 0.25)",
    lg: "0 20px 25px -5px rgba(20, 184, 166, 0.3)",
  },
};

// ============================================================================
// BORDER RADIUS (Premium rounded)
// ============================================================================

export const BORDER_RADIUS = {
  none: "0",
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.5rem", // 24px
  "3xl": "2rem", // 32px
  full: "9999px",
};

// ============================================================================
// GRADIENTS (Premium backgrounds)
// ============================================================================

export const GRADIENTS = {
  // Primary gradient (indigo to purple)
  primary: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
  primaryHover: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",

  // Secondary gradient (rose to pink)
  secondary: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",

  // Tertiary gradient (teal to cyan)
  tertiary: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",

  // Accent gradient (amber to orange)
  accent: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",

  // Success gradient
  success: "linear-gradient(135deg, #22C55E 0%, #10B981 100%)",

  // Dark gradient (for dark theme backgrounds)
  dark: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",

  // Light gradient (for light theme backgrounds)
  light: "linear-gradient(135deg, #FDFDFE 0%, #F9FAFB 100%)",
};

// ============================================================================
// ANIMATIONS & TRANSITIONS
// ============================================================================

export const ANIMATIONS = {
  // Durations
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  slower: "500ms",

  // Easing
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",

  // Preset transitions
  smooth: {
    colors: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    all: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// ============================================================================
// COMPONENT SIZING
// ============================================================================

export const COMPONENT_SIZES = {
  // Button heights
  button: {
    xs: "2rem", // 32px
    sm: "2.5rem", // 40px
    md: "3rem", // 48px
    lg: "3.5rem", // 56px
  },

  // Input heights
  input: {
    sm: "2.5rem", // 40px
    md: "3rem", // 48px
    lg: "3.5rem", // 56px
  },

  // Icon sizes
  icon: {
    xs: "1rem", // 16px
    sm: "1.5rem", // 24px
    md: "2rem", // 32px
    lg: "2.5rem", // 40px
    xl: "3rem", // 48px
  },
};

// ============================================================================
// BRAND COLOR ASSOCIATIONS (Mattress Brands)
// ============================================================================

export const BRAND_COLORS = {
  slumbersoft: {
    primary: "#9F7AEA", // Purple
    light: "#E9D8FD",
    dark: "#6B46C1",
    text: "#FFFFFF",
  },
  sleepworks: {
    primary: "#48BB78", // Emerald
    light: "#C6F6D5",
    dark: "#22543D",
    text: "#FFFFFF",
  },
  spinowell: {
    primary: "#ED8936", // Orange
    light: "#FED7D2",
    dark: "#7C2D12",
    text: "#FFFFFF",
  },
  beddingnmore: {
    primary: "#4299E1", // Blue
    light: "#BEE3F8",
    dark: "#1E40AF",
    text: "#FFFFFF",
  },
  sleepson: {
    primary: "#ECC94B", // Amber
    light: "#FFFFF0",
    dark: "#744210",
    text: "#000000",
  },
  sleepgenie: {
    primary: "#F687B3", // Rose
    light: "#FED7DE",
    dark: "#880E4F",
    text: "#FFFFFF",
  },
};

// ============================================================================
// SEMANTIC COLORS (Purpose-driven)
// ============================================================================

export const SEMANTIC_COLORS = {
  // Surfaces and backgrounds
  backgroundPrimary: "var(--color-background)",
  backgroundSecondary: "var(--color-card-background)",
  surfaceHover: "var(--color-card-background-hover)",

  // Text colors
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  textTertiary: "var(--color-text-tertiary)",

  // Interactive
  interactivePrimary: COLORS.primary[600],
  interactiveSecondary: COLORS.secondary[500],
  interactiveTertiary: COLORS.tertiary[500],

  // States
  success: COLORS.success[500],
  warning: COLORS.warning[500],
  error: COLORS.error[500],
  info: COLORS.primary[500],

  // Borders
  borderLight: "var(--color-border)",
  borderStrong: COLORS.neutral[400],
};
