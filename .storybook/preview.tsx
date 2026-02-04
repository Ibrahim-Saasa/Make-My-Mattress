type StoryFn = (args?: any) => any;

type Preview = {
  decorators?: any[];
  parameters?: any;
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
  layout: "centered",
};

export const decorators = [(Story: StoryFn) => Story()];

export default { decorators, parameters } as Preview;
