import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProductCategory } from "../types";

interface ProductWizardState {
  isOpen: boolean;
  currentCategory?: ProductCategory;
  step: "category" | "questionnaire" | "results";
  openWizard: () => void;
  closeWizard: () => void;
  selectCategory: (category: ProductCategory) => void;
  goBack: () => void;
  completeQuestionnaire: (payload: any) => Promise<void>;
}

const defaultState: ProductWizardState = {
  isOpen: false,
  step: "category",
  openWizard: () => {},
  closeWizard: () => {},
  selectCategory: () => {},
  goBack: () => {},
  completeQuestionnaire: async () => {},
};

const ProductWizardContext = createContext<ProductWizardState>(defaultState);

export const ProductWizardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ProductCategory>();
  const [step, setStep] = useState<"category" | "questionnaire" | "results">(
    "category",
  );

  const openWizard = () => setIsOpen(true);
  const closeWizard = () => {
    setIsOpen(false);
    setCurrentCategory(undefined);
    setStep("category");
  };

  const selectCategory = (category: ProductCategory) => {
    setCurrentCategory(category);
    setStep("questionnaire");
  };

  const goBack = () => {
    if (step === "questionnaire") {
      setCurrentCategory(undefined);
      setStep("category");
    } else if (step === "results") {
      setCurrentCategory(undefined);
      setStep("category");
    }
  };

  const completeQuestionnaire = async (payload: any) => {
    // Persistence stub: wire to preferenceService later
    // eslint-disable-next-line no-console
    console.log("completeQuestionnaire", payload);
    setStep("results");
  };

  return (
    <ProductWizardContext.Provider
      value={{
        isOpen,
        currentCategory,
        step,
        openWizard,
        closeWizard,
        selectCategory,
        goBack,
        completeQuestionnaire,
      }}
    >
      {children}
    </ProductWizardContext.Provider>
  );
};

export const useProductWizard = () => useContext(ProductWizardContext);
