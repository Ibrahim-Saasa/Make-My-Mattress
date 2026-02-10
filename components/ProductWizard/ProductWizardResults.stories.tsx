import type { StoryFn } from "@storybook/react";
import ProductWizardResults from "./ProductWizardResults";
import { ProductWizardProvider } from "../../contexts/ProductWizardContext";
import { ProductRecommendation } from "../../types";

export default {
  title: "ProductWizard/ProductWizardResults",
  component: ProductWizardResults,
  decorators: [
    (Story) => (
      <ProductWizardProvider>
        <Story />
      </ProductWizardProvider>
    ),
  ],
};

const mockRecommendations: ProductRecommendation[] = [
  {
    id: "m1",
    name: "Cloud Comfort Mattress",
    category: "mattress",
    description: "Perfect for side sleepers who prefer a softer feel",
    price: 899,
    rating: 4.8,
    match_score: 0.95,
  },
  {
    id: "m2",
    name: "Supreme Support Mattress",
    category: "mattress",
    description: "Ideal for back sleepers wanting firm support",
    price: 1299,
    rating: 4.7,
    match_score: 0.88,
  },
];

const Template: StoryFn = (args) => <ProductWizardResults {...args} />;

export const WithRecommendations = Template.bind({});
WithRecommendations.args = {
  recommendations: mockRecommendations,
  category: "Mattress",
};

export const NoRecommendations = Template.bind({});
NoRecommendations.args = {
  recommendations: [],
  category: "Pillow",
};
