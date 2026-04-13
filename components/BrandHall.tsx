import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRANDS } from "../constants";
import { BrandMetadata } from "../types";
import { BrandCard, BrandLogo, CTASection, Section } from "./UI";

interface Props {
  onSelectBrand: (brand: BrandMetadata) => void;
  userName: string | null;
  selectedBrand: BrandMetadata | null;
  onResumeBuild: () => void;
  onOpenConsultant: () => void;
  cartCount: number;
  isGuest: boolean;
  onLogin: () => void;
  onCartClick: () => void;
  onLogout: () => void;
}

const BrandHall: React.FC<Props> = ({
  onSelectBrand,
  userName,
  selectedBrand,
  onResumeBuild,
  onOpenConsultant,
  cartCount,
  isGuest,
  onLogin,
  onCartClick,
  onLogout,
}) => {
  const navigate = useNavigate();
  const heroOffers = [
    {
      eyebrow: "New launch spotlight",
      title: "Premium comfort, explained clearly",
      description:
        "Compare collections, understand materials, and choose confidently without showroom pressure.",
    },
    {
      eyebrow: "India-first service",
      title: "Fast delivery and guided support",
      description:
        "Built for Indian buyers who want clarity on comfort, durability, and delivery before checkout.",
    },
    {
      eyebrow: "Sleep guidance",
      title: "A calmer way to pick the right feel",
      description:
        "Use guided discovery, expert help, and cleaner product stories to narrow down the right mattress faster.",
    },
  ];

  const [activeOffer, setActiveOffer] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveOffer((current) => (current + 1) % heroOffers.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [heroOffers.length]);

  // Handle click outside profile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showProfileMenu]);

  // Brand accent colors mapping
  const brandAccentColors: { [key: string]: string } = {
    Slumbersoft: "#A78BFA",
    Sleepworks: "#34D399",
    Spinowell: "#60A5FA",
    "Bedding N More": "#F97316",
    Sleepson: "#94A3B8",
    SleepGenie: "#4F46E5",
  };

  const luxurySignals = [
    {
      label: "Curated comfort",
      value: "Premium sleep systems for Indian homes",
    },
    {
      label: "Built with clarity",
      value: "Specifications, guidance, and pricing in one flow",
    },
    {
      label: "Support that stays",
      value: "Expert help before and after purchase",
    },
  ];

  const starField = [
    { left: "6%", top: "10%", size: 2, delay: "0s", duration: "4.8s" },
    { left: "14%", top: "28%", size: 3, delay: "0.8s", duration: "5.6s" },
    { left: "22%", top: "8%", size: 2, delay: "1.4s", duration: "4.3s" },
    { left: "31%", top: "18%", size: 2, delay: "0.5s", duration: "5.1s" },
    { left: "39%", top: "34%", size: 3, delay: "1.2s", duration: "6.2s" },
    { left: "48%", top: "12%", size: 2, delay: "2s", duration: "4.9s" },
    { left: "57%", top: "25%", size: 2, delay: "0.3s", duration: "5.8s" },
    { left: "66%", top: "9%", size: 3, delay: "1.8s", duration: "5.4s" },
    { left: "74%", top: "30%", size: 2, delay: "0.9s", duration: "4.6s" },
    { left: "83%", top: "14%", size: 2, delay: "1.6s", duration: "5.7s" },
    { left: "91%", top: "22%", size: 3, delay: "2.2s", duration: "6s" },
    { left: "11%", top: "55%", size: 2, delay: "0.4s", duration: "5.2s" },
    { left: "28%", top: "64%", size: 3, delay: "1.1s", duration: "6.3s" },
    { left: "44%", top: "58%", size: 2, delay: "1.9s", duration: "4.7s" },
    { left: "61%", top: "69%", size: 2, delay: "0.7s", duration: "5.9s" },
    { left: "79%", top: "60%", size: 3, delay: "1.5s", duration: "5.3s" },
    { left: "88%", top: "74%", size: 2, delay: "0.2s", duration: "4.5s" },
    { left: "4%", top: "84%", size: 2, delay: "0.6s", duration: "5.4s" },
    { left: "15%", top: "92%", size: 3, delay: "1.3s", duration: "6.1s" },
    { left: "26%", top: "81%", size: 2, delay: "2.1s", duration: "4.8s" },
    { left: "35%", top: "88%", size: 2, delay: "0.9s", duration: "5.7s" },
    { left: "46%", top: "95%", size: 3, delay: "1.7s", duration: "6.4s" },
    { left: "58%", top: "83%", size: 2, delay: "0.1s", duration: "4.9s" },
    { left: "69%", top: "90%", size: 3, delay: "1.4s", duration: "5.8s" },
    { left: "81%", top: "86%", size: 2, delay: "2.4s", duration: "4.6s" },
    { left: "93%", top: "94%", size: 2, delay: "0.8s", duration: "5.5s" },
    { left: "10%", top: "116%", size: 2, delay: "1.6s", duration: "6.2s" },
    { left: "23%", top: "124%", size: 3, delay: "0.2s", duration: "5.3s" },
    { left: "38%", top: "112%", size: 2, delay: "1.1s", duration: "4.7s" },
    { left: "52%", top: "129%", size: 3, delay: "1.9s", duration: "6s" },
    { left: "67%", top: "118%", size: 2, delay: "0.4s", duration: "5.1s" },
    { left: "78%", top: "126%", size: 2, delay: "2s", duration: "5.9s" },
    { left: "90%", top: "114%", size: 3, delay: "0.7s", duration: "4.8s" },
    { left: "8%", top: "146%", size: 2, delay: "1.5s", duration: "5.6s" },
    { left: "21%", top: "154%", size: 3, delay: "0.3s", duration: "6.3s" },
    { left: "33%", top: "141%", size: 2, delay: "1.2s", duration: "4.9s" },
    { left: "47%", top: "158%", size: 2, delay: "2.2s", duration: "5.8s" },
    { left: "63%", top: "144%", size: 3, delay: "0.5s", duration: "6.1s" },
    { left: "76%", top: "152%", size: 2, delay: "1.8s", duration: "4.7s" },
    { left: "89%", top: "148%", size: 2, delay: "0.9s", duration: "5.4s" },
    { left: "3%", top: "166%", size: 2, delay: "1.1s", duration: "5.9s" },
    { left: "12%", top: "176%", size: 3, delay: "0.4s", duration: "6.4s" },
    { left: "24%", top: "169%", size: 2, delay: "1.8s", duration: "5.2s" },
    { left: "37%", top: "182%", size: 3, delay: "0.7s", duration: "6.1s" },
    { left: "49%", top: "171%", size: 2, delay: "2.1s", duration: "4.9s" },
    { left: "59%", top: "188%", size: 2, delay: "0.5s", duration: "5.7s" },
    { left: "71%", top: "173%", size: 3, delay: "1.5s", duration: "6.3s" },
    { left: "84%", top: "185%", size: 2, delay: "0.9s", duration: "5.1s" },
    { left: "95%", top: "178%", size: 2, delay: "1.9s", duration: "4.8s" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[210%] dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,114,255,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_28%)]" />
        <div className="absolute left-[8%] top-[12%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(112,149,255,0.10),transparent_60%)] blur-3xl animate-[mmm-night-drift_18s_ease-in-out_infinite]" />
        <div className="absolute right-[10%] top-[64%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_62%)] blur-3xl animate-[mmm-night-drift_22s_ease-in-out_infinite_reverse]" />
        <div className="absolute left-[26%] top-[138%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(76,114,255,0.08),transparent_58%)] blur-3xl animate-[mmm-night-drift_20s_ease-in-out_infinite]" />
        {starField.map((star, index) => (
          <span
            key={`${star.left}-${star.top}-${index}`}
            className="absolute rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.35)]"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `mmm-star-twinkle ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
        <div className="absolute left-[18%] top-[20%] h-px w-24 rotate-[18deg] bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-50" />
        <div className="absolute right-[12%] top-[38%] h-px w-16 -rotate-[22deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-40" />
        <div className="absolute left-[30%] top-[104%] h-px w-20 -rotate-[12deg] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-35" />
        <div className="absolute right-[18%] top-[138%] h-px w-14 rotate-[14deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-30" />
        <div className="absolute left-[12%] top-[176%] h-px w-24 rotate-[10deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-30" />
        <div className="absolute right-[22%] top-[192%] h-px w-20 -rotate-[18deg] bg-gradient-to-r from-transparent via-white/22 to-transparent opacity-25" />
      </div>
      <style>{`
        @keyframes mmm-star-twinkle {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.8); }
        }
        @keyframes mmm-night-drift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate3d(18px, -14px, 0) scale(1.06); opacity: 1; }
        }
      `}</style>
      <div className="sticky top-0 z-40 border-b border-theme-border bg-theme-card/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-full items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
              <BrandLogo
                compact
                size="sm"
                showTagline={false}
                showWordmark={false}
              />
            </div>
            <div className="hidden min-[420px]:block">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-white">
                Make My Mattress
              </p>
              <p className="mt-1 text-sm text-[#C7D4F6]">
                Premium comfort, factory direct
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-6 lg:flex">
            {[
              { label: "Collections", target: "brand-grid" },
              { label: "Sleep Journal", target: "sleep-journal" },
            ].map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() =>
                  document
                    .getElementById(link.target)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-sm font-bold text-[#DCE6FF] transition-colors hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onOpenConsultant}
              className="text-sm font-bold text-[#DCE6FF] transition-colors hover:text-white"
            >
              Talk to Expert
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={onCartClick}
              className="hidden items-center rounded-full border border-white/10 bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#0C1F63] transition hover:bg-slate-100 md:flex md:items-center"
            >
              Cart
              <span className="ml-2 rounded-full bg-[var(--brand-primary)] px-2 py-1 text-[10px] text-white">
                {cartCount}
              </span>
            </button>
            <button
              type="button"
              onClick={selectedBrand ? onResumeBuild : onOpenConsultant}
              className="hidden rounded-full border border-[#2A4CB4] bg-transparent px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#6E92FF] transition hover:border-[#7F9CFF] hover:text-white md:block"
            >
              {selectedBrand ? "Resume Build" : "Need Help?"}
            </button>
            {isGuest ? (
              <button
                type="button"
                onClick={onLogin}
                className="rounded-full bg-[var(--brand-primary)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-[var(--brand-primary-deep)]"
              >
                Sign In
              </button>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="rounded-full border border-white/10 bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#0C1F63] hover:bg-slate-100 transition"
                >
                  {userName ? `Hi, ${userName}` : "Welcome back"}
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-white/95 shadow-2xl z-50">
                    <div className="space-y-1 p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-[#0C1F63] hover:bg-slate-100 rounded-lg transition"
                      >
                        My Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/orders");
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-[#0C1F63] hover:bg-slate-100 rounded-lg transition"
                      >
                        Order History
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/sleep-preferences");
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-[#0C1F63] hover:bg-slate-100 rounded-lg transition"
                      >
                        Sleep Preferences
                      </button>
                      <div className="h-px bg-slate-200 my-2" />
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/support");
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-[#0C1F63] hover:bg-slate-100 rounded-lg transition"
                      >
                        Support
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Section maxWidth="2xl" className="pt-10 pb-10">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-[#09174A] via-[#0C1F63] to-[#1740D1] px-8 py-10 text-white md:px-12 md:py-14 shadow-[0_28px_70px_rgba(9,23,74,0.26)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(200,165,91,0.16),transparent_22%)]" />
          <div className="pointer-events-none absolute right-[-60px] top-10 h-56 w-56 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em]">
              Factory-direct comfort
            </span>
            {isGuest && (
              <button
                onClick={onLogin}
                className="rounded-full border border-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition hover:bg-white hover:text-slate-900"
              >
                Sign in to save your build
              </button>
            )}
            {cartCount > 0 && (
              <span className="rounded-full bg-emerald-400/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
                {cartCount} item{cartCount === 1 ? "" : "s"} ready for checkout
              </span>
            )}
          </div>
          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
            <div className="order-first lg:order-last flex justify-center lg:justify-center lg:pl-6">
              <div className="rounded-[2.75rem] border border-[rgba(255,255,255,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] px-10 py-8 shadow-[0_28px_70px_rgba(0,0,0,0.18)] backdrop-blur-md">
                <BrandLogo
                  size="xl"
                  layout="stacked"
                  showWordmark={false}
                  className="gap-5 scale-150"
                />
                <div className="mt-6 rounded-[1.5rem] border border-white/12 bg-[#081742]/40 px-5 py-4 text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#DCE6FF]">
                    Signature promise
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-100">
                    Premium comfort, honest guidance, and a buying journey that
                    feels calm from the first click.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 order-last lg:order-first">
              {userName && (
                <p className="text-sm font-bold text-[#DCE6FF] uppercase tracking-wider mb-3">
                  Welcome back, {userName}!
                </p>
              )}
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                Find the right mattress before you ever talk to sales.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
                Browse comfort families, compare sleep styles, and jump into a
                build only when you are ready. We have made the first step
                simpler: choose the collection that sounds most like you.
              </p>
              <div className="mt-6 rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#DCE6FF]">
                  {heroOffers[activeOffer].eyebrow}
                </p>
                <h2 className="mt-2 text-xl font-black text-white md:text-2xl">
                  {heroOffers[activeOffer].title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200">
                  {heroOffers[activeOffer].description}
                </p>
                <div className="mt-4 flex gap-2">
                  {heroOffers.map((offer, index) => (
                    <button
                      key={offer.title}
                      type="button"
                      onClick={() => setActiveOffer(index)}
                      aria-label={`Show offer ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeOffer
                          ? "w-10 bg-white"
                          : "w-2.5 bg-white/35 hover:bg-white/55"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    document
                      .getElementById("brand-grid")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-2xl bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-[var(--brand-primary-deep)] transition hover:bg-[#EFF3FF]"
                >
                  Browse collections
                </button>
                <button
                  onClick={selectedBrand ? onResumeBuild : onOpenConsultant}
                  className="rounded-2xl border border-white/20 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
                >
                  {selectedBrand
                    ? `Resume ${selectedBrand.name} build`
                    : "Need help choosing?"}
                </button>
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {luxurySignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="rounded-[1.5rem] border border-white/14 bg-white/8 px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#E6ECFF]">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-100">
                      {signal.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section maxWidth="2xl" className="pb-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Mattresses",
              description: "Explore comfort families and start building.",
              cta: "Browse now",
              icon: "🛏",
              tint: "from-[#EEF3FF] to-[#DCE6FF]",
              onClick: () =>
                document
                  .getElementById("brand-grid")
                  ?.scrollIntoView({ behavior: "smooth" }),
            },
            {
              title: "Build Your Own",
              description: "Jump into customization once you know your fit.",
              cta: selectedBrand ? "Resume build" : "Start building",
              icon: "✨",
              tint: "from-[#F4E6C7] to-[#FBF7ED]",
              onClick: () =>
                selectedBrand
                  ? onResumeBuild()
                  : document
                      .getElementById("brand-grid")
                      ?.scrollIntoView({ behavior: "smooth" }),
            },
            {
              title: "Sleep Guidance",
              description: "Get help narrowing down the right comfort type.",
              cta: "Talk to expert",
              icon: "☁️",
              tint: "from-[#E7F8F4] to-[#F0FDFA]",
              onClick: onOpenConsultant,
            },
            {
              title: "Sleep Journal",
              description: "Learn about materials, support, and buying cues.",
              cta: "Read below",
              icon: "🌙",
              tint: "from-[#F5F0FF] to-[#EEF3FF]",
              onClick: () =>
                document
                  .getElementById("sleep-journal")
                  ?.scrollIntoView({ behavior: "smooth" }),
            },
          ].map((shortcut) => (
            <button
              key={shortcut.title}
              type="button"
              onClick={shortcut.onClick}
              className="group relative overflow-hidden rounded-[1.75rem] border border-[rgba(23,64,209,0.08)] bg-white/95 p-6 text-left shadow-theme-light transition-all hover:-translate-y-1 hover:border-[rgba(23,64,209,0.18)] hover:shadow-theme-medium dark:border-[#29427E] dark:bg-[linear-gradient(180deg,#12234F_0%,#0C183C_100%)]"
            >
              <div
                className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${shortcut.tint} opacity-95 [mask-image:linear-gradient(to_bottom,black,transparent)] dark:opacity-18`}
              />
              <div className="absolute -right-6 top-4 h-20 w-20 rounded-full bg-white/60 blur-2xl transition-transform duration-500 group-hover:scale-125 dark:bg-white/10" />
              <div className="relative z-10 flex items-start justify-between">
                <div className="rounded-2xl bg-white/90 px-3 py-2 text-2xl shadow-[0_10px_24px_rgba(23,64,209,0.08)] dark:bg-white/10">
                  {shortcut.icon}
                </div>
                <div className="mt-1 flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,64,209,0.18)] dark:bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,64,209,0.12)] dark:bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,64,209,0.08)] dark:bg-white/5" />
                </div>
              </div>
              <p className="relative z-10 mt-3 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--brand-primary)] dark:text-[#AFC0FF]">
                Quick entry
              </p>
              <h3 className="relative z-10 mt-4 text-xl font-black text-slate-900 dark:text-white">
                {shortcut.title}
              </h3>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {shortcut.description}
              </p>
              <span className="relative z-10 mt-5 inline-flex rounded-full border border-[rgba(23,64,209,0.12)] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#0C1F63] shadow-[0_10px_24px_rgba(23,64,209,0.08)] transition-transform duration-300 group-hover:translate-x-1 dark:border-[#3756A6] dark:bg-[#1A2D63] dark:text-[#E7EEFF]">
                {shortcut.cta}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <section id="brand-grid" className="py-8">
        <Section maxWidth="2xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--brand-primary)] dark:text-[#9BB0FF]">
                Sleep collections
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                Start with the feel you want
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
                Each collection below is tuned for a different sleep need. Pick
                one to start customizing dimensions and pricing right away.
              </p>
            </div>
            {selectedBrand && (
              <button
                onClick={onResumeBuild}
                className="rounded-2xl border border-[rgba(23,64,209,0.12)] bg-[rgba(23,64,209,0.06)] px-5 py-3 text-sm font-bold text-[var(--brand-primary)] transition hover:bg-[rgba(23,64,209,0.12)]"
              >
                Continue with {selectedBrand.name}
              </button>
            )}
          </div>

          <div className="mb-8 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Premium materials",
                description:
                  "Designed to communicate quality through fabric, support, and long-term durability.",
                icon: "✦",
                tint: "from-[#FBF7ED] to-[#F5E8C8]",
              },
              {
                title: "Guided personalization",
                description:
                  "Choose by feel and lifestyle first, then fine-tune the build only when it helps.",
                icon: "◎",
                tint: "from-[#EEF3FF] to-[#DCE6FF]",
              },
              {
                title: "Luxury without showroom pressure",
                description:
                  "A quieter, better-explained way to compare collections from home.",
                icon: "◇",
                tint: "from-[#EAF8F3] to-[#D5F3E9]",
              },
            ].map((point) => (
              <div
                key={point.title}
                className="group relative overflow-hidden rounded-[1.75rem] border border-[rgba(23,64,209,0.08)] bg-white/95 p-5 shadow-[0_18px_40px_rgba(15,33,89,0.05)] dark:border-[#29427E] dark:bg-[linear-gradient(180deg,#12234F_0%,#0C183C_100%)]"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${point.tint} opacity-95 [mask-image:linear-gradient(to_bottom,black,transparent)] dark:opacity-16`}
                />
                <div className="absolute -right-5 top-3 text-5xl text-[rgba(23,64,209,0.08)] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 dark:text-white/5">
                  {point.icon}
                </div>
                <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.22em] text-[#9A7A39] dark:text-[#D8B875]">
                  Premium cue
                </p>
                <h3 className="relative z-10 mt-4 text-lg font-black text-slate-900 dark:text-white">
                  {point.title}
                </h3>
                <p className="relative z-10 mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {point.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BRANDS.map((brand) => (
              <div
                key={brand.id}
                onClick={() => onSelectBrand(brand)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <BrandCard
                  name={brand.name}
                  type={brand.type}
                  description={brand.description}
                  accentColor={brandAccentColors[brand.name] || "#6366F1"}
                  features={
                    brand.ai_tags?.slice(0, 3) || [
                      "Premium Materials",
                      "Expert Support",
                      "Custom Comfort",
                    ]
                  }
                  onLearnMore={() => onSelectBrand(brand)}
                />
              </div>
            ))}
          </div>
        </Section>
      </section>

      <Section maxWidth="2xl" className="py-20">
        <div className="rounded-2xl bg-gradient-to-r from-[#EEF3FF] to-[#F6F8FE] p-12 text-center dark:from-[#0D1B4E]/60 dark:to-[#11235A]/70">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Why the experience feels easier
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            We are helping people narrow down the right mattress family first,
            then customize size and thickness second. That keeps the shopping
            journey clearer and less overwhelming.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-4xl mb-3">🛏️</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Guided choice
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Start with the comfort family that matches your sleep style
                instead of guessing from technical specs.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Transparent pricing
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Move into customization only after you have chosen the right
                series, with live pricing updates as you go.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-4xl mb-3">💯</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Expert backup
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If you are unsure, the sleep consultant can guide you before you
                commit to a build.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="sleep-journal" maxWidth="2xl" className="pb-20">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--brand-primary)] dark:text-[#9BB0FF]">
              Sleep journal
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              Learn before you buy
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
              A lighter first version of the education layer from the brief:
              useful tips, material guidance, and confidence-building content.
            </p>
          </div>
          <button
            onClick={onOpenConsultant}
            className="rounded-2xl border border-[rgba(23,64,209,0.12)] bg-[rgba(23,64,209,0.06)] px-5 py-3 text-sm font-bold text-[var(--brand-primary)] transition hover:bg-[rgba(23,64,209,0.12)]"
          >
            Ask a sleep expert
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              category: "Comfort guide",
              title: "Memory foam vs latex: which feel is right for you?",
              description:
                "A quick primer on pressure relief, bounce, cooling, and long-term support for Indian homes.",
              accent: "from-[#EEF3FF] via-[#F6F8FF] to-[#DCE6FF]",
              icon: "☁️",
            },
            {
              category: "Buying help",
              title: "How to choose the right size before you customize",
              description:
                "Use bed frame dimensions, room layout, and sleep habits to avoid ordering a mattress that feels wrong in practice.",
              accent: "from-[#FBF7ED] via-[#FFF9EF] to-[#F4E6C7]",
              icon: "📐",
            },
            {
              category: "Sleep care",
              title: "What makes a mattress feel premium over time?",
              description:
                "Understand layer quality, fabric choice, and durability signals so price feels justified instead of confusing.",
              accent: "from-[#EAF8F3] via-[#F4FCF8] to-[#D7F2E8]",
              icon: "✨",
            },
          ].map((article) => (
            <article
              key={article.title}
              className="group relative overflow-hidden rounded-[2rem] border border-[rgba(23,64,209,0.08)] bg-white/95 p-6 shadow-theme-light transition-all hover:-translate-y-1 hover:shadow-theme-medium dark:border-[#29427E] dark:bg-[linear-gradient(180deg,#12234F_0%,#0C183C_100%)]"
            >
              <div
                className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${article.accent} opacity-95 [mask-image:linear-gradient(to_bottom,black,transparent)] dark:opacity-14`}
              />
              <div className="absolute -right-6 top-5 h-24 w-24 rounded-full bg-white/60 blur-2xl transition-transform duration-500 group-hover:scale-125 dark:bg-white/10" />
              <div className="relative z-10 flex items-start justify-between">
                <div className="rounded-2xl bg-white/90 px-3 py-2 text-2xl shadow-[0_10px_24px_rgba(23,64,209,0.08)] dark:bg-white/10">
                  {article.icon}
                </div>
                <div className="mt-1 flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,64,209,0.18)] dark:bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,64,209,0.12)] dark:bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,64,209,0.08)] dark:bg-white/5" />
                </div>
              </div>
              <p className="relative z-10 mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--brand-primary)] dark:text-[#AFC0FF]">
                {article.category}
              </p>
              <h3 className="relative z-10 mt-4 text-xl font-black leading-snug text-slate-900 dark:text-white">
                {article.title}
              </h3>
              <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {article.description}
              </p>
              <button
                type="button"
                onClick={onOpenConsultant}
                className="relative z-10 mt-6 inline-flex rounded-full border border-[rgba(23,64,209,0.12)] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#0C1F63] shadow-[0_10px_24px_rgba(23,64,209,0.08)] transition-transform duration-300 hover:translate-x-1 dark:border-[#3756A6] dark:bg-[#1A2D63] dark:text-[#E7EEFF]"
              >
                Explore with expert help
              </button>
            </article>
          ))}
        </div>
      </Section>

      <CTASection
        title="Ready to build your mattress?"
        description="Choose a collection that feels right, then set the exact size and comfort profile."
        theme="primary"
        primaryCTA={{
          text: selectedBrand
            ? `Continue ${selectedBrand.name}`
            : "Pick a Collection Above",
          onClick: () =>
            selectedBrand
              ? onResumeBuild()
              : document
                  .getElementById("brand-grid")
                  ?.scrollIntoView({ behavior: "smooth" }),
        }}
        secondaryCTA={{
          text: "Talk to a Sleep Expert",
          onClick: onOpenConsultant,
        }}
      />
    </div>
  );
};

export default BrandHall;
