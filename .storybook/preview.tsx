import type { Preview, StoryFn } from "@storybook/react";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
  layout: "centered",
};

export const decorators = [
  (Story: StoryFn) => (
    <Story />
  ),
];

export default { decorators, parameters } as Preview;
