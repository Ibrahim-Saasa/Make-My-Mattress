import { BRANDS } from "../constants";
import { supabase } from "../src/integrations/supabase/client";
import { calculateMattressPrice } from "./pricingEngine";
import {
  CustomMattressBuild,
  ProductCategory,
  ProductRecommendation,
  QuizAnswer,
  TagWeights,
  UserProductPreference,
  UserRole,
} from "../types";

const CORE_MATTRESS_TYPES = new Set([
  "Memory Foam",
  "Latex",
  "Spring",
  "Orthopedic",
]);

const TAG_ALIASES: Record<string, string[]> = {
  "memory foam": ["memory foam", "contouring", "pressure relief", "soft"],
  contouring: ["memory foam", "contouring", "pressure relief"],
  "pressure relief": ["memory foam", "contouring", "pressure relief", "soft"],
  soft: ["memory foam", "soft", "pressure relief"],
  latex: ["latex", "organic", "cooling", "breathable", "hypoallergenic"],
  cooling: ["latex", "cooling", "breathable"],
  breathable: ["latex", "cooling", "breathable"],
  organic: ["latex", "organic"],
  spring: ["spring", "pocket spring", "no disturbance", "bouncy", "durable"],
  "pocket spring": ["spring", "pocket spring", "no disturbance"],
  "no disturbance": ["spring", "pocket spring", "no disturbance"],
  durable: ["spring", "durable"],
  orthopedic: ["orthopedic", "back pain", "spinal alignment", "firm"],
  support: ["orthopedic", "spinal alignment", "firm", "durable"],
  firm: ["orthopedic", "firm", "spinal alignment"],
  "back pain": ["orthopedic", "back pain", "spinal alignment"],
  "spinal alignment": ["orthopedic", "spinal alignment"],
  medium: ["memory foam", "spring"],
  balanced: ["memory foam", "spring"],
  adaptability: ["memory foam", "spring"],
};

const SIZE_TO_PARAMS: Record<string, { length: number; breadth: number }> = {
  single: { length: 72, breadth: 36 },
  double: { length: 72, breadth: 48 },
  queen: { length: 78, breadth: 60 },
  king: { length: 78, breadth: 72 },
};

const normalizeTag = (tag: string) =>
  tag.toLowerCase().trim().replace(/_/g, " ").replace(/\s+/g, " ");

const getSizeParamsFromAnswers = (answers: QuizAnswer[]) => {
  const sizeAnswer = answers.find((answer) => SIZE_TO_PARAMS[answer.answer_id]);
  return SIZE_TO_PARAMS[sizeAnswer?.answer_id || "single"];
};

const buildWhy = (comfortType: string, tagScores: TagWeights): string[] => {
  const has = (tag: string) => (tagScores[normalizeTag(tag)] || 0) > 0;
  const reasons: string[] = [];

  if (comfortType === "Memory Foam" || has("pressure relief") || has("soft")) {
    reasons.push("Built for close contouring and pressure relief.");
  }

  if (comfortType === "Latex" || has("cooling") || has("breathable")) {
    reasons.push("Tuned for a cooler, more breathable sleep surface.");
  }

  if (comfortType === "Spring" || has("no disturbance") || has("durable")) {
    reasons.push("Balanced for airflow, bounce, and sturdy everyday support.");
  }

  if (comfortType === "Orthopedic" || has("firm") || has("support")) {
    reasons.push("Designed around firmer posture support and spinal alignment.");
  }

  if (
    has("size single") ||
    has("size double") ||
    has("size queen") ||
    has("size king")
  ) {
    reasons.push("Priced using the size you selected in the quiz.");
  }

  return Array.from(new Set(reasons)).slice(0, 3);
};

