import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  CustomMattressBuild,
  ProductCategory,
  QuizAnswer,
  UserProductPreference,
} from "../types";
import { preferenceService } from "../services/preferenceService";

type ProductWizardStep =
  | "category"
  | "questionnaire"
  | "results"
  | "welcomeBack";

interface ProductWizardState {
  isOpen: boolean;
  currentCategory?: ProductCategory;
  step: ProductWizardStep;
  customMattressBuild: CustomMattressBuild | null;
  savedPreference?: UserProductPreference | null;
  isLoadingPreference: boolean;
  openWizard: () => void;
  closeWizard: () => void;
  selectCategory: (category: ProductCategory) => void;
  startMattressQuiz: () => void;
  reuseSavedRecommendation: () => void;
  buyCustomMattress: () => void;
  lookAround: () => void;
  goBack: () => void;
  completeQuestionnaire: (payload: {
    product_category: ProductCategory;
    answers: QuizAnswer[];
  }) => Promise<void>;
}

interface ProductWizardProviderProps {
  children: ReactNode;
  userId?: string;
  autoPrompt?: boolean;
  onCustomMattressBuyNow?: (build: CustomMattressBuild) => void;
  onLookAround?: () => void;
}

const MATTRESS_PROMPT_STORAGE_PREFIX = "mmm:mattressQuizPrompted";

const defaultState: ProductWizardState = {
  isOpen: false,
  step: "questionnaire",
  customMattressBuild: null,
  savedPreference: null,
  isLoadingPreference: false,
  openWizard: () => {},
  closeWizard: () => {},
  selectCategory: () => {},
  startMattressQuiz: () => {},
  reuseSavedRecommendation: () => {},
  buyCustomMattress: () => {},
  lookAround: () => {},
  goBack: () => {},
  completeQuestionnaire: async () => {},
};

const ProductWizardContext = createContext<ProductWizardState>(defaultState);

