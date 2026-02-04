import {
  scoreAnswers,
  recommendFromScores,
  buildResultPayload,
} from "../../services/quizService";

describe("quiz scoring", () => {
  it("scores simple answers and recommends", () => {
    const answers = [
      { question_id: "q1", answer_id: "side" },
      { question_id: "q2", answer_id: "soft" },
      { question_id: "q3", answer_id: "average" },
      { question_id: "q4", answer_id: "hot" },
      { question_id: "q5", answer_id: "none" },
      { question_id: "q6", answer_id: "no" },
      { question_id: "q7", answer_id: "some" },
      { question_id: "q8", answer_id: "standard" },
    ];

    const scores = scoreAnswers(answers);
    expect(scores).toBeDefined();
    expect(scores["pressure_relief"]).toBeGreaterThan(0);

    const rec = recommendFromScores(scores);
    expect(rec.type).toBeDefined();

    const payload = buildResultPayload(answers, "user-1", null);
    expect(payload.recommended_type).toBeDefined();
    expect(payload.top_tags.length).toBeGreaterThan(0);
  });
});
