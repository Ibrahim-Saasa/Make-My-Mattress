import questions from "../data/quizQuestions.json";
import { QuizAnswer, TagWeights } from "../types";
import { supabase } from "../src/integrations/supabase/client";

export function scoreAnswers(answers: QuizAnswer[]): TagWeights {
  const scores: TagWeights = {};
  for (const a of answers) {
    const q = (questions as any[]).find((qq) => qq.id === a.question_id);
    if (!q) continue;
    const opt = q.options.find((o: any) => o.id === a.answer_id);
    if (!opt) continue;
    for (const [tag, val] of Object.entries(opt.weights)) {
      scores[tag] = (scores[tag] || 0) + (val as number);
    }
  }
  return scores;
}

export function normalizeScores(
  scores: TagWeights,
): { tag: string; score: number }[] {
  const total = Object.values(scores).reduce((s, v) => s + v, 0) || 1;
  return Object.entries(scores)
    .map(([tag, val]) => ({ tag, score: (val / total) * 100 }))
    .sort((a, b) => b.score - a.score);
}

const TAG_PRIORITY = [
  "support",
  "pressure_relief",
  "cooling",
  "motion_isolation",
  "durability",
  "value",
  "premium",
  "firm",
  "medium",
  "soft",
];

export function recommendFromScores(scores: TagWeights) {
  const normalized = normalizeScores(scores);
  const top = normalized[0];
  const second = normalized[1];

  // Simple threshold rule
  if (top.score >= 40) {
    return mapTagToRecommendation(top.tag);
  }

  // Tie-breaker within 10%
  if (second && top.score - second.score <= 10) {
    // choose higher priority tag
    for (const p of TAG_PRIORITY) {
      const found = normalized.find((n) => n.tag === p);
      if (found && (found.tag === top.tag || found.tag === second.tag)) {
        return mapTagToRecommendation(found.tag);
      }
    }
  }

  // Fallback
  return {
    type: "Balanced / Hybrid",
    models: ["Standard Hybrid", "Pocket Spring Medium"],
  };
}

export function mapTagToRecommendation(tag: string) {
  const mapping: Record<string, { type: string; models: string[] }> = {
    firm: {
      type: "Firm Hybrid / Innerspring",
      models: ["Firm Classic", "Innerspring Pro"],
    },
    medium: {
      type: "Medium-Firm Hybrid",
      models: ["Allrounder Medium", "Pocket Medium"],
    },
    soft: { type: "Memory Foam Plush", models: ["Cloud Plush", "Pillow Top"] },
    pressure_relief: {
      type: "Zoned Memory Foam",
      models: ["Zoned Relief", "Contour Plus"],
    },
    cooling: {
      type: "Latex / Cooling Hybrid",
      models: ["Cool Latex", "Hybrid Breeze"],
    },
    motion_isolation: {
      type: "Memory Foam / Isolated",
      models: ["Silent Sleep", "MotionGuard"],
    },
    support: {
      type: "Supportive Hybrid",
      models: ["SpineAlign", "SupportPro"],
    },
    durability: {
      type: "Durable Build",
      models: ["Endurance", "Lifetime Plus"],
    },
    value: { type: "Value Pick", models: ["Budget Friendly", "Value Comfort"] },
    premium: { type: "Luxury Line", models: ["Opulence", "Signature"] },
  };

  return (
    mapping[tag] || { type: "Balanced / Hybrid", models: ["Standard Hybrid"] }
  );
}

export function buildResultPayload(
  answers: QuizAnswer[],
  userId?: string | null,
  anonId?: string | null,
) {
  const scores = scoreAnswers(answers);
  const rec = recommendFromScores(scores);
  const sorted = normalizeScores(scores).map((s) => s.tag);
  const payload = {
    user_id: userId || null,
    anonymous_session_id: anonId || null,
    answers,
    tag_scores: scores,
    top_tags: sorted.slice(0, 3),
    recommended_type: rec.type,
    recommended_models: rec.models,
    source: "web",
  };

  return payload;
}

// Persist quiz result to Supabase
export async function saveResultToSupabase(payload: any) {
  try {
    const { data, error } = await supabase
      .from("sleep_quiz_results")
      .insert([payload])
      .select()
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("saveResultToSupabase error:", error);
      throw error;
    }

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("saveResultToSupabase unexpected error:", err);
    throw err;
  }
}
