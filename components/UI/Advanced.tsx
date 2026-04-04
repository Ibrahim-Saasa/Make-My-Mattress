import React from "react";
import { motion } from "framer-motion";
import { Button } from "./index";
import { hoverLift } from "../../src/utils/animations";

// ============================================================================
// FOOTER COMPONENT - Premium Footer
// ============================================================================

interface FooterLinkProps {
  href: string;
  label: string;
}

interface FooterSectionProps {
  title: string;
  links: FooterLinkProps[];
}

interface FooterProps {
  sections?: FooterSectionProps[];
  onSocialClick?: (platform: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  sections = [
    {
      title: "Product",
      links: [
        { href: "#", label: "Browse Mattresses" },
        { href: "#", label: "Customize" },
        { href: "#", label: "Brands" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "#", label: "About Us" },
        { href: "#", label: "Blog" },
        { href: "#", label: "Careers" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "#", label: "Contact" },
        { href: "#", label: "Shipping" },
        { href: "#", label: "Returns" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "#", label: "Privacy" },
        { href: "#", label: "Terms" },
        { href: "#", label: "Cookies" },
      ],
    },
  ],
  onSocialClick,
}) => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-black">M</span>
              </div>
              <span className="text-lg font-bold uppercase tracking-tight">
                Make My Mattress
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Bespoke comfort, factory direct. Handcrafted mattresses designed
              for your perfect sleep.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {["facebook", "twitter", "instagram", "linkedin"].map(
                (platform) => (
                  <button
                    key={platform}
                    onClick={() => onSocialClick?.(platform)}
                    className="
                    w-10 h-10 rounded-lg bg-slate-800 hover:bg-indigo-600
                    flex items-center justify-center transition-all duration-200
                    transform hover:scale-110 hover:-translate-y-1
                  "
                    aria-label={platform}
                  >
                    <span className="text-sm font-bold">
                      {platform[0].toUpperCase()}
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-white mb-4 uppercase text-sm tracking-widest">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="
                        text-slate-400 hover:text-white
                        transition-colors duration-200
                        text-sm
                      "
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <p>© 2026 Make My Mattress Co. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Made with ❤️ in Pune, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// PRODUCT CARD COMPONENT - Showcase Products Premium Style
// ============================================================================

interface ProductCardProps {
  image?: string;
  badge?: string;
  badgeColor?: "primary" | "success" | "warning";
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
  onCTA?: () => void;
  ctaText?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  badge,
  badgeColor = "primary",
  title,
  subtitle,
  description,
  price,
  rating = 4.5,
  reviews = 128,
  tags = [],
  onCTA,
  ctaText = "View Details",
}) => {
  const badgeColors = {
    primary:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
    success:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    warning:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  };

  return (
    <motion.div
      className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg hover:shadow-2xl"
      variants={hoverLift}
      initial="rest"
      whileHover="hover"
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden flex items-center justify-center">
        {image ? (
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="text-6xl text-gray-300">🛏️</div>
        )}

        {/* Badge */}
        {badge && (
          <motion.div
            className={`absolute top-4 right-4 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${badgeColors[badgeColor]}`}
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {badge}
          </motion.div>
        )}

        {/* Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {subtitle && (
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            {subtitle}
          </p>
        )}

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-lg ${i < Math.floor(rating) ? "⭐" : "☆"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {rating} ({reviews} reviews)
            </span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          {price && (
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {price}
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={onCTA}
            fullWidth={!price}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// BRAND CARD COMPONENT - Showcase Brands
// ============================================================================

interface BrandCardProps {
  logo?: string;
  name: string;
  type: string;
  description: string;
  accentColor?: string;
  features?: string[];
  onLearnMore?: () => void;
}

export const BrandCard: React.FC<BrandCardProps> = ({
  logo,
  name,
  type,
  description,
  accentColor = "#6366F1",
  features = [],
  onLearnMore,
}) => {
  const heroGradient = `linear-gradient(135deg, ${accentColor} 0%, #0C1F63 100%)`;

  return (
    <div
      className="group relative rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 100%)`,
        borderColor: `${accentColor}30`,
      }}
    >
      <div className="relative h-full rounded-3xl border border-gray-200 dark:border-slate-700 p-6 hover:border-opacity-50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        <div
          className="relative mb-6 h-48 overflow-hidden rounded-[2rem] border border-white/15"
          style={{ background: heroGradient }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(200,165,91,0.20),transparent_24%)]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
            {type}
          </div>

          {logo ? (
            <img
              src={logo}
              alt={name}
              className="absolute right-5 top-5 h-12 w-12 rounded-2xl object-cover shadow-lg"
            />
          ) : (
            <div
              className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white shadow-lg"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(12px)",
              }}
            >
              {name[0]}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <div className="relative mx-auto h-24 max-w-[240px]">
              <div className="absolute inset-x-0 bottom-0 h-5 rounded-[1.25rem] bg-[#4C2E17]/45 blur-[1px]" />
              <div className="absolute inset-x-4 bottom-2 h-5 rounded-[1.25rem] border border-white/10 bg-[rgba(255,255,255,0.12)]" />
              <div className="absolute inset-x-8 bottom-5 h-10 rounded-[1.5rem] bg-[linear-gradient(180deg,#FFFFFF_0%,#E9EEF9_100%)] shadow-[0_18px_40px_rgba(6,18,56,0.28)]" />
              <div className="absolute left-14 bottom-10 h-6 w-12 rounded-[1rem] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF3FF_100%)] shadow-md" />
              <div className="absolute left-28 bottom-10 h-6 w-12 rounded-[1rem] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF3FF_100%)] shadow-md" />
              <div className="absolute right-8 bottom-7 h-11 w-8 rounded-[1rem] bg-[linear-gradient(180deg,#F3F7FF_0%,#DCE5FF_100%)] shadow-md" />
              <div className="absolute right-11 bottom-11 h-4 w-2 rounded-full bg-white/80" />
              <div className="absolute right-8 bottom-11 h-4 w-2 rounded-full bg-white/80" />
              <div className="absolute right-5 bottom-11 h-4 w-2 rounded-full bg-white/80" />
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
              <span>Mattress</span>
              <span>Pillows</span>
              <span>Accessories</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {name}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {description}
          </p>

          {/* Features */}
          {features.length > 0 && (
            <ul className="space-y-2 mb-6">
              {features.slice(0, 3).map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* CTA */}
          <button
            onClick={onLearnMore}
            className="
              inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider
              transition-all duration-200 group/cta
            "
            style={{ color: accentColor }}
          >
            Learn More
            <svg
              className="w-4 h-4 group-hover/cta:translate-x-2 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TESTIMONIAL CARD COMPONENT - Customer Testimonials
// ============================================================================

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  avatar,
  rating = 5,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
      {/* Rating */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xl ${i < rating ? "⭐" : "☆"}`} />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="relative mb-8">
        <p className="text-xl text-gray-900 dark:text-white font-medium leading-relaxed italic before:content-['\\201C'] after:content-['\\201D'] before:text-4xl after:text-4xl before:opacity-20 after:opacity-20">
          {quote}
        </p>
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-slate-700"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold">
            {author[0]}
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{author}</p>
          {role && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FEATURE CARD COMPONENT - Display Features/Benefits
// ============================================================================

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: "primary" | "secondary" | "tertiary" | "accent";
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color = "primary",
}) => {
  const colorStyles = {
    primary:
      "from-indigo-500/10 to-indigo-500/5 border-indigo-200 dark:border-indigo-800",
    secondary:
      "from-rose-500/10 to-rose-500/5 border-rose-200 dark:border-rose-800",
    tertiary:
      "from-teal-500/10 to-teal-500/5 border-teal-200 dark:border-teal-800",
    accent:
      "from-amber-500/10 to-amber-500/5 border-amber-200 dark:border-amber-800",
  };

  const iconColors = {
    primary: "text-indigo-600 dark:text-indigo-400",
    secondary: "text-rose-600 dark:text-rose-400",
    tertiary: "text-teal-600 dark:text-teal-400",
    accent: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div
      className={`rounded-3xl p-8 border bg-gradient-to-br ${colorStyles[color]} transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
    >
      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2 ${iconColors[color]}`}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// ============================================================================
// STAT CARD COMPONENT - Display Statistics
// ============================================================================

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "tertiary" | "accent";
  suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  color = "primary",
  suffix,
}) => {
  const colorStyles = {
    primary: "from-indigo-600/10 to-indigo-600/5 text-indigo-600",
    secondary: "from-rose-600/10 to-rose-600/5 text-rose-600",
    tertiary: "from-teal-600/10 to-teal-600/5 text-teal-600",
    accent: "from-amber-600/10 to-amber-600/5 text-amber-600",
  };

  return (
    <div
      className={`rounded-2xl p-6 bg-gradient-to-br ${colorStyles[color]} text-center transition-all duration-300 hover:scale-105 hover:shadow-lg`}
    >
      {icon && <div className="text-3xl mb-3">{icon}</div>}
      <div className="text-4xl font-black text-gray-900 dark:text-white">
        {value}
        {suffix && <span className="text-2xl">{suffix}</span>}
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
};
