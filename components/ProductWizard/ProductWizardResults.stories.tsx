import ProductWizardResults from "./ProductWizardResults";
import { ProductWizardProvider } from "../../contexts/ProductWizardContext";
import { CustomMattressBuild, UserRole } from "../../types";

const meta = {
  title: "ProductWizard/ProductWizardResults",
  component: ProductWizardResults,
  decorators: [
    (Story: any) => (
      <ProductWizardProvider>
        <Story />
      </ProductWizardProvider>
    ),
  ],
};

export default meta;

const mockCustomMattressBuild: CustomMattressBuild = {
  id: "custom-comfort-mattress",
  name: "Your Custom Comfort Mattress",
  category: "mattress",
  comfortType: "Latex",
  materialRate: 1.25,
  matchedBrandId: "brand_2",
  matchScore: 0.96,
  params: {
    length: 78,
    breadth: 60,
    thickness: 6,
    materialRate: 1.25,
    userType: UserRole.END_USER,
    demandLevel: "NORMAL",
  },
  pricing: {
    final_price: 8398,
    tax_breakdown: {
      base: 7117,
      gst_total: 1281,
      hsn_code: "9404",
    },
    basePrice: 7908,
    discountedPrice: 7117,
    taxAmount: 1281,
    totalPrice: 8398,
    invoiceType: "B2C_RETAIL",
    surgeApplied: false,
    surgeAmount: 0,
    appliedCoupon: "HINDUSTAN10",
  },
  reasons: [
    "Tuned for a cooler, more breathable sleep surface.",
    "Priced using the size you selected in the quiz.",
    "Balanced for long-term support and comfort.",
  ],
  description:
    "A custom mattress quote shaped from your quiz answers and priced with the same live mattress pricing engine used across the app.",
  sourceAnswers: [
    { question_id: "q0", answer_id: "latex" },
    { question_id: "q5", answer_id: "queen" },
  ],
};

export const CustomQuote = {
  args: {
    customMattressBuild: mockCustomMattressBuild,
  },
};

export const MissingQuote = {
  args: {
    customMattressBuild: null,
  },
};
