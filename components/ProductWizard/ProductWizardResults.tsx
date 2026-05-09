import React from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import { FinancialEngine } from "../../services/financialEngine";
import { CustomMattressBuild } from "../../types";

interface ProductWizardResultsProps {
  customMattressBuild: CustomMattressBuild | null;
}

const ProductWizardResults: React.FC<ProductWizardResultsProps> = ({
  customMattressBuild,
}) => {
  const { buyCustomMattress, startMattressQuiz, lookAround } =
    useProductWizard();

  if (!customMattressBuild) {
    return (
      <div className="rounded-[2.25rem] border border-white/10 bg-[#07112F] p-8 text-center text-white shadow-[0_35px_120px_rgba(3,9,30,0.45)]">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#B9C6FF]">
          Sleep match studio
        </p>
        <h2 className="mt-4 text-3xl font-black">Let us try that again.</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#D9E2FF]">
          We could not build a clear custom quote from those answers. A quick
          retake should get us there.
        </p>
        <button
          onClick={startMattressQuiz}
          className="mt-8 rounded-[1.25rem] bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#07143B]"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const { params, pricing } = customMattressBuild;
  const sizeLabel = `${params.length}" x ${params.breadth}" x ${params.thickness}"`;

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(145deg,#07112F_0%,#12255A_52%,#061238_100%)] p-5 text-white shadow-[0_35px_120px_rgba(3,9,30,0.45)] md:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#1740D1]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-[#C8A55B]/[0.16] blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#B9C6FF]">
              Your custom mattress quote
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
              {customMattressBuild.name}
            </h2>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-[#C8A55B]">
              {customMattressBuild.comfortType} comfort direction
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white px-5 py-4 text-[#07143B]">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1740D1]">
              Final price
            </p>
            <p className="mt-1 text-3xl font-black">
              {FinancialEngine.formatCurrency(pricing.final_price)}
            </p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#42527E]">
              Price includes taxes
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-base leading-8 text-[#D9E2FF]">
          {customMattressBuild.description}
        </p>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B9C6FF]">
              Size
            </p>
            <p className="mt-2 text-xl font-black text-white">{sizeLabel}</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B9C6FF]">
              Comfort
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {customMattressBuild.comfortType}
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B9C6FF]">
              Match
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {Math.round(customMattressBuild.matchScore * 100)}%
            </p>
          </div>
        </div>

        {customMattressBuild.reasons.length > 0 && (
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#C8A55B]">
              Why this custom build fits
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {customMattressBuild.reasons.map((reason) => (
                <p
                  key={reason}
                  className="rounded-[1rem] bg-[#07143B]/60 p-4 text-sm leading-6 text-[#EEF3FF]"
                >
                  {reason}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-3 md:grid-cols-[1.15fr_1fr]">
          <button
            onClick={buyCustomMattress}
            className="rounded-[1.35rem] bg-white px-6 py-5 text-sm font-black uppercase tracking-[0.2em] text-[#07143B] transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-white/10"
          >
            Buy Now
          </button>
          <button
            onClick={lookAround}
            className="rounded-[1.35rem] border border-white/15 px-6 py-5 text-sm font-black uppercase tracking-[0.2em] text-[#B9C6FF] transition hover:bg-white/[0.08]"
          >
            Look Around
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={startMattressQuiz}
            className="text-xs font-black uppercase tracking-[0.2em] text-[#B9C6FF] underline-offset-4 transition hover:text-white hover:underline"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductWizardResults;
