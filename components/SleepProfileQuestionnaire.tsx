"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../src/contexts/SessionContext";
import { SleepProfile, QuizAnswer, ProductRecommendation } from "../types";
import { getProductRecommendations } from "../services/preferenceService";

interface Props {
  onProfileSaved: (profile: SleepProfile) => void;
  onBack: () => void;
}

const SleepProfileQuestionnaire: React.FC<Props> = ({
  onProfileSaved,
  onBack,
}) => {
  const { session, supabase } = useSession();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SleepProfile>>({
    sleep_position: "",
    firmness_preference: "",
    body_type: "",
    sleep_temperature: "",
    health_concerns: [],
    partner_disturbance: false,
    budget_preference: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState<
    ProductRecommendation[]
  >([]);

  const sleepPositions: SleepProfile["sleep_position"][] = [
    "side",
    "back",
    "stomach",
    "combination",
  ];
  const firmnessOptions: SleepProfile["firmness_preference"][] = [
    "soft",
    "medium",
    "firm",
    "very_firm",
  ];
  const bodyTypes: SleepProfile["body_type"][] = ["light", "average", "heavy"];
  const temperatureOptions: SleepProfile["sleep_temperature"][] = [
    "hot",
    "cool",
    "normal",
  ];
  const budgetOptions: SleepProfile["budget_preference"][] = [
    "economical",
    "standard",
    "luxury",
  ];

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Save profile
      const profile: SleepProfile = formData as SleepProfile;
      onProfileSaved(profile);

      // Convert formData to QuizAnswer[]
      const answers: QuizAnswer[] = [
        {
          question_id: "sleep_position",
          answer_id: formData.sleep_position || "",
        },
        {
          question_id: "firmness_preference",
          answer_id: formData.firmness_preference || "",
        },
        { question_id: "body_type", answer_id: formData.body_type || "" },
        {
          question_id: "sleep_temperature",
          answer_id: formData.sleep_temperature || "",
        },
        {
          question_id: "health_concerns",
          answer_id: (formData.health_concerns || []).join(", "),
        },
        {
          question_id: "partner_disturbance",
          answer_id: formData.partner_disturbance ? "yes" : "no",
        },
        {
          question_id: "budget_preference",
          answer_id: formData.budget_preference || "",
        },
      ];

      // Get recommendations
      const recs = await getProductRecommendations(answers);
      setRecommendations(recs);
      setStep(8);
    } catch (err) {
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setError("");
    // Basic validation for current step before moving on
    if (step === 1 && !formData.sleep_position) {
      setError("Please select your primary sleep position.");
      return;
    }
    if (step === 2 && !formData.firmness_preference) {
      setError("Please select your preferred firmness.");
      return;
    }
    if (step === 3 && !formData.body_type) {
      setError("Please select your body type.");
      return;
    }
    if (step === 4 && !formData.sleep_temperature) {
      setError("Please describe your sleep temperature.");
      return;
    }
    if (step === 5 && !formData.budget_preference) {
      setError("Please select your budget preference.");
      return;
    }
    if (step === 7) {
      handleGenerateRecommendations();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError("");
    if (step === 1) {
      onBack();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleHealthConcernChange = (concern: string, isChecked: boolean) => {
    setFormData((prev) => {
      const currentConcerns = prev.health_concerns || [];
      if (isChecked) {
        return { ...prev, health_concerns: [...currentConcerns, concern] };
      } else {
        return {
          ...prev,
          health_concerns: currentConcerns.filter((c) => c !== concern),
        };
      }
    });
  };

  const handleSaveProfile = async () => {
    setError("");
    setIsLoading(true);

    if (!session?.user?.id) {
      setError("User not authenticated.");
      setIsLoading(false);
      return;
    }

    try {
      const profileToSave: SleepProfile = {
        user_id: session.user.id,
        sleep_position: formData.sleep_position || "",
        firmness_preference: formData.firmness_preference || "",
        body_type: formData.body_type || "",
        sleep_temperature: formData.sleep_temperature || "",
        health_concerns: formData.health_concerns || [],
        partner_disturbance: formData.partner_disturbance || false,
        budget_preference: formData.budget_preference || "",
      };

      const { data, error: upsertError } = await supabase
        .from("user_sleep_profiles")
        .upsert(profileToSave, { onConflict: "user_id" })
        .select()
        .single();

      if (upsertError) {
        throw upsertError;
      }

      onProfileSaved(data);
      navigate("/sleep-recommendation");
    } catch (err: any) {
      console.error("Error saving sleep profile:", err);
      setError(
        err.message || "Failed to save sleep profile. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-theme-primary mb-4">
              1. What's your primary sleep position?
            </h3>
            {sleepPositions.map((pos) => (
              <button
                key={pos}
                onClick={() =>
                  setFormData({ ...formData, sleep_position: pos })
                }
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  formData.sleep_position === pos
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-800/90 border-slate-700/80 hover:border-indigo-400"
                }`}
              >
                <span className="font-bold capitalize">{pos} sleeper</span>
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-theme-primary mb-4">
              2. What firmness do you prefer?
            </h3>
            {firmnessOptions.map((firm) => (
              <button
                key={firm}
                onClick={() =>
                  setFormData({ ...formData, firmness_preference: firm })
                }
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  formData.firmness_preference === firm
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-800/90 border-slate-700/80 hover:border-indigo-400"
                }`}
              >
                <span className="font-bold capitalize">
                  {firm.replace("_", " ")}
                </span>
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-theme-primary mb-4">
              3. What's your body type?
            </h3>
            {bodyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFormData({ ...formData, body_type: type })}
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  formData.body_type === type
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-800/90 border-slate-700/80 hover:border-indigo-400"
                }`}
              >
                <span className="font-bold capitalize">{type}weight</span>
              </button>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-theme-primary mb-4">
              4. Do you tend to sleep hot or cool?
            </h3>
            {temperatureOptions.map((temp) => (
              <button
                key={temp}
                onClick={() =>
                  setFormData({ ...formData, sleep_temperature: temp })
                }
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  formData.sleep_temperature === temp
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-800/90 border-slate-700/80 hover:border-indigo-400"
                }`}
              >
                <span className="font-bold capitalize">{temp}</span>
              </button>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-theme-primary mb-4">
              5. Any health concerns? (Select all that apply)
            </h3>
            {["back_pain", "joint_pain", "allergies", "none"].map((concern) => (
              <label
                key={concern}
                className={`flex items-center p-6 rounded-2xl border transition-all cursor-pointer ${
                  formData.health_concerns?.includes(concern)
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-800/90 border-slate-700/80 hover:border-indigo-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.health_concerns?.includes(concern)}
                  onChange={(e) =>
                    handleHealthConcernChange(concern, e.target.checked)
                  }
                  className="mr-4 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="font-bold capitalize">
                  {concern.replace("_", " ")}
                </span>
              </label>
            ))}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-theme-primary mb-4">
              6. Do you share your bed with a partner who moves a lot?
            </h3>
            <button
              onClick={() =>
                setFormData({ ...formData, partner_disturbance: true })
              }
              className={`w-full text-left p-6 rounded-2xl border transition-all ${
                formData.partner_disturbance === true
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800/90 border-slate-700/80 hover:border-indigo-400"
              }`}
            >
              <span className="font-bold">Yes, frequently</span>
            </button>
            <button
              onClick={() =>
                setFormData({ ...formData, partner_disturbance: false })
              }
              className={`w-full text-left p-6 rounded-2xl border transition-all ${
                formData.partner_disturbance === false
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800/90 border-slate-700/80 hover:border-indigo-400"
              }`}
            >
              <span className="font-bold">No, not really</span>
            </button>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-theme-primary mb-4">
              7. What's your budget preference?
            </h3>
            {budgetOptions.map((budget) => (
              <button
                key={budget}
                onClick={() =>
                  setFormData({ ...formData, budget_preference: budget })
                }
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  formData.budget_preference === budget
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-800/90 border-slate-700/80 hover:border-indigo-400"
                }`}
              >
                <span className="font-bold capitalize">{budget}</span>
              </button>
            ))}
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-theme-primary mb-4">
              Your Personalized Recommendations
            </h3>
            {recommendations.length === 0 ? (
              <p className="text-center text-theme-secondary">
                No recommendations found. Please try again.
              </p>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 border border-slate-700 rounded-2xl bg-slate-800/80 shadow-sm"
                  >
                    <h4 className="font-bold text-white">{rec.name}</h4>
                    <p className="text-sm text-slate-300">{rec.description}</p>
                    <p className="text-sm font-semibold text-indigo-300">
                      Price: ${rec.price}
                    </p>
                    <p className="text-sm text-slate-300">
                      Rating: {rec.rating}/5
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 p-6 md:p-12 flex items-center justify-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle_at_bottom,rgba(88,28,135,0.18),transparent_40%)]" />
      <div className="relative max-w-3xl w-full bg-slate-900/95 border border-white/10 p-8 rounded-[3rem] shadow-[0_35px_120px_rgba(15,23,42,0.5)] backdrop-blur-xl">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-300/70">
              Sleep quiz
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Sleep Profile
            </h2>
          </div>
          <div className="w-10 h-10"></div> {/* Spacer */}
        </div>

        <div className="relative mb-8">
          <div className="h-2 bg-theme-input rounded-full">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(step / 8) * 100}%` }}
            ></div>
          </div>
          <span className="absolute -bottom-6 right-0 text-xs font-bold text-theme-secondary">
            {step} / 8
          </span>
        </div>

        <div className="py-8">{renderStep()}</div>

        {error && (
          <p className="text-xs font-bold text-red-500 px-2 text-center mb-4">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-4 mt-8">
          {step < 7 ? (
            <button
              onClick={handleNext}
              className="bg-indigo-600 text-white py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all"
            >
              NEXT
            </button>
          ) : step === 7 ? (
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="bg-brand-amber text-brand-navy py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin"></div>
              ) : (
                "GET RECOMMENDATION"
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate("/brand-hall")}
              className="bg-green-600 text-white py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/20 hover:bg-green-700 active:scale-[0.98] transition-all"
            >
              BROWSE PRODUCTS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SleepProfileQuestionnaire;
