import { supabase } from "../src/integrations/supabase/client";
import { QuizAnswer, ProductCategory, ProductRecommendation } from "../types";

export const preferenceService = {
  /**
   * Score product preference answers using tag-weight model
   */
  async scoreProductAnswers(
    category: ProductCategory,
    answers: QuizAnswer[],
  ): Promise<Record<string, number>> {
    try {
      // Load questions for this category
      const questionsModule =
        category === "mattress"
          ? await import("../src/data/productQuestions/mattressQuestions.json")
          : category === "pillow"
            ? await import("../src/data/productQuestions/pillowQuestions.json")
            : category === "bedsheet"
              ? await import("../src/data/productQuestions/bedsheetQuestions.json")
              : await import("../src/data/productQuestions/accessoriesQuestions.json");

      const questions = questionsModule.default || questionsModule;
      const tagScores: Record<string, number> = {};

      answers.forEach(({ question_id, answer_id }) => {
        const question = questions.find((q: any) => q.id === question_id);
        if (!question) return;

        const option = question.options.find((o: any) => o.id === answer_id);
        if (!option || !option.weights) return;

        Object.entries(option.weights).forEach(([tag, weight]) => {
          tagScores[tag] = (tagScores[tag] || 0) + (weight as number);
        });
      });

      return tagScores;
    } catch (error) {
      console.error("Error scoring product answers:", error);
      throw error;
    }
  },

  /**
   * Get product recommendations based on tag scores
   * TODO: Implement actual product matching from products table
   */
  async getRecommendations(
    category: ProductCategory,
    tagScores: Record<string, number>,
  ): Promise<ProductRecommendation[]> {
    try {
      // TODO: Fetch from products table, match by category and tag scores
      // For now, return mock data
      return [];
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error;
    }
  },

  /**
   * Save user product preference to database
   */
  async savePreference(
    userId: string,
    category: ProductCategory,
    answers: QuizAnswer[],
    tagScores: Record<string, number>,
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
   * Get user's previous preferences
   */
  async getUserPreferences(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("user_product_preferences")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      throw error;
    }
  },

  /**
   * Get all product categories and metadata
   */
  async getProductCategories(): Promise<any[]> {
    const categories = [
      {
        id: "mattress",
        name: "Mattress",
        emoji: "🛏️",
        description: "Find your perfect mattress",
      },
      {
        id: "pillow",
        name: "Pillow",
        emoji: "🛌",
        description: "Choose the right pillow",
      },
      {
        id: "bedsheet",
        name: "Bed Sheet",
        emoji: "📄",
        description: "Select your preferred sheets",
      },
      {
        id: "accessories",
        name: "Accessories",
        emoji: "✨",
        description: "Enhance your sleep setup",
      },
    ];
    return categories;
  },
};
