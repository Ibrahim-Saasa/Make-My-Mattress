import React, { useEffect, useState } from "react";
import { useProductWizard } from "../../contexts/ProductWizardContext";
import { QuizAnswer, ProductCategory } from "../../types";
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
  const { goBack, completeQuestionnaire } = useProductWizard();
  const questions = categoryQuestions[category] || [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const q = questions[index];
    if (!q) return;
    setSelected(answers[q.id] || null);
  }, [index, answers]);

  const current = questions[index];
  if (!current) return null;

  const total = questions.length;

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
    setSelected(optionId);
  };

  const handleNext = () => {
    if (!answers[current.id]) return;
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
    // TODO: call scoring service and get recommendations
    const payload = {
      product_category: category,
      answers: payloadAnswers,
    };
    await completeQuestionnaire(payload);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-slate-950/95 border border-slate-800 rounded-[2rem] shadow-[0_35px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white capitalize">
            {category} Questions
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Answer a few questions to get personalized recommendations
          </p>
        </div>
        <button
          onClick={goBack}
          className="text-slate-400 hover:text-white text-xl transition"
        >
          ✕
        </button>
      </div>

      <div className="border border-slate-700 rounded-[1.5rem] p-6 mb-6 bg-slate-900/90">
        <div className="mb-4 text-sm text-slate-400">
          Question {index + 1} of {total}
        </div>
        <div className="mb-6 font-semibold text-white text-lg">
          {current.text}
        </div>
        <div className="grid gap-3">
          {current.options.map((o: any) => (
            <button
              key={o.id}
              onClick={() => handleSelect(o.id)}
              className={`text-left p-4 border rounded-[1rem] transition ${
                selected === o.id
                  ? "border-indigo-400 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/20"
                  : "border-slate-700 bg-slate-800/90 text-slate-300 hover:border-indigo-400 hover:bg-indigo-500/10"
              }`}
              aria-pressed={selected === o.id}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={index === 0}
            className="px-4 py-2 rounded-[0.75rem] bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selected}
            className="px-6 py-2 bg-indigo-600 text-white rounded-[0.75rem] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            {index + 1 === total ? "Get Recommendations" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductQuestionnaire;
