import React, { useEffect, useMemo, useState } from "react";
import {
  BrandMetadata,
  UserRole,
  MattressParams,
  PricingResult,
} from "../types";
import { LENGTHS, BREADTHS, THICKNESS_STEPS } from "../constants";
import { calculateMattressPrice } from "../services/pricingEngine";
import { calculateLogistics } from "../services/logisticsEngine";
import { FinancialEngine } from "../services/financialEngine";
import { useTheme } from "../src/contexts/ThemeContext";

interface Props {
  brand: BrandMetadata;
  userRole: UserRole;
  initialParams?: Partial<MattressParams>;
  onNext: (params: MattressParams, pricing: PricingResult) => void;
  onBack: () => void;
  onBookService: () => void;
}

const SmartConfigurator: React.FC<Props> = ({
  brand,
  userRole,
  initialParams,
  onNext,
  onBack,
  onBookService,
}) => {
  const { theme } = useTheme();
  const buildStartingParams = (): MattressParams => ({
    length: initialParams?.length ?? 72,
    breadth: initialParams?.breadth ?? 36,
    thickness: initialParams?.thickness ?? 6,
    materialRate: brand.baseRate,
    userType: userRole,
    demandLevel: initialParams?.demandLevel ?? "NORMAL",
    coupon_code: initialParams?.coupon_code,
    dealer_auth_code: initialParams?.dealer_auth_code,
  });

  const [params, setParams] = useState<MattressParams>(buildStartingParams);

  const [isCustomModalOpen, setCustomModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState({ l: "", b: "" });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setParams(buildStartingParams());
  }, [
    brand.id,
    brand.baseRate,
    userRole,
    initialParams?.length,
    initialParams?.breadth,
    initialParams?.thickness,
    initialParams?.demandLevel,
    initialParams?.coupon_code,
    initialParams?.dealer_auth_code,
  ]);

  const triggerHaptic = (impact: "light" | "medium") => {
    if (navigator.vibrate) {
      navigator.vibrate(impact === "light" ? 10 : 25);
    }
  };

  const results = useMemo(() => {
    try {
      setValidationError(null);
      return calculateMattressPrice(params);
    } catch (e: any) {
      setValidationError(e.message);
      return null;
    }
  }, [params]);

  const logistics = useMemo(
    () => calculateLogistics(params.length, params.breadth, params.thickness),
    [params],
  );

  const handleCustomSize = () => {
    const l = parseFloat(customInput.l);
    const b = parseFloat(customInput.b);

    if (l < 12 || b < 12) {
      setValidationError("Minimum 12x12 inches required.");
      return;
    }

    setParams({ ...params, length: l, breadth: b });
    setCustomModalOpen(false);
    triggerHaptic("medium");
  };

  const handleAddToCartAction = () => {
    if (results) {
      onNext(params, results);
    }
  };

  const sizeLabel = `${params.length}" x ${params.breadth}" x ${params.thickness}"`;
  const idealFor = brand.ai_tags?.slice(0, 2).join(" • ");

  return (
    <>
      {/* Full-screen background gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(135deg,#041229 0%, #0b3b66 45%, #153f6f 100%)"
              : "linear-gradient(180deg,#f7f9ff 0%, #edf2ff 100%)",
        }}
      />
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-4 pb-40 md:px-6 md:py-8 md:pb-40 lg:px-8">
          <div className="mb-4 flex items-center gap-3 md:mb-6 md:gap-4">
            <button
              onClick={onBack}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-theme-border bg-theme-card text-theme-secondary transition-colors hover:text-[var(--brand-primary)] md:h-12 md:w-12"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--brand-primary)]">
                Mattress configurator
              </p>
              <h1 className="mt-1 text-xl font-black leading-tight text-theme-primary md:text-3xl">
                Build your {brand.name} mattress
              </h1>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1.1fr)_420px]">
            <div className="space-y-6 md:space-y-8">
              <section className="rounded-[2rem] border border-theme-border bg-theme-card p-4 md:p-6 shadow-theme-light">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">
                      Building now
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-theme-primary">
                      {brand.name} custom mattress
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-theme-secondary">
                      Adjust dimensions and comfort profile below. Your price
                      updates live, so you can see the trade-off before adding
                      to cart.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-theme-input px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-theme-secondary">
                      Current size
                    </p>
                    <p className="mt-1 text-lg font-black text-theme-primary">
                      {sizeLabel}
                    </p>
                  </div>
                </div>
                {idealFor && (
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-theme-secondary">
                    Best known for: {idealFor}
                  </p>
                )}
              </section>

              <div className="space-y-4 lg:hidden">
                <section className="overflow-hidden rounded-[2rem] border border-theme-border bg-theme-card shadow-theme-medium">
                  <div className="border-b border-theme-border px-4 py-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-theme-secondary">
                      Live preview
                    </p>
                    <h2 className="mt-2 text-lg font-black text-theme-primary">
                      {sizeLabel}
                    </h2>
                    <p className="mt-2 text-sm text-theme-secondary">
                      A smaller, cleaner preview so the main focus stays on choosing the right fit.
                    </p>
                  </div>

                  <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF3FF_100%)] px-4 py-8 dark:bg-[linear-gradient(180deg,#162347_0%,#1B2B56_100%)]">
                    <div
                      className="relative mx-auto w-full max-w-[170px]"
                      style={{ perspective: "1000px" }}
                    >
                      <div
                        className="relative rounded-2xl shadow-theme-2xl transition-all duration-500"
                        style={{
                          height: `${Math.max(params.thickness * 12, 52)}px`,
                          width: `${Math.min((params.breadth / 84) * 100, 100)}%`,
                          margin: "0 auto",
                          transform: "rotateX(58deg) rotateZ(-45deg)",
                          background:
                            "linear-gradient(135deg, var(--color-card-background) 0%, var(--color-card-background-hover) 100%)",
                        }}
                      >
                        <div className="absolute inset-0 rounded-2xl border border-theme-border/60" />
                        <div className="absolute left-3 top-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                          MMM
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2">
                      <span className="text-2xl font-black tracking-tighter text-theme-primary">
                        {params.length}" × {params.breadth}"
                      </span>
                      {logistics.is_cargo && (
                        <span className="rounded-full bg-amber-200 px-2 py-1 text-[8px] font-bold text-brand-amber shadow-sm">
                          HEAVY CARGO
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-theme-secondary">
                      {brand.name} • {params.thickness}" profile
                    </p>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-theme-border bg-theme-card p-4 shadow-theme-light">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-theme-secondary">
                    Quick summary
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-theme-input px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-theme-secondary">
                        Collection
                      </p>
                      <p className="mt-2 text-sm font-black text-theme-primary">
                        {brand.name}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-theme-input px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-theme-secondary">
                        Size
                      </p>
                      <p className="mt-2 text-sm font-black text-theme-primary">
                        {params.length}" x {params.breadth}"
                      </p>
                    </div>
                    <div className="rounded-2xl bg-theme-input px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-theme-secondary">
                        Thickness
                      </p>
                      <p className="mt-2 text-sm font-black text-theme-primary">
                        {params.thickness}"
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {validationError && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20 text-xs font-bold animate-pulse">
                  Error: {validationError}
                </div>
              )}

              <section className="pt-2">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <label className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest">
                    Comfort Profile
                  </label>
                  <span className="text-[10px] font-bold text-indigo-600">
                    Thickness Variation
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-3 sm:overflow-x-auto sm:pb-4 sm:px-4 sm:-mx-4 sm:snap-x">
                  {THICKNESS_STEPS.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setParams({ ...params, thickness: t });
                        triggerHaptic("light");
                      }}
                      className={`min-h-[96px] rounded-3xl border font-bold transition-all sm:flex-shrink-0 sm:w-24 sm:py-6 sm:snap-center hover:scale-[0.98] ${
                        params.thickness === t
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-theme-xl shadow-indigo-600/30"
                          : "bg-theme-card text-theme-secondary border-theme-border hover:border-indigo-400 shadow-theme-light"
                      }`}
                    >
                      <span className="text-2xl block">{t}"</span>
                      <span className="text-[8px] opacity-70 uppercase">
                        {t < 6 ? "Basic" : t < 8 ? "Premium" : "Royal"}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-3 block">
                    Frame Length
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                    {LENGTHS.map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setParams({ ...params, length: l });
                          triggerHaptic("light");
                        }}
                        className={`min-h-[72px] rounded-2xl border px-4 py-3 text-sm font-bold transition-all hover:scale-[1.02] sm:px-6 ${
                          params.length === l
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-theme-medium"
                            : "bg-theme-input text-theme-secondary border-theme-border shadow-theme-light"
                        }`}
                      >
                        {l}"
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest block">
                      Frame Breadth
                    </label>
                    <button
                      onClick={onBookService}
                      className="text-[10px] font-bold text-indigo-700 hover:underline text-right"
                    >
                      Book Expert Measurement
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {BREADTHS.map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          setParams({ ...params, breadth: b });
                          triggerHaptic("light");
                        }}
                        className={`min-h-[72px] rounded-2xl border px-4 py-3 text-sm font-bold transition-all hover:scale-[1.02] sm:px-6 ${
                          params.breadth === b
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-theme-medium"
                            : "bg-theme-input text-theme-secondary border-theme-border shadow-theme-light"
                        }`}
                      >
                        {b}"
                      </button>
                    ))}
                    <button
                      onClick={() => setCustomModalOpen(true)}
                      className="min-h-[72px] rounded-2xl border bg-brand-amber/20 px-4 py-3 text-sm font-bold text-brand-amber transition-all hover:scale-[1.02] shadow-theme-light sm:px-6 flex items-center justify-center gap-2 border-brand-amber/40"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Odd Size
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-theme-secondary">
                    Not sure about your frame size? Use a standard option for
                    speed, or choose an odd size if your bed has custom
                    dimensions.
                  </p>
                </div>
              </section>

              <section className="rounded-[2rem] border border-theme-border bg-theme-card p-4 md:p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-theme-secondary">
                      What happens next
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-theme-secondary">
                      <li>1. Save this build to your cart.</li>
                      <li>
                        2. Review totals and delivery details at checkout.
                      </li>
                      <li>
                        3. Book an expert measurement if you want a home visit.
                      </li>
                    </ul>
                  </div>
                  <div className="min-w-56 rounded-2xl bg-theme-input p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-theme-secondary">
                      Estimated total
                    </p>
                    <p className="mt-2 text-2xl font-black text-theme-primary">
                      {results
                        ? FinancialEngine.formatCurrency(results.final_price)
                        : "---"}
                    </p>
                    <p className="mt-2 text-xs text-theme-secondary">
                      {userRole === UserRole.DEALER
                        ? "Dealer pricing shown before GST."
                        : "Includes the current configuration and tax estimate."}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="hidden space-y-6 lg:sticky lg:top-28 lg:block lg:self-start">
              <section className="overflow-hidden rounded-[2rem] border border-theme-border bg-theme-card shadow-theme-medium">
                <div className="border-b border-theme-border px-4 md:px-6 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-theme-secondary">
                    Live preview
                  </p>
                  <h2 className="mt-2 text-xl font-black text-theme-primary">
                    {sizeLabel}
                  </h2>
                  <p className="mt-2 text-sm text-theme-secondary">
                    A compact visual preview so you can stay focused on choosing
                    the right size and comfort settings.
                  </p>
                </div>

                <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF3FF_100%)] px-4 py-10 dark:bg-[linear-gradient(180deg,#162347_0%,#1B2B56_100%)] md:px-6">
                  <div
                    className="relative mx-auto w-full max-w-[200px] md:max-w-[280px]"
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="relative rounded-2xl shadow-theme-2xl transition-all duration-500"
                      style={{
                        height: `${Math.max(params.thickness * 14, 56)}px`,
                        width: `${Math.min((params.breadth / 84) * 100, 100)}%`,
                        margin: "0 auto",
                        transform: "rotateX(58deg) rotateZ(-45deg)",
                        background:
                          "linear-gradient(135deg, var(--color-card-background) 0%, var(--color-card-background-hover) 100%)",
                      }}
                    >
                      <div className="absolute inset-0 rounded-2xl border border-theme-border/60" />
                      <div className="absolute left-3 top-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                        MMM
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex items-center justify-center gap-2">
                    <span className="text-3xl font-black tracking-tighter text-theme-primary">
                      {params.length}" × {params.breadth}"
                    </span>
                    {logistics.is_cargo && (
                      <span className="rounded-full bg-amber-200 px-2 py-1 text-[8px] font-bold text-brand-amber shadow-sm">
                        HEAVY CARGO
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-theme-secondary">
                    {brand.name} • {params.thickness}" profile
                  </p>
                </div>
              </section>

              <section className="rounded-[2rem] border border-theme-border bg-theme-card p-4 md:p-6 shadow-theme-light">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-theme-secondary">
                  Quick summary
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-theme-secondary">Collection</span>
                    <span className="font-bold text-theme-primary">
                      {brand.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-theme-secondary">Size</span>
                    <span className="font-bold text-theme-primary">
                      {params.length}" x {params.breadth}"
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-theme-secondary">Thickness</span>
                    <span className="font-bold text-theme-primary">
                      {params.thickness}"
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      {/* Sticky Footer (CMO-Amber Action) */}
      <div className="fixed bottom-0 z-30 w-full border-t border-theme-border bg-theme-card/95 p-4 backdrop-blur-xl md:p-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-bold text-theme-secondary uppercase block mb-1">
              Estimated Total
            </span>
            <div className="flex items-baseline justify-center gap-2 sm:justify-start">
              <span className="text-3xl font-black text-theme-primary">
                {results
                  ? FinancialEngine.formatCurrency(results.final_price)
                  : "---"}
              </span>
              <span className="text-[9px] font-bold text-theme-secondary uppercase">
                {userRole === UserRole.DEALER ? "Excl. GST" : "All-Inclusive"}
              </span>
            </div>
          </div>
          <button
            disabled={!!validationError}
            onClick={handleAddToCartAction}
            className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-brand-amber px-8 py-4 text-sm font-black text-brand-navy transition-all hover:brightness-110 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-95 disabled:opacity-20 sm:w-auto md:px-12 md:py-5"
          >
            ADD TO CART
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Custom Size Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/70 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-theme-card rounded-[3rem] w-full max-w-sm p-6 md:p-12 shadow-theme-2xl shadow-indigo-500/20">
            <h3 className="text-2xl font-black text-theme-primary mb-2">
              Custom Build
            </h3>
            <p className="text-sm text-theme-secondary mb-8">
              Pricing is calculated dynamically based on square-inch surface
              area.
            </p>
            <div className="space-y-4 mb-10">
              <div>
                <label className="text-[10px] font-bold text-theme-secondary uppercase mb-2 block">
                  Length (Inch)
                </label>
                <input
                  type="number"
                  value={customInput.l}
                  onChange={(e) =>
                    setCustomInput({ ...customInput, l: e.target.value })
                  }
                  className="w-full bg-theme-input border border-theme-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:border-indigo-600 transition-colors shadow-theme-light"
                  placeholder="72.5"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-theme-secondary uppercase mb-2 block">
                  Breadth (Inch)
                </label>
                <input
                  type="number"
                  value={customInput.b}
                  onChange={(e) =>
                    setCustomInput({ ...customInput, b: e.target.value })
                  }
                  className="w-full bg-theme-input border border-theme-border rounded-2xl px-6 py-5 font-bold focus:outline-none focus:border-indigo-600 transition-colors shadow-theme-light"
                  placeholder="36.5"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCustomModalOpen(false)}
                className="flex-1 py-4 font-bold text-theme-secondary hover:text-theme-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomSize}
                className="flex-1 bg-brand-navy text-white rounded-2xl font-bold py-4 shadow-xl shadow-indigo-600/20"
              >
                Apply Specs
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartConfigurator;
