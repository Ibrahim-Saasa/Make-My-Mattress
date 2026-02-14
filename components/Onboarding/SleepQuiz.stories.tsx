import React from "react";
import SleepQuiz from "./SleepQuiz";
import shortCopy from "../../src/data/quizCopy.json";

export default {
  title: "Onboarding/SleepQuiz",
  component: SleepQuiz,
};

export const Default = () => <SleepQuiz />;

export const ShortVariant = () => (
  <SleepQuiz copyOverride={shortCopy.altVariants.short} />
);

Default.storyName = "Start";
ShortVariant.storyName = "Start (Short Variant)";
