import React from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import { FinancialEngine } from "../../services/financialEngine";

const ProductWizardWelcomeBack: React.FC = () => {
  const {
    customMattressBuild,
    reuseSavedRecommendation,
    startMattressQuiz,
    lookAround,
    isLoadingPreference,
  } = useProductWizard();

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(145deg,#08143A_0%,#13265A_55%,#07112F_100%)] p-6 text-white shadow-[0_35px_120px_rgba(3,9,30,0.45)] md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#1740D1]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-[#C8A55B]/15 blur-3xl" />

      <div className="relative">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#B9C6FF]">
          Welcome back
        </p>
        <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
          We remembered your custom comfort quote.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#D9E2FF]">
          Last time, you told us what kind of sleep feels right. We can bring
          back that custom mattress price, or rebuild it if your needs changed.
        </p>

        {isLoadingPreference ? (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-[#D9E2FF]">
            Finding your saved custom quote...
          </div>
        ) : customMattressBuild ? (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#C8A55B]">
              Your previous custom mattress
            </p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-black">
                  {customMattressBuild.name}
                </h3>
                <p className="mt-1 text-sm text-[#B9C6FF]">
                  {customMattressBuild.comfortType} comfort,{" "}
                  {customMattressBuild.params.length}" x{" "}
                  {customMattressBuild.params.breadth}" x{" "}
                  {customMattressBuild.params.thickness}"
                </p>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#07143B]">
                {FinancialEngine.formatCurrency(
                  customMattressBuild.pricing.final_price,
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-[#D9E2FF]">
            We could not find a saved quote, so let us build a fresh one.
          </div>
        )}

        <div className="mt-8 grid gap-3 md:grid-cols-[1.2fr_1fr_1fr]">
          <button
            onClick={reuseSavedRecommendation}
            className="rounded-[1.25rem] bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#07143B] transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-white/10"
          >
            Use My Quote
          </button>
          <button
            onClick={startMattressQuiz}
            className="rounded-[1.25rem] border border-white/15 bg-white/[0.08] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.14]"
          >
            Retake Quiz
          </button>
          <button
            onClick={lookAround}
            className="rounded-[1.25rem] border border-white/15 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#B9C6FF] transition hover:bg-white/[0.08]"
          >
            Look Around
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductWizardWelcomeBack;
