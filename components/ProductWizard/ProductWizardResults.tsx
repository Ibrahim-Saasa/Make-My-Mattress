import React from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import { ProductRecommendation } from "../../types";

interface ProductWizardResultsProps {
  recommendations: ProductRecommendation[];
  category: string;
}

const ProductWizardResults: React.FC<ProductWizardResultsProps> = ({
  recommendations,
  category,
}) => {
  const { goBack, closeWizard } = useProductWizard();

  return (
    <div className="p-6 max-w-3xl mx-auto bg-slate-950/95 border border-slate-800 rounded-[2rem] shadow-[0_35px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">
            Recommended {category}s
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Based on your preferences, here are our top recommendations
          </p>
        </div>
        <button
          onClick={closeWizard}
          className="text-slate-400 hover:text-white text-xl transition"
        >
          ✕
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No products found for your preferences. Please try again.
        </div>
      ) : (
        <div className="grid gap-4 mb-8">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="border border-slate-700 rounded-[1.5rem] p-6 bg-slate-900/90 hover:border-indigo-400 transition shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{product.name}</h3>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    Match Score
                  </div>
                  <div className="text-3xl font-black text-indigo-400">
                    {Math.round(
                      (product.match_score || product.matchScore || 0) * 100,
                    )}
                    %
                  </div>
                </div>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-slate-400">
                  <span className="font-semibold text-indigo-300">Price:</span>{" "}
                  ${product.price || "N/A"}
                </div>
                <div className="text-sm text-slate-400">
                  <span className="font-semibold text-indigo-300">Rating:</span>{" "}
                  {product.rating ? `${product.rating}/5` : "N/A"}
                </div>
              </div>
              <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-[0.75rem] hover:bg-indigo-700 transition font-semibold">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={goBack}
          className="flex-1 px-6 py-3 border border-slate-700 rounded-[0.75rem] bg-slate-800/90 text-slate-300 hover:bg-slate-700 transition"
        >
          Back to Categories
        </button>
        <button
          onClick={closeWizard}
          className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-[0.75rem] hover:bg-indigo-700 transition font-semibold"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ProductWizardResults;
