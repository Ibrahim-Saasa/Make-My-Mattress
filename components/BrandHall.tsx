import React from "react";
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
}) => {
  // Brand accent colors mapping
  const brandAccentColors: { [key: string]: string } = {
    Slumbersoft: "#A78BFA",
    Sleepworks: "#34D399",
    Spinowell: "#60A5FA",
    "Bedding N More": "#F97316",
    Sleepson: "#94A3B8",
    SleepGenie: "#4F46E5",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Section maxWidth="2xl" className="pt-14 pb-10">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#09174A] via-[#0C1F63] to-[#1740D1] px-8 py-10 text-white md:px-12 md:py-14 shadow-[0_28px_70px_rgba(9,23,74,0.26)]">
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
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
            <div>
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
            </div>

            <div className="flex justify-center lg:justify-center lg:pl-6">
              <div className="rounded-[2.5rem] border border-white/18 bg-white/12 px-10 py-8 shadow-[0_28px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <BrandLogo
                  size="xl"
                  layout="stacked"
                  showWordmark={false}
                  className="gap-5 scale-150"
                />
              </div>
            </div>
          </div>
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
