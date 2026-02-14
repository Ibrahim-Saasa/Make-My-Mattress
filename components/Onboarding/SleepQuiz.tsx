import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../../src/data/quizQuestions.json";
import defaultCopy from "../../src/data/quizCopy.json";
import { QuizAnswer } from "../../types";
import { buildResultPayload } from "../../services/quizService";
import { useOnboarding } from "../../contexts/OnboardingContext";

interface SleepQuizProps {
  copyOverride?: any;
}

const SleepQuiz: React.FC<SleepQuizProps> = ({ copyOverride }) => {
  const copy = copyOverride || defaultCopy;
  const navigate = useNavigate();
  const { startQuiz, saveQuizResult } = useOnboarding();

  const qs = questions as any[];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    startQuiz && startQuiz();
  }, [startQuiz]);

  useEffect(() => {
    // set selected to any existing answer for current question
    const q = qs[index];
    if (!q) return;
    setSelected(answers[q.id] || null);
  }, [index, answers]);

  const current = qs[index];
  if (!current) return null;

  const total = qs.length;

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
    setSelected(optionId);
  };

  const handleNext = () => {
    if (!answers[current.id]) return; // prevent skipping
    if (index + 1 < total) setIndex(index + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleSubmit = async () => {
    const payloadAnswers: QuizAnswer[] = Object.entries(answers).map(
      ([question_id, answer_id]) => ({ question_id, answer_id }),
    );
    const payload = buildResultPayload(payloadAnswers, undefined, null);
    if (saveQuizResult) await saveQuizResult(payload);
    navigate("/onboarding/result", { state: { result: payload } });
  };

  return (
    <div
      className="p-6 max-w-2xl mx-auto"
      role="region"
      aria-labelledby="quiz-heading"
    >
      <h2 id="quiz-heading" className="text-2xl font-bold">
        {copy.splashCTA}
      </h2>
      <p className="mt-2 text-gray-600">{copy.intro}</p>

      <div className="mt-6 border rounded p-4">
        <div className="mb-4 text-sm text-theme-secondary">
          {copy.progressPrefix} {index + 1} / {total}
        </div>
        <div className="mb-2 font-semibold">{current.text}</div>
        <div className="grid gap-3">
          {current.options.map((o: any) => (
            <button
              key={o.id}
              onClick={() => handleSelect(o.id)}
              className={`text-left p-3 border rounded transition ${selected === o.id ? "border-indigo-600 bg-indigo-50" : "bg-white"}`}
              aria-pressed={selected === o.id}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={index === 0}
            className="px-3 py-2 rounded bg-gray-100"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {index + 1 === total ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">{copy.helper}</p>
    </div>
  );
};

export default SleepQuiz;
