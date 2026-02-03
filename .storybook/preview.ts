import type { Preview } from "@storybook/react";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
  layout: "centered",
};

export const decorators = [
  (Story) => (
    <>
      <Story />
    </>
  ),
];

export default { decorators, parameters } as Preview;