const scoreBrand = (brand: (typeof BRANDS)[number], tagScores: TagWeights) => {
  const brandTags = brand.ai_tags.map(normalizeTag);
  const brandType = normalizeTag(brand.type);
  let score = CORE_MATTRESS_TYPES.has(brand.type) ? 1 : 0;

  Object.entries(tagScores).forEach(([rawTag, weight]) => {
    const tag = normalizeTag(rawTag);
    const aliases = TAG_ALIASES[tag] || [tag];

    if (brandTags.includes(tag) || brandType === tag) {
      score += weight * 2.5;
    }

    aliases.forEach((alias) => {
      const normalizedAlias = normalizeTag(alias);
      if (brandTags.includes(normalizedAlias) || brandType === normalizedAlias) {
        score += weight;
      }
    });
  });

  return score;
};

const getScoredCoreMattresses = (tagScores: TagWeights) =>
  BRANDS.filter((brand) => CORE_MATTRESS_TYPES.has(brand.type))
    .map((brand) => ({ brand, rawScore: scoreBrand(brand, tagScores) }))
    .sort((a, b) => b.rawScore - a.rawScore);

const buildMattressRecommendations = (
  tagScores: TagWeights,
): ProductRecommendation[] => {
  const scored = getScoredCoreMattresses(tagScores);
  const topScore = Math.max(scored[0]?.rawScore || 1, 1);

  return scored.slice(0, 3).map(({ brand, rawScore }, index) => {
    const matchScore = Math.min(
      0.98,
      Math.max(0.72, 0.72 + (rawScore / topScore) * 0.24 - index * 0.02),
    );

    return {
      id: brand.id,
      product_id: brand.id,
      name: brand.name,
      category: "mattress",
      type: brand.type,
      match_score: matchScore,
      matchScore,
      description: `${brand.description} This match is based on the comfort cues you just shared with us.`,
      why: buildWhy(brand.type, tagScores),
    };
  });
};

const buildCustomMattressQuote = (
  answers: QuizAnswer[],
  tagScores: TagWeights,
): CustomMattressBuild => {
  const scored = getScoredCoreMattresses(tagScores);
  const topMatch = scored[0]?.brand || BRANDS[0];
  const topScore = Math.max(scored[0]?.rawScore || 1, 1);
  const size = getSizeParamsFromAnswers(answers);
  const params = {
    ...size,
    thickness: 6,
    materialRate: topMatch.baseRate,
    userType: UserRole.END_USER,
    demandLevel: "NORMAL" as const,
  };
  const pricing = calculateMattressPrice(params);
  const rawScore = scored[0]?.rawScore || 1;
  const matchScore = Math.min(
    0.98,
    Math.max(0.78, 0.78 + (rawScore / topScore) * 0.2),
  );

  return {
    id: "custom-comfort-mattress",
    name: "Your Custom Comfort Mattress",
    category: "mattress",
    comfortType: topMatch.type,
    materialRate: topMatch.baseRate,
    matchedBrandId: topMatch.id,
    matchScore,
    params,
    pricing,
    reasons: buildWhy(topMatch.type, tagScores),
    description:
      "A custom mattress quote shaped from your quiz answers and priced with the same live mattress pricing engine used across the app.",
    sourceAnswers: answers,
  };
};

