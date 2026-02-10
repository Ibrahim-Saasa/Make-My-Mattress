import React from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";

const ProductWizardFloatingButton: React.FC = () => {
  const { isOpen, openWizard } = useProductWizard();

  if (isOpen) return null;

  return (
    <button
      onClick={openWizard}
      className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center justify-center z-40"
      title="Find Your Perfect Product"
      aria-label="Open product wizard"
    >
      <span className="text-2xl">🛏️</span>
    </button>
  );
};

export default ProductWizardFloatingButton;
