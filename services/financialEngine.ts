
import { UserRole, PricingResult, MattressParams, InvoicePayload } from '../types';

/**
 * FINANCIAL SYSTEMS ARCHITECTURE - HINDUSTAN MATTRESS CO.
 * Refined for Phase 1 Launch: Localization & Precision
 */

const HSN_MATTRESS = "9404";
const GST_RATE = 18;

// Localized Currency Formatter
const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export class FinancialEngine {
  
  static formatCurrency(amount: number): string {
    return rupeeFormatter.format(amount);
  }

  static calculateFinalPrice(params: MattressParams, product: any): PricingResult {
    // 0. Boundary Validation (CTO Refinement)
    if (params.length < 12 || params.breadth < 12) {
      throw new Error("DIMENSION_MINIMUM_VIOLATION: Mattress must be at least 12x12 inches.");
    }

    const isDealer = params.userType === UserRole.DEALER;
    const { coupon_code, dealer_auth_code } = params;
    
    let finalTotal: number;
    let taxable: number;
    let tax: number;

    if (isDealer) {
      if (!dealer_auth_code || dealer_auth_code !== "DEALER_2024_PRO") {
        throw new Error("INVALID_DEALER_AUTH: Invoice generation blocked.");
      }
      const dealerBase = product.dealer_price_inr;
      taxable = dealerBase;
      tax = taxable * (GST_RATE / 100);
      finalTotal = taxable + tax;
    } else {
      let currentMrp = product.mrp_inr;
      if (coupon_code === "FESTIVAL10") {
        currentMrp = currentMrp * 0.90;
      }
      finalTotal = currentMrp;
      taxable = finalTotal / (1 + GST_RATE / 100);
      tax = finalTotal - taxable;
    }

    return {
      final_price: Math.round(finalTotal),
      tax_breakdown: {
        base: Math.round(taxable),
        gst_total: Math.round(tax),
        cgst: isDealer ? Math.round(tax / 2) : undefined,
        sgst: isDealer ? Math.round(tax / 2) : undefined,
        hsn_code: HSN_MATTRESS
      },
      invoiceType: isDealer ? 'B2B_GST' : 'B2C_RETAIL',
      totalPrice: Math.round(finalTotal),
      basePrice: Math.round(taxable),
      taxAmount: Math.round(tax),
      discountedPrice: Math.round(finalTotal),
      surgeApplied: false,
      surgeAmount: 0
    };
  }

  static generateInvoiceData(order: any, user: any): InvoicePayload {
    const isDealer = user.role === UserRole.DEALER;
    const priceData = this.calculateFinalPrice({ 
      userType: user.role,
      length: order.length || 72,
      breadth: order.breadth || 36,
      thickness: order.thickness || 6
    }, order.product);

    return {
      invoice_id: `INV-${Date.now()}`,
      invoice_label: isDealer ? "TAX INVOICE" : "RETAIL INVOICE",
      customer_name: user.full_name,
      customer_gstin: isDealer ? user.gst_number : undefined,
      items: [{
        description: `${order.product.model_name} Mattress - ${order.dimensions}`,
        hsn: HSN_MATTRESS,
        qty: order.qty || 1,
        unit_price: priceData.basePrice,
        taxable_value: priceData.basePrice * (order.qty || 1),
        gst_rate: GST_RATE,
        total: priceData.totalPrice * (order.qty || 1)
      }],
      summary: {
        total_taxable: priceData.basePrice,
        total_tax: priceData.taxAmount,
        total_payable: priceData.totalPrice
      }
    };
  }
}
