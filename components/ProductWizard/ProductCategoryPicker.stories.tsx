import type { StoryFn } from "@storybook/react";
import ProductCategoryPicker from "./ProductCategoryPicker";
import { ProductWizardProvider } from "../../contexts/ProductWizardContext";

export default {
  title: "ProductWizard/ProductCategoryPicker",
  component: ProductCategoryPicker,
  decorators: [
    (Story) => (
      <ProductWizardProvider>
        <Story />
      </ProductWizardProvider>
    ),
  ],
};

const Template: StoryFn = () => <ProductCategoryPicker />;

export const Default = Template.bind({});
Default.storyName = "Category Picker";
