import { supabase } from "../src/integrations/supabase/client";
import { QuizAnswer, ProductCategory, ProductRecommendation } from "../types";
import { GoogleGenAI } from "@google/genai";

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

  /**
   * Generate AI-powered product recommendations based on quiz answers
   */
  async getProductRecommendations(
    answers: QuizAnswer[],
  ): Promise<ProductRecommendation[]> {
    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
      });

      // Convert answers to readable format
      const answersText = answers
        .map((answer) => `${answer.question_id}: ${answer.answer_id}`)
        .join(", ");

      const prompt = `
You are a sleep product recommendation expert. Based on the following user preferences from a sleep quiz, generate 3-5 personalized product recommendations.

User preferences: ${answersText}

Please return a JSON array of product recommendations with this exact structure:
[
  {
    "id": "unique_id",
    "name": "Product Name",
    "category": "mattress|pillow|bedsheet|accessories",
    "description": "Brief description explaining why it matches their preferences",
    "price": number (realistic price in USD),
    "rating": number (4.0-5.0),
    "match_score": number (0.7-1.0 indicating how well it matches)
  }
]

Make the recommendations specific and realistic. Focus on the category that seems most relevant based on the answers. If answers suggest mattress preferences, recommend mattresses. If they suggest pillow needs, recommend pillows, etc.

Return only the JSON array, no additional text.
`;

      const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
      const text = result.text || "[]";

      // Parse the JSON response
      const recommendations = JSON.parse(text.trim());

      // Validate and ensure proper structure
      return recommendations.map((rec: any, index: number) => ({
        id: rec.id || `rec_${index}`,
        name: rec.name || "Recommended Product",
        category: rec.category || "mattress",
        description: rec.description || "A great product for your sleep needs",
        price: rec.price || 299,
        rating: rec.rating || 4.5,
        match_score: rec.match_score || 0.8,
      }));
    } catch (error) {
      console.error("Error generating AI recommendations:", error);

      // Fallback to random recommendations if AI fails
      return this.getRandomRecommendations(answers);
    }
  },

  /**
   * Fallback method to generate random recommendations based on answers
   */
  getRandomRecommendations(answers: QuizAnswer[]): ProductRecommendation[] {
    // Extract category from answers or default to mattress
    const categoryAnswer = answers.find((a) =>
      a.question_id.includes("category"),
    );
    const category =
      (categoryAnswer?.answer_id as ProductCategory) || "mattress";

    const randomProducts = {
      mattress: [
        {
          id: "random_m1",
          name: "Premium Memory Foam Mattress",
          category: "mattress" as const,
          description:
            "High-quality memory foam with excellent contouring for personalized comfort",
          price: 899,
          rating: 4.7,
          match_score: 0.85,
        },
        {
          id: "random_m2",
          name: "Hybrid Support Mattress",
          category: "mattress" as const,
          description:
            "Combines memory foam and pocket springs for balanced support",
          price: 1299,
          rating: 4.8,
          match_score: 0.92,
        },
        {
          id: "random_m3",
          name: "Natural Latex Mattress",
          category: "mattress" as const,
          description:
            "Organic latex with natural cooling properties and excellent durability",
          price: 1599,
          rating: 4.6,
          match_score: 0.78,
        },
      ],
      pillow: [
        {
          id: "random_p1",
          name: "Contour Memory Foam Pillow",
          category: "pillow" as const,
          description:
            "Ergonomically designed to support neck and head alignment",
          price: 79,
          rating: 4.5,
          match_score: 0.88,
        },
        {
          id: "random_p2",
          name: "Cooling Gel Pillow",
          category: "pillow" as const,
          description: "Temperature-regulating gel for cool, comfortable sleep",
          price: 99,
          rating: 4.4,
          match_score: 0.82,
        },
      ],
      bedsheet: [
        {
          id: "random_b1",
          name: "Egyptian Cotton Sheets",
          category: "bedsheet" as const,
          description:
            "Luxuriously soft 600 thread count Egyptian cotton sheets",
          price: 199,
          rating: 4.9,
          match_score: 0.95,
        },
        {
          id: "random_b2",
          name: "Bamboo Cooling Sheets",
          category: "bedsheet" as const,
          description:
            "Naturally cooling bamboo fabric for temperature regulation",
          price: 149,
          rating: 4.6,
          match_score: 0.87,
        },
      ],
      accessories: [
        {
          id: "random_a1",
          name: "Mattress Topper",
          category: "accessories" as const,
          description:
            "Add extra comfort and support to your existing mattress",
          price: 249,
          rating: 4.5,
          match_score: 0.83,
        },
        {
          id: "random_a2",
          name: "Bed Frame Platform",
          category: "accessories" as const,
          description:
            "Modern platform bed frame with storage and sleek design",
          price: 599,
          rating: 4.7,
          match_score: 0.91,
        },
      ],
    };

    const products = randomProducts[category] || randomProducts.mattress;
    // Return 2-3 random products
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(3, shuffled.length));
  },
};

export const getProductRecommendations = (answers: QuizAnswer[]) =>
  preferenceService.getProductRecommendations(answers);
