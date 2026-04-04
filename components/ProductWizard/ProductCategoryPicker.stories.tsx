import ProductCategoryPicker from "./ProductCategoryPicker";
import { ProductWizardProvider } from "../../contexts/ProductWizardContext";

const meta = {
  title: "ProductWizard/ProductCategoryPicker",
  component: ProductCategoryPicker,
  decorators: [
    (Story: any) => (
      <ProductWizardProvider>
        <Story />
      </ProductWizardProvider>
    ),
  ],
};

export default meta;

export const Default = {
  name: "Category Picker",
};
