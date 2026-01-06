
import { UserRole, PricingResult, MattressParams } from '../types';

/**
 * MASTER PRICING ARCHITECTURE SERVICE
 * Handles standard variant lookups and custom size calculations
 */

// Mock Database Connection (Conceptual for production environment)
const db = {
  query: async (text: string, params: any[]) => ({ rows: [] as any[] })
};

export const getMasterPrice = async ({
  product_id,
  length,
  breadth,
  thickness,
  userType = UserRole.END_USER // Changed user_type to userType to match MattressParams
}: MattressParams): Promise<PricingResult> => {
  
  // SCENARIO A: Check for Standard Size in product_variants
  const variantQuery = `
    SELECT sku_code, mrp_inr, dealer_price_inr 
    FROM product_variants 
    WHERE product_id = $1 
    AND length_inch = $2 
    AND breadth_inch = $3 
    AND thickness_inch = $4
  `;
  
  // In a real app: const { rows } = await db.query(variantQuery, [product_id, length, breadth, thickness]);
  const standardVariant = null; // Mocking result for logic demonstration

  let finalPrice: number;
  let sku: string;
  let isStandard = false;
  let dealerPrice: number | undefined;

  if (standardVariant) {
    // Standard size found
    isStandard = true;
    const row = standardVariant as any;
    finalPrice = userType === UserRole.DEALER ? row.dealer_price_inr : row.mrp_inr;
    dealerPrice = row.dealer_price_inr;
    sku = row.sku_code;
  } else {
    // SCENARIO B: Custom Size Calculation
    const formulaQuery = `
      SELECT price_per_sq_inch_user, price_per_sq_inch_dealer, overhead_cost 
      FROM custom_pricing_formulas 
      WHERE product_id = $1
    `;
    
    // Mock formula data
    const formula = {
      price_per_sq_inch_user: 0.85,
      price_per_sq_inch_dealer: 0.65,
      overhead_cost: 1500
    };

    const rate = userType === UserRole.DEALER ? formula.price_per_sq_inch_dealer : formula.price_per_sq_inch_user;
    finalPrice = (length * breadth * rate) + formula.overhead_cost;
    dealerPrice = (length * breadth * formula.price_per_sq_inch_dealer) + formula.overhead_cost;
    
    // Generate custom SKU for reference
    sku = `CUSTOM-${product_id}-${thickness}-${length}x${breadth}`;
  }

  // Tax Breakdown (Assuming 18% GST included in the final calculated price)
  const base = finalPrice / 1.18;
  const gst_total = finalPrice - base;

  const result: PricingResult = {
    product_id,
    is_standard_size: isStandard,
    final_price: Math.round(finalPrice),
    // FIX: Changed gst_18 to gst_total and added required hsn_code to match TaxBreakdown interface
    tax_breakdown: {
      base: parseFloat(base.toFixed(2)),
      gst_total: parseFloat(gst_total.toFixed(2)),
      hsn_code: '9404'
    },
    sku,
    // Providing required fields for PricingResult interface consistency
    basePrice: Math.round(finalPrice),
    discountedPrice: Math.round(finalPrice),
    taxAmount: Math.round(gst_total),
    totalPrice: Math.round(finalPrice),
    invoiceType: userType === UserRole.DEALER ? 'B2B_GST' : 'B2C_RETAIL',
    surgeApplied: false,
    surgeAmount: 0
  };

  // SECURITY FILTER: Return sensitive data only to Dealers
  if (userType === UserRole.DEALER) {
    result.dealer_price_inr = Math.round(dealerPrice || 0);
    result.gst_percent = 18;
  }

  return result;
};
