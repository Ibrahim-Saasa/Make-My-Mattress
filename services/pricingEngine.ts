
import { UserRole, PricingResult, MattressParams } from '../types';

/**
 * Enhanced Pricing Engine with AI Dynamic Demand Optimization
 */
export const calculateMattressPrice = ({
  length,
  breadth,
  thickness,
  materialRate = 0.85, // Defaulting to Slumbersoft rate if not provided in params
  userType = UserRole.END_USER,
  demandLevel = 'NORMAL'
}: MattressParams): PricingResult => {
  const BASE_OVERHEAD = 1800;
  const GST_RATE = 0.18;
  const DEALER_DISCOUNT = 0.25;
  const END_USER_COUPON = 0.10;

  // AI Dynamic Pricing Logic:
  // Overhead is adjusted based on real-time simulated demand (e.g. Wedding Season)
  let demandMultiplier = 1.0;
  if (demandLevel === 'PEAK') demandMultiplier = 1.25; // 25% surge in logistics/labor
  if (demandLevel === 'LOW') demandMultiplier = 0.90;  // 10% discount to move stock

  const adjustedOverhead = BASE_OVERHEAD * demandMultiplier;
  const thicknessFactor = 1 + (thickness - 4) * 0.12;

  const basePrice = (length * breadth * thicknessFactor * materialRate) + adjustedOverhead;

  let discountedPrice = basePrice;
  let invoiceType: 'B2B_GST' | 'B2C_RETAIL' = 'B2C_RETAIL';
  let appliedCoupon = '';

  if (userType === UserRole.DEALER) {
    discountedPrice = basePrice * (1 - DEALER_DISCOUNT);
    invoiceType = 'B2B_GST';
  } else {
    discountedPrice = basePrice * (1 - END_USER_COUPON);
    appliedCoupon = 'HINDUSTAN10';
  }

  const taxAmount = discountedPrice * GST_RATE;
  const totalPrice = discountedPrice + taxAmount;

  // FIX: Added missing final_price and tax_breakdown properties required by PricingResult interface
  return {
    final_price: Math.round(totalPrice),
    tax_breakdown: {
      base: Math.round(discountedPrice),
      gst_total: Math.round(taxAmount),
      hsn_code: '9404'
    },
    basePrice: Math.round(basePrice),
    discountedPrice: Math.round(discountedPrice),
    taxAmount: Math.round(taxAmount),
    totalPrice: Math.round(totalPrice),
    invoiceType,
    appliedCoupon: appliedCoupon || undefined,
    surgeApplied: demandLevel === 'PEAK',
    surgeAmount: Math.round(adjustedOverhead - BASE_OVERHEAD)
  };
};
