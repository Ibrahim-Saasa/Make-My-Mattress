import React, { useState } from "react";
import { BrandMetadata, PricingResult, Address } from "../types";
import { FinancialEngine } from "../services/financialEngine";
import AddressPicker from "./AddressPicker";

interface CartItem {
  brand: BrandMetadata;
  dimensions: string;
  pricing: PricingResult;
  id: string;
}

interface Props {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderSuccess: () => void;
}

const CheckoutScreen: React.FC<Props> = ({
  cartItems,
  onBack,
  onOrderSuccess,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false);

  const totalPayable = cartItems.reduce(
    (acc, item) => acc + item.pricing.final_price,
    0,
  );
  const totalTax = cartItems.reduce(
    (acc, item) => acc + item.pricing.taxAmount,
    0,
  );

  // Logic for summary displays
  const isB2B = cartItems.some(
    (item) => item.pricing.invoiceType === "B2B_GST",
  );

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address first.");
      return;
    }
    onOrderSuccess();
    alert("Order Placed Successfully! Your Hindustan Mattress journey begins.");
  };

  const SummaryRow = ({
    label,
    value,
    isTax = false,
  }: {
    label: string;
    value: number | string;
    isTax?: boolean;
  }) => (
    <div className="flex justify-between items-center py-2">
      <span
        className={`text-sm font-medium ${isTax ? "text-theme-tertiary" : "text-theme-primary"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm font-bold ${isTax ? "text-theme-secondary" : "text-theme-primary"}`}
      >
        {typeof value === "number"
          ? FinancialEngine.formatCurrency(value)
          : value}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-theme-background">
      {/* App Bar */}
      <header className="fixed top-0 w-full bg-theme-card border-b border-theme-border px-6 py-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-theme-card-hover rounded-full transition-colors text-theme-secondary"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-lg font-black text-theme-primary tracking-tight italic">
            Review Order
          </h2>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-12">
        {/* Section 1: Product Details (Itemized) */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-theme-secondary uppercase tracking-widest">
            Order Items
          </h3>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-theme-input border border-theme-border p-6 rounded-[2.5rem] flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-black text-theme-primary">
                  {item.brand.name} Mattress
                </h3>
                <p className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mt-0.5">
                  Size: {item.dimensions} inches
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-black text-indigo-600 uppercase">
                    Qty: 1
                  </span>
                  <span className="text-sm font-black text-theme-primary">
                    {FinancialEngine.formatCurrency(item.pricing.final_price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Payment Summary */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-black text-theme-primary uppercase tracking-tighter italic">
              Payment Summary
            </h4>
            <div
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isB2B
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
              }`}
            >
              {isB2B ? "TAX INVOICE" : "RETAIL INVOICE"}
            </div>
          </div>

          <div className="space-y-2">
            <SummaryRow
              label={isB2B ? "Subtotal (Base Price)" : "Item MRP (Subtotal)"}
              value={isB2B ? totalPayable - totalTax : totalPayable}
            />

            {isB2B && (
              <>
                <SummaryRow label="GST (18%)" value={totalTax} isTax />
              </>
            )}

            {!isB2B && (
              <p className="text-[10px] font-black text-emerald-600 uppercase italic tracking-widest">
                (Price includes all taxes)
              </p>
            )}

            <div className="h-px bg-theme-border my-4"></div>

            <div className="flex justify-between items-end pt-2">
              <span className="text-xl font-black text-theme-primary uppercase tracking-tighter">
                Total Payable
              </span>
              <span className="text-3xl font-black text-indigo-600">
                {FinancialEngine.formatCurrency(totalPayable)}
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Shipping Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black text-theme-secondary uppercase tracking-widest">
              Delivery Address
            </h4>
            {selectedAddress && (
              <button
                onClick={() => setIsAddressPickerOpen(true)}
                className="text-[9px] font-black text-indigo-600 uppercase tracking-widest"
              >
                Change
              </button>
            )}
          </div>

          {selectedAddress ? (
            <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] flex items-center gap-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    {selectedAddress.label}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-theme-primary leading-snug">
                  {selectedAddress.details}
                </h4>
                <p className="text-xs text-theme-secondary mt-1">
                  {selectedAddress.city} - {selectedAddress.pincode}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddressPickerOpen(true)}
              className="w-full text-left p-10 rounded-[2.5rem] border-2 border-dashed border-theme-border hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-theme-input flex items-center justify-center text-theme-secondary group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <span className="font-black text-sm text-theme-secondary group-hover:text-indigo-600 uppercase tracking-widest transition-all">
                  ~
                </span>
              </div>
            </button>
          )}
        </section>
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 w-full bg-theme-card/80 backdrop-blur-xl border-t border-theme-border p-6 z-40">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-[#00966C] text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-theme-2xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            PLACE ORDER
          </button>
        </div>
      </div>

      <AddressPicker
        isOpen={isAddressPickerOpen}
        onClose={() => setIsAddressPickerOpen(false)}
        onSave={(addr) => {
          setSelectedAddress(addr);
          setIsAddressPickerOpen(false);
        }}
      />
    </div>
  );
};

export default CheckoutScreen;