export const ProductWizardProvider: React.FC<ProductWizardProviderProps> = ({
  children,
  userId,
  autoPrompt = false,
  onCustomMattressBuyNow,
  onLookAround,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<ProductCategory>("mattress");
  const [step, setStep] = useState<ProductWizardStep>("questionnaire");
  const [customMattressBuild, setCustomMattressBuild] =
    useState<CustomMattressBuild | null>(null);
  const [savedPreference, setSavedPreference] =
    useState<UserProductPreference | null>(null);
  const [isLoadingPreference, setIsLoadingPreference] = useState(false);

  const startMattressQuiz = useCallback(() => {
    setCurrentCategory("mattress");
    setStep("questionnaire");
    setCustomMattressBuild(null);
    setIsOpen(true);
  }, []);

  const showSavedPreference = useCallback(
    (preference: UserProductPreference) => {
      const savedBuild =
        preferenceService.buildCustomMattressFromPreference(preference);
      setSavedPreference(preference);
      setCustomMattressBuild(savedBuild);
      setCurrentCategory("mattress");
      setStep("welcomeBack");
    },
    [],
  );

  const openWizard = useCallback(() => {
    setIsOpen(true);
    if (savedPreference) {
      showSavedPreference(savedPreference);
      return;
    }
    startMattressQuiz();
  }, [savedPreference, showSavedPreference, startMattressQuiz]);

  const closeWizard = useCallback(() => {
    setIsOpen(false);
  }, []);

  const lookAround = useCallback(() => {
    setIsOpen(false);
    onLookAround?.();
  }, [onLookAround]);

  const selectCategory = useCallback((category: ProductCategory) => {
    setCurrentCategory(category);
    setStep("questionnaire");
    setCustomMattressBuild(null);
  }, []);

  const goBack = useCallback(() => {
    if (step === "results") {
      startMattressQuiz();
      return;
    }

    if (step === "questionnaire" && savedPreference) {
      showSavedPreference(savedPreference);
      return;
    }

    lookAround();
  }, [lookAround, savedPreference, showSavedPreference, startMattressQuiz, step]);

  const reuseSavedRecommendation = useCallback(() => {
    if (!savedPreference) {
      startMattressQuiz();
      return;
    }

    const savedBuild =
      preferenceService.buildCustomMattressFromPreference(savedPreference);
    setCustomMattressBuild(savedBuild);
    setCurrentCategory("mattress");
    setStep("results");
  }, [savedPreference, startMattressQuiz]);

  const buyCustomMattress = useCallback(() => {
    if (!customMattressBuild) return;
    onCustomMattressBuyNow?.(customMattressBuild);
    setIsOpen(false);
  }, [customMattressBuild, onCustomMattressBuyNow]);

  const completeQuestionnaire = useCallback(
    async (payload: {
      product_category: ProductCategory;
      answers: QuizAnswer[];
    }) => {
      const category = payload.product_category || "mattress";

      try {
        const tagScores = await preferenceService.scoreProductAnswers(
          category,
          payload.answers,
        );
        const build = preferenceService.buildCustomMattressQuote(
          category,
          payload.answers,
          tagScores,
        );
        const recommendedIds = build?.matchedBrandId
          ? [build.matchedBrandId]
          : [];

        setCurrentCategory(category);
        setCustomMattressBuild(build);
        setSavedPreference({
          user_id: userId || "",
          product_category: category,
          answers: payload.answers,
          tag_scores: tagScores,
          recommended_product_ids: recommendedIds,
          created_at: new Date().toISOString(),
        });

        if (userId) {
          try {
            await preferenceService.savePreference(
              userId,
              category,
              payload.answers,
              tagScores,
              recommendedIds,
            );
          } catch (error) {
            console.warn("Preference save failed; continuing with results.", error);
          }
        }
      } catch (error) {
        console.error("Error building custom mattress quote:", error);
        const fallbackBuild = preferenceService.buildCustomMattressQuote(
          "mattress",
          payload.answers,
          {},
        );
        setCustomMattressBuild(fallbackBuild);
      } finally {
        setStep("results");
      }
    },
    [userId],
  );

  useEffect(() => {
    if (!autoPrompt || !userId) return;

    const promptKey = `${MATTRESS_PROMPT_STORAGE_PREFIX}:${userId}`;
    if (sessionStorage.getItem(promptKey)) return;

    let isMounted = true;

    const loadPreferenceAndOpen = async () => {
      setIsLoadingPreference(true);

      try {
        const preferences = await preferenceService.getUserPreferences(userId);
        if (!isMounted) return;

        const latestMattressPreference = preferences.find(
          (preference) => preference.product_category === "mattress",
        );

        sessionStorage.setItem(promptKey, "true");

        if (latestMattressPreference) {
          showSavedPreference(latestMattressPreference);
          setIsOpen(true);
        } else {
          setSavedPreference(null);
          startMattressQuiz();
        }
      } catch (error) {
        console.warn("Could not load saved mattress quiz preference.", error);
        if (!isMounted) return;
        sessionStorage.setItem(promptKey, "true");
        startMattressQuiz();
      } finally {
        if (isMounted) setIsLoadingPreference(false);
      }
    };

    loadPreferenceAndOpen();

    return () => {
      isMounted = false;
    };
  }, [autoPrompt, showSavedPreference, startMattressQuiz, userId]);

  return (
    <ProductWizardContext.Provider
      value={{
        isOpen,
        currentCategory,
        step,
        customMattressBuild,
        savedPreference,
        isLoadingPreference,
        openWizard,
        closeWizard,
        selectCategory,
        startMattressQuiz,
        reuseSavedRecommendation,
        buyCustomMattress,
        lookAround,
        goBack,
        completeQuestionnaire,
      }}
    >
      {children}
    </ProductWizardContext.Provider>
  );
};

export const useProductWizard = () => useContext(ProductWizardContext);
