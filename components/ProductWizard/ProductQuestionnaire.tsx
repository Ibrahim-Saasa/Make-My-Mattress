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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold capitalize">{category} Questions</h2>
        <button
          onClick={goBack}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="border rounded p-4 mb-6">
        <div className="mb-4 text-sm text-gray-600">
          Question {index + 1} of {total}
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
            className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selected}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {index + 1 === total ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductQuestionnaire;
