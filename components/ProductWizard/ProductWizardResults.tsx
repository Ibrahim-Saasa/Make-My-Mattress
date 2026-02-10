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
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recommended {category}s</h2>
        <button
          onClick={closeWizard}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No products found for your preferences. Please try again.
        </div>
      ) : (
        <div className="grid gap-4 mb-6">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Match Score</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.round(
                      (product.match_score || product.matchScore || 0) * 100,
                    )}
                    %
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{product.description}</p>
              <div className="text-sm text-gray-600 mb-4">
                <strong>Price:</strong> ${product.price || "N/A"} |{" "}
                <strong>Rating:</strong>{" "}
                {product.rating ? `${product.rating}/5` : "N/A"}
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={goBack}
          className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Back to Categories
        </button>
        <button
          onClick={closeWizard}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ProductWizardResults;
