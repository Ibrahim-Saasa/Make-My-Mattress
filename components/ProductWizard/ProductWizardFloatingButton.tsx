import React from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";

const ProductWizardFloatingButton: React.FC = () => {
  const { isOpen, openWizard } = useProductWizard();

  if (isOpen) return null;

  return (
    <button
      onClick={openWizard}
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-[linear-gradient(145deg,#1740D1,#07143B)] text-white shadow-2xl shadow-[#1740D1]/30 transition hover:-translate-y-1 hover:shadow-[#1740D1]/40"
      title="Find your mattress match"
      aria-label="Open mattress match quiz"
    >
      <span className="text-[10px] font-black uppercase leading-tight tracking-[0.14em]">
        Match
      </span>
    </button>
  );
};

export default ProductWizardFloatingButton;
