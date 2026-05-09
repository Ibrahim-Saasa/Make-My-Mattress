import React, { useEffect, useState } from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import { ProductCategory, QuizAnswer } from "../../types";
import mattressQuestions from "../../src/data/productQuestions/mattressQuestions.json";
import pillowQuestions from "../../src/data/productQuestions/pillowQuestions.json";
import bedsheetQuestions from "../../src/data/productQuestions/bedsheetQuestions.json";
import accessoriesQuestions from "../../src/data/productQuestions/accessoriesQuestions.json";

const categoryQuestions: Record<ProductCategory, any[]> = {
  mattress: mattressQuestions as any[],
  pillow: pillowQuestions as any[],
  bedsheet: bedsheetQuestions as any[],
  accessories: accessoriesQuestions as any[],
};

interface ProductQuestionnaireProps {
  category: ProductCategory;
}

const ProductQuestionnaire: React.FC<ProductQuestionnaireProps> = ({
  category,
}) => {
  const { lookAround, completeQuestionnaire } = useProductWizard();
  const questions = categoryQuestions[category] || [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIndex(0);
    setAnswers({});
    setSelected(null);
    setIsSubmitting(false);
  }, [category]);

  useEffect(() => {
    const q = questions[index];
    if (!q) return;
    setSelected(answers[q.id] || null);
  }, [index, answers, questions]);

  const current = questions[index];
  if (!current) return null;

  const total = questions.length;
  const progress = Math.round(((index + 1) / total) * 100);

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
    setSelected(optionId);
  };

  const buildPayloadAnswers = (
    answerSource: Record<string, string>,
  ): QuizAnswer[] =>
    questions
      .map((question) => {
        const answerId = answerSource[question.id];
        if (!answerId) return null;
        return { question_id: question.id, answer_id: answerId };
      })
      .filter(Boolean) as QuizAnswer[];

  const handleSubmit = async (answerSource: Record<string, string>) => {
    setIsSubmitting(true);
    await completeQuestionnaire({
      product_category: category,
      answers: buildPayloadAnswers(answerSource),
    });
    setIsSubmitting(false);
  };

  const handleNext = async () => {
    const selectedAnswer = selected || answers[current.id];
    if (!selectedAnswer || isSubmitting) return;

    const nextAnswers = { ...answers, [current.id]: selectedAnswer };
    setAnswers(nextAnswers);

    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }

    await handleSubmit(nextAnswers);
  };

  const handleBack = () => {
    if (index > 0 && !isSubmitting) setIndex(index - 1);
  };

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(145deg,#061238_0%,#12255A_52%,#07112F_100%)] p-5 text-white shadow-[0_35px_120px_rgba(3,9,30,0.45)] md:p-8">
      <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-[#1740D1]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-4 h-48 w-48 rounded-full bg-[#C8A55B]/[0.14] blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#B9C6FF]">
              Sleep match studio
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              Let us find the mattress that feels made for you.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#D9E2FF]">
              A few quick comfort cues help our family recommend the right
              mattress before you spend time comparing everything.
            </p>
          </div>
          <button
            onClick={lookAround}
            className="rounded-full border border-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#B9C6FF] transition hover:bg-white/[0.08]"
          >
            Look Around
          </button>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 md:p-6">
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#B9C6FF]">
              <span>
                Question {index + 1} of {total}
              </span>
              <span>{progress}% matched</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#C8A55B_0%,#FFFFFF_48%,#1740D1_100%)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h3 className="mb-5 text-xl font-black leading-snug md:text-2xl">
            {current.text}
          </h3>

          <div className="grid gap-3 md:grid-cols-2">
            {current.options.map((option: any) => {
              const [title, detail] = String(option.label).split(" - ");
              const isSelected = selected === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`group min-h-[112px] rounded-[1.35rem] border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-[#C8A55B] bg-white text-[#07143B] shadow-2xl shadow-[#C8A55B]/10"
                      : "border-white/10 bg-[#0C1A48]/80 text-white hover:-translate-y-0.5 hover:border-[#B9C6FF]/60 hover:bg-white/[0.09]"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                      isSelected ? "text-[#1740D1]" : "text-[#B9C6FF]"
                    }`}
                  >
                    {isSelected ? "Selected" : "Comfort cue"}
                  </span>
                  <span className="mt-3 block text-lg font-black">
                    {title}
                  </span>
                  {detail && (
                    <span
                      className={`mt-2 block text-sm leading-6 ${
                        isSelected ? "text-[#263866]" : "text-[#D9E2FF]"
                      }`}
                    >
                      {detail}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleBack}
              disabled={index === 0 || isSubmitting}
              className="rounded-[1.2rem] border border-white/15 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#B9C6FF] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selected || isSubmitting}
              className="rounded-[1.2rem] bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#07143B] transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Building Your Match"
                : index + 1 === total
                  ? "Reveal My Match"
                  : "Next Comfort Cue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuestionnaire;
