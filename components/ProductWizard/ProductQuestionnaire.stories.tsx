import type { StoryFn } from "@storybook/react";
import ProductQuestionnaire from "./ProductQuestionnaire";
import { ProductWizardProvider } from "../../contexts/ProductWizardContext";

export default {
  title: "ProductWizard/ProductQuestionnaire",
  component: ProductQuestionnaire,
  decorators: [
    (Story) => (
      <ProductWizardProvider>
        <Story />
      </ProductWizardProvider>
    ),
  ],
};

const Template: StoryFn = (args) => <ProductQuestionnaire {...args} />;

export const Mattress = Template.bind({});
Mattress.args = {
  category: "mattress" as const,
};

export const Pillow = Template.bind({});
Pillow.args = {
  category: "pillow" as const,
};

export const BedSheet = Template.bind({});
BedSheet.args = {
  category: "bedsheet" as const,
};

export const Accessories = Template.bind({});
Accessories.args = {
  category: "accessories" as const,
};
