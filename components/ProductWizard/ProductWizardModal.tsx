import React, { useState, useEffect } from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import ProductCategoryPicker from "./ProductCategoryPicker";
import ProductQuestionnaire from "./ProductQuestionnaire";
import ProductWizardResults from "./ProductWizardResults";
import { ProductRecommendation } from "../../types";

const ProductWizardModal: React.FC = () => {
  const { isOpen, closeWizard, currentCategory, step } = useProductWizard();
  const [recommendations, setRecommendations] = useState<
    ProductRecommendation[]
  >([]);

  // Mock product data - replace with API call in preferenceService
  const getMockRecommendations = (
    category: string,
  ): ProductRecommendation[] => {
    const mockData: Record<string, ProductRecommendation[]> = {
      mattress: [
        {
          id: "m1",
          name: "Cloud Comfort Mattress",
          description: "Perfect for side sleepers who prefer a softer feel",
          price: 899,
          rating: 4.8,
          match_score: 0.95,
          category: "mattress" as const,
        },
        {
          id: "m2",
          name: "Supreme Support Mattress",
          description: "Ideal for back sleepers wanting firm support",
          price: 1299,
          rating: 4.7,
          match_score: 0.88,
          category: "mattress" as const,
        },
      ],
      pillow: [
        {
          id: "p1",
          name: "Memory Foam Pillow",
          description: "Contours to your head shape",
          price: 79,
          rating: 4.6,
          match_score: 0.92,
          category: "pillow" as const,
        },
      ],
      bedsheet: [
        {
          id: "b1",
          name: "Egyptian Cotton Sheets",
          description: "600 thread count luxury comfort",
          price: 199,
          rating: 4.9,
          match_score: 0.97,
          category: "bedsheet" as const,
        },
      ],
      accessories: [
        {
          id: "a1",
          name: "Cooling Mattress Topper",
          description: "Temperature regulation layer",
          price: 249,
          rating: 4.5,
          match_score: 0.85,
          category: "accessories" as const,
        },
      ],
    };
    return mockData[category] || [];
  };

  const handleQuestionnaireComplete = (payload: any) => {
    // TODO: call preferenceService to score and get actual recommendations
    const recs = getMockRecommendations(payload.product_category);
    setRecommendations(recs);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {step === "category" && <ProductCategoryPicker />}
        {step === "questionnaire" && currentCategory && (
          <ProductQuestionnaire category={currentCategory} />
        )}
        {step === "results" && currentCategory && (
          <ProductWizardResults
            recommendations={recommendations}
            category={currentCategory}
          />
        )}
      </div>
    </div>
  );
};

export default ProductWizardModal;
