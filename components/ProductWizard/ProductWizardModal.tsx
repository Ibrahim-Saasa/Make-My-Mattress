import React from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import ProductCategoryPicker from "./ProductCategoryPicker";
import ProductQuestionnaire from "./ProductQuestionnaire";
import ProductWizardResults from "./ProductWizardResults";
import ProductWizardWelcomeBack from "./ProductWizardWelcomeBack";

const ProductWizardModal: React.FC = () => {
  const { isOpen, currentCategory, step, customMattressBuild } =
    useProductWizard();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#020817]/80 p-4 backdrop-blur-xl">
      <div className="w-full max-w-4xl">
        {step === "welcomeBack" && <ProductWizardWelcomeBack />}
        {step === "category" && <ProductCategoryPicker />}
        {step === "questionnaire" && currentCategory && (
          <ProductQuestionnaire category={currentCategory} />
        )}
        {step === "results" && currentCategory && (
          <ProductWizardResults customMattressBuild={customMattressBuild} />
        )}
      </div>
    </div>
  );
};

export default ProductWizardModal;