export const preferenceService = {
  /**
   * Score product preference answers using the question tag-weight model.
   */
  async scoreProductAnswers(
    category: ProductCategory,
    answers: QuizAnswer[],
  ): Promise<TagWeights> {
    try {
      const questionsModule =
        category === "mattress"
          ? await import("../src/data/productQuestions/mattressQuestions.json")
          : category === "pillow"
            ? await import("../src/data/productQuestions/pillowQuestions.json")
            : category === "bedsheet"
              ? await import("../src/data/productQuestions/bedsheetQuestions.json")
              : await import("../src/data/productQuestions/accessoriesQuestions.json");

      const questions = questionsModule.default || questionsModule;
      const tagScores: TagWeights = {};

      answers.forEach(({ question_id, answer_id }) => {
        const question = questions.find((q: any) => q.id === question_id);
        if (!question) return;

        const option = question.options.find((o: any) => o.id === answer_id);
        if (!option || !option.weights) return;

        Object.entries(option.weights).forEach(([tag, weight]) => {
          const normalizedTag = normalizeTag(tag);
          tagScores[normalizedTag] =
            (tagScores[normalizedTag] || 0) + (weight as number);
        });
      });

      return tagScores;
    } catch (error) {
      console.error("Error scoring product answers:", error);
      throw error;
    }
  },

  buildCustomMattressQuote(
    category: ProductCategory,
    answers: QuizAnswer[],
    tagScores: TagWeights,
  ): CustomMattressBuild | null {
    if (category !== "mattress") return null;
    return buildCustomMattressQuote(answers, tagScores);
  },

  buildCustomMattressFromPreference(
    preference?: UserProductPreference | null,
  ): CustomMattressBuild | null {
    if (!preference || preference.product_category !== "mattress") return null;
    return buildCustomMattressQuote(
      preference.answers || [],
      preference.tag_scores || {},
    );
  },

  /**
   * Backwards-compatible brand recommendations for older callers/stories.
   */
  async getRecommendations(
    category: ProductCategory,
    tagScores: TagWeights,
  ): Promise<ProductRecommendation[]> {
    if (category !== "mattress") return [];
    return buildMattressRecommendations(tagScores);
  },

  buildRecommendationsFromPreference(
    preference?: UserProductPreference | null,
  ): ProductRecommendation[] {
    if (!preference || preference.product_category !== "mattress") return [];

    const recommendations = buildMattressRecommendations(
      preference.tag_scores || {},
    );
    const savedIds = preference.recommended_product_ids || [];

    if (savedIds.length === 0) return recommendations;

    return recommendations.sort((a, b) => {
      const aIndex = savedIds.indexOf(a.product_id || a.id);
      const bIndex = savedIds.indexOf(b.product_id || b.id);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });
  },

  /**
   * Save user product preference to database.
   */
  async savePreference(
    userId: string,
    category: ProductCategory,
    answers: QuizAnswer[],
    tagScores: TagWeights,
    recommendedProductIds: string[] = [],
  ): Promise<void> {
    try {
      const { error } = await supabase.from("user_product_preferences").insert([
        {
          user_id: userId,
          product_category: category,
          answers,
          tag_scores: tagScores,
          recommended_product_ids: recommendedProductIds,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving product preference:", error);
      throw error;
    }
  },

  /**
   * Get user's previous preferences.
   */
  async getUserPreferences(userId: string): Promise<UserProductPreference[]> {
    try {
      const { data, error } = await supabase
        .from("user_product_preferences")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as UserProductPreference[];
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      throw error;
    }
  },

  /**
   * Get all product categories and metadata.
   */
  async getProductCategories(): Promise<any[]> {
    return [
      {
        id: "mattress",
        name: "Mattress",
        emoji: "Bed",
        description: "Find your perfect mattress",
      },
      {
        id: "pillow",
        name: "Pillow",
        emoji: "Pillow",
        description: "Choose the right pillow",
      },
      {
        id: "bedsheet",
        name: "Bed Sheet",
        emoji: "Sheet",
        description: "Select your preferred sheets",
      },
      {
        id: "accessories",
        name: "Accessories",
        emoji: "Extras",
        description: "Enhance your sleep setup",
      },
    ];
  },

  /**
   * Backwards-compatible recommendation entry point.
   */
  async getProductRecommendations(
    answers: QuizAnswer[],
  ): Promise<ProductRecommendation[]> {
    const tagScores = await this.scoreProductAnswers("mattress", answers);
    return this.getRecommendations("mattress", tagScores);
  },

  /**
   * Backwards-compatible fallback now returns catalogue recommendations.
   */
  getRandomRecommendations(answers: QuizAnswer[]): ProductRecommendation[] {
    const tagScores: TagWeights = {};
    answers.forEach((answer) => {
      tagScores[normalizeTag(answer.answer_id)] =
        (tagScores[normalizeTag(answer.answer_id)] || 0) + 1;
    });

    return buildMattressRecommendations(tagScores);
  },
};

export const getProductRecommendations = (answers: QuizAnswer[]) =>
  preferenceService.getProductRecommendations(answers);
