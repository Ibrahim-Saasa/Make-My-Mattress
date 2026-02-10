import React from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import { ProductCategory } from "../../types";

const CATEGORIES: Array<{ id: ProductCategory; label: string; emoji: string }> =
  [
    { id: "mattress", label: "Mattress", emoji: "🛏️" },
    { id: "pillow", label: "Pillow", emoji: "🪑" },
    { id: "bedsheet", label: "Bedsheet", emoji: "🧵" },
    { id: "accessories", label: "Accessories", emoji: "✨" },
  ];

const ProductCategoryPicker: React.FC = () => {
  const { selectCategory, closeWizard } = useProductWizard();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">What do you need?</h2>
        <button
          onClick={closeWizard}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <p className="text-gray-600 mb-8">
        Select a product category to get personalized recommendations
      </p>

      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => selectCategory(cat.id)}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-center"
          >
            <div className="text-4xl mb-2">{cat.emoji}</div>
            <div className="font-semibold text-gray-800">{cat.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductCategoryPicker;
