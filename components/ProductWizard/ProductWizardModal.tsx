import React from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import ProductCategoryPicker from "./ProductCategoryPicker";
import ProductQuestionnaire from "./ProductQuestionnaire";
import ProductWizardResults from "./ProductWizardResults";

const ProductWizardModal: React.FC = () => {
  const { isOpen, closeWizard, currentCategory, step, recommendations } =
    useProductWizard();

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
