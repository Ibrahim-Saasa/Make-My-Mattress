import React from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import { ProductCategory } from "../../types";

const CATEGORIES: Array<{ id: ProductCategory; label: string; emoji: string }> =
  [
    { id: "mattress", label: "Mattress", emoji: "🛏️" },
    { id: "pillow", label: "Pillow", emoji: "🛌" },
    { id: "bedsheet", label: "Bedsheet", emoji: "🧵" },
    { id: "accessories", label: "Accessories", emoji: "✨" },
  ];

const ProductCategoryPicker: React.FC = () => {
  const { selectCategory, closeWizard } = useProductWizard();

  return (
    <div className="p-6 max-w-2xl mx-auto bg-slate-950/95 border border-slate-800 rounded-[2rem] shadow-[0_35px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">What do you need?</h2>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Select a product category to get personalized recommendations
          </p>
        </div>
        <button
          onClick={closeWizard}
          className="text-slate-400 hover:text-white text-xl transition"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => selectCategory(cat.id)}
            className="group p-6 rounded-[1.75rem] border border-slate-700 bg-slate-900/90 text-center transition hover:border-indigo-400 hover:bg-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <div className="text-5xl mb-4">{cat.emoji}</div>
            <div className="font-semibold text-white">{cat.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductCategoryPicker;
