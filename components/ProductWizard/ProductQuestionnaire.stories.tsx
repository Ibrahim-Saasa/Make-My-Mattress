import ProductQuestionnaire from "./ProductQuestionnaire";
import { ProductWizardProvider } from "../../contexts/ProductWizardContext";

const meta = {
  title: "ProductWizard/ProductQuestionnaire",
  component: ProductQuestionnaire,
  decorators: [
    (Story: any) => (
      <ProductWizardProvider>
        <Story />
      </ProductWizardProvider>
    ),
  ],
};

export default meta;

export const Mattress = {
  args: {
    category: "mattress" as const,
  },
};

export const Pillow = {
  args: {
    category: "pillow" as const,
  },
};

export const BedSheet = {
  args: {
    category: "bedsheet" as const,
  },
};

export const Accessories = {
  args: {
    category: "accessories" as const,
  },
};
