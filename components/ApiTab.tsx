
import React from 'react';
import CodeBlock from './CodeBlock';

const ApiTab: React.FC = () => {
  const mermaidFlow = `
graph TD
    Start((Start)) --> UserCheck{Check UserType}
    
    UserCheck -- "End User (B2C)" --> FetchMRP[Fetch MRP - Tax Inclusive]
    FetchMRP --> ApplyCoupon[Apply "FESTIVAL10" Coupon]
    ApplyCoupon --> BackCalcTax[Back-Calculate Tax: Total / 1.18]
    BackCalcTax --> RetailOutput((Output Retail Invoice Price))

    UserCheck -- "Dealer (B2B)" --> FetchDealerBase[Fetch Dealer Base - Tax Exclusive]
    FetchDealerBase --> ValidateCode{Validate DEALER_AUTH_CODE}
    ValidateCode -- Valid --> AddGST[Add 18% GST]
    ValidateCode -- Invalid --> Reject[Block Invoice Generation]
    AddGST --> SplitTax[Split Tax: CGST 9% / SGST 9%]
    SplitTax --> B2BOutput((Output Tax Invoice Price))
  `;

  const financialLogic = `
/**
 * Master Financial Logic (Node.js/TypeScript)
 * Implements precision-safe currency calculations
 */
class FinancialEngine {
    static calculate(mrp, dealerPrice, type, coupon) {
        const GST = 1.18;
        
        if (type === 'DEALER') {
            const base = dealerPrice;
            const tax = base * 0.18;
            return {
                label: "TAX INVOICE",
                hsn: "9404",
                taxable: base,
                cgst: tax / 2,
                sgst: tax / 2,
                total: base + tax
            };
        } else {
            let total = mrp;
            if (coupon === 'FESTIVAL10') total *= 0.90;
            
            const taxable = total / GST;
            return {
                label: "RETAIL INVOICE",
                taxable: taxable,
                tax_total: total - taxable,
                total: total
            };
        }
    }
}
  `.trim();

  const checkoutResponse = `
// POST /checkout/preview response
// DIFFERENTIAL SCHEMA BASED ON USER ROLE

// RETAIL RESPONSE
{
  "invoice_type": "RETAIL",
  "summary": {
    "item_price": 24000,
    "discount": 2400,
    "total_payable": 21600
  }
}

// DEALER RESPONSE
{
  "invoice_type": "TAX_INVOICE",
  "hsn_code": "9404",
  "breakdown": {
    "net_price": 18000,
    "cgst_9": 1620,
    "sgst_9": 1620,
    "total_payable": 21240
  }
}
  `.trim();

  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
          Bimodal Pricing Flowchart
        </h3>
        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
          <pre>{mermaidFlow}</pre>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          Precision Financial Logic
        </h3>
        <p className="text-slate-400 mb-4">Implementation of tax back-calculation for Retail and split-GST for Trade.</p>
        <CodeBlock title="Core Engine Logic" code={financialLogic} language="javascript" />
      </section>

      <section>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
          API Response Duality
        </h3>
        <p className="text-slate-400 mb-4">Security-first response structures ensuring Dealers see trade info and Retail users see clean summaries.</p>
        <CodeBlock title="JSON Structures" code={checkoutResponse} language="json" />
      </section>
    </div>
  );
};

export default ApiTab;
