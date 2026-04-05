import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProductCategory, ProductRecommendation } from "../types";
import { preferenceService } from "../services/preferenceService";

interface ProductWizardState {
  isOpen: boolean;
  currentCategory?: ProductCategory;
  step: "category" | "questionnaire" | "results";
  recommendations: ProductRecommendation[];
  openWizard: () => void;
  closeWizard: () => void;
  selectCategory: (category: ProductCategory) => void;
  goBack: () => void;
  completeQuestionnaire: (payload: any) => Promise<void>;
}

const defaultState: ProductWizardState = {
  isOpen: false,
  step: "category",
  recommendations: [],
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
  const [recommendations, setRecommendations] = useState<
    ProductRecommendation[]
  >([]);

  const openWizard = () => setIsOpen(true);
  const closeWizard = () => {
    setIsOpen(false);
    setCurrentCategory(undefined);
    setStep("category");
    setRecommendations([]);
  };

  const selectCategory = (category: ProductCategory) => {
    setCurrentCategory(category);
    setStep("questionnaire");
    setRecommendations([]);
  };

  const goBack = () => {
    if (step === "questionnaire" || step === "results") {
      setCurrentCategory(undefined);
      setStep("category");
      setRecommendations([]);
    }
  };

  const completeQuestionnaire = async (payload: any) => {
    try {
      const recs = await preferenceService.getProductRecommendations(
        payload.answers,
      );
      setRecommendations(recs);
    } catch (error) {
      console.error("Error fetching wizard recommendations:", error);
      setRecommendations(
        preferenceService.getRandomRecommendations(payload.answers),
      );
    } finally {
      setStep("results");
    }
  };

  return (
    <ProductWizardContext.Provider
      value={{
        isOpen,
        currentCategory,
        step,
        recommendations,
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
