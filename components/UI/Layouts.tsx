import React, { useState } from "react";
import { motion } from "framer-motion";
import { BrandLogo, Button } from "./index";
import {
  fadeInUp,
  fadeInDown,
  staggerContainer,
  scrollReveal,
} from "../../src/utils/animations";

// ============================================================================
// NAVIGATION HEADER COMPONENT - Sticky, Premium Header
// ============================================================================

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  logo?: React.ReactNode;
  navLinks?: NavLink[];
  ctaButton?: {
    text: string;
    onClick: () => void;
  };
  onMenuToggle?: () => void;
  showCart?: boolean;
  cartCount?: number;
  onCartClick?: () => void;
  authUser?: { name: string } | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  navLinks = [
    { label: "Browse", href: "#" },
    { label: "Brands", href: "#" },
    { label: "Customize", href: "#" },
    { label: "About", href: "#" },
  ],
  ctaButton,
  showCart = false,
  cartCount = 0,
  onCartClick,
  authUser,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <BrandLogo
              className="group-hover:scale-[1.02] transition-transform duration-200"
              compact
              size="md"
              showTagline={false}
            />
            {logo && <>{logo}</>}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  text-sm font-semibold text-gray-700 dark:text-gray-300
                  hover:text-[var(--brand-primary)] dark:hover:text-[#7F9CFF]
                  transition-colors duration-200 relative group
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
                  after:bg-[var(--brand-primary)] after:transition-all after:duration-200
                  group-hover:after:w-full
                "
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Cart Icon */}
            {showCart && (
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-primary)] text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth Actions */}
            {authUser ? (
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {authUser.name}
                </span>
                <button
                  onClick={onLogout}
                  className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              ctaButton && (
                <Button variant="primary" size="sm" onClick={ctaButton.onClick}>
                  {ctaButton.text}
                </Button>
              )
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 dark:border-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-300 dark:hover:text-[#7F9CFF]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

// ============================================================================
// HERO SECTION COMPONENT - Premium Hero with Gradient Background
// ============================================================================

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
  backgroundImage?: string;
  backgroundGradient?: string;
  accentColor?: string;
  statsSection?: Array<{ label: string; value: string }>;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  backgroundGradient = "from-[#09174A] via-[#1237B5] to-[#1740D1]",
  accentColor = "from-indigo-500 to-purple-600",
  statsSection,
}) => {
  return (
    <motion.section
      className={`relative min-h-screen md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br ${backgroundGradient} pt-20 md:pt-0`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage}), linear-gradient(135deg, #09174A 0%, #1237B5 55%, #1740D1 100%)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Subtitle Tag */}
        {subtitle && (
          <motion.div
            className="inline-block mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30"
            variants={fadeInDown}
          >
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              {subtitle}
            </span>
          </motion.div>
        )}

        {/* Main Title */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 tracking-tighter"
          variants={fadeInUp}
        >
          {title}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed"
            variants={fadeInUp}
          >
            {description}
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          variants={fadeInUp}
        >
          {primaryCTA && (
            <Button
              variant="secondary"
              size="lg"
              onClick={primaryCTA.onClick}
              className="!bg-white !text-[var(--brand-primary)] hover:!bg-[#EFF3FF]"
            >
              {primaryCTA.text}
            </Button>
          )}
          {secondaryCTA && (
            <Button
              variant="secondary"
              size="lg"
              onClick={secondaryCTA.onClick}
              className="border-white text-white hover:!bg-white/10"
            >
              {secondaryCTA.text}
            </Button>
          )}
        </motion.div>

        {/* Stats Section */}
        {statsSection && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {statsSection.map((stat, idx) => (
              <motion.div
                key={idx}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                variants={fadeInUp}
              >
                <motion.div
                  className="text-3xl font-black text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

// ============================================================================
// CTA SECTION COMPONENT - Call to Action Container
// ============================================================================

interface CTASectionProps {
  title: string;
  description?: string;
  primaryCTA: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
  theme?: "primary" | "secondary" | "dark";
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  theme = "primary",
}) => {
  const themeStyles = {
    primary: "bg-gradient-to-r from-[#0C1F63] to-[#1740D1]",
    secondary: "bg-gradient-to-r from-[#102B89] to-[#1740D1]",
    dark: "bg-gradient-to-r from-[#09174A] to-[#0C1F63]",
  };

  return (
    <section
      className={`${themeStyles[theme]} py-16 md:py-24 rounded-3xl overflow-hidden`}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          {title}
        </h2>

        {description && (
          <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="accent"
            size="lg"
            onClick={primaryCTA.onClick}
            className={
              theme === "dark"
                ? "!bg-white !text-gray-900 hover:!bg-gray-100"
                : ""
            }
          >
            {primaryCTA.text}
          </Button>
          {secondaryCTA && (
            <Button
              variant="secondary"
              size="lg"
              onClick={secondaryCTA.onClick}
              className={`!border-white !text-white hover:!bg-white/10 ${theme === "dark" ? "!border-gray-300 !text-gray-100" : ""}`}
            >
              {secondaryCTA.text}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// GRID SECTION COMPONENT - Responsive Grid Layout
// ============================================================================

interface GridSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export const GridSection: React.FC<GridSectionProps> = ({
  title,
  description,
  children,
  columns = 3,
  gap = "lg",
}) => {
  const columnStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  const gapStyles = {
    sm: "gap-4 md:gap-6",
    md: "gap-6 md:gap-8",
    lg: "gap-8 md:gap-12",
  };

  return (
    <motion.section
      className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {(title || description) && (
        <motion.div
          className="text-center mb-12 md:mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {title && (
            <motion.h2
              className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4"
              variants={fadeInUp}
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      )}

      <motion.div
        className={`grid ${columnStyles[columns]} ${gapStyles[gap]}`}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {React.Children.toArray(children).map((child, index) => (
          <motion.div key={index} variants={scrollReveal}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

// ============================================================================
// COMPARISON TABLE COMPONENT - Product Comparison
// ============================================================================

interface ComparisonItem {
  feature: string;
  items: (string | boolean)[];
}

interface ComparisonTableProps {
  title?: string;
  items: string[];
  comparisons: ComparisonItem[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title,
  items,
  comparisons,
}) => {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      {title && (
        <h2 className="text-4xl font-black text-center mb-12 text-gray-900 dark:text-white">
          {title}
        </h2>
      )}

      <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-slate-800">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider" />
              {items.map((item) => (
                <th
                  key={item}
                  className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comparison, idx) => (
              <tr
                key={comparison.feature}
                className={`border-b border-gray-200 dark:border-slate-800 ${idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-800/50"}`}
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                  {comparison.feature}
                </td>
                {comparison.items.map((item, idx) => (
                  <td key={idx} className="px-6 py-4 text-center">
                    {typeof item === "boolean" ? (
                      item ? (
                        <span className="text-2xl">✅</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )
                    ) : (
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
