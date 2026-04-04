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

const CHECKOUT_STARS = [
  { left: "8%", top: "7%", size: 2, delay: "0s", duration: "5.2s" },
  { left: "18%", top: "17%", size: 3, delay: "1.1s", duration: "6s" },
  { left: "28%", top: "10%", size: 2, delay: "0.5s", duration: "4.6s" },
  { left: "44%", top: "8%", size: 2, delay: "1.7s", duration: "5.5s" },
  { left: "58%", top: "15%", size: 3, delay: "0.8s", duration: "6.3s" },
  { left: "71%", top: "11%", size: 2, delay: "2s", duration: "4.9s" },
  { left: "84%", top: "18%", size: 2, delay: "1.2s", duration: "5.7s" },
  { left: "12%", top: "42%", size: 2, delay: "0.6s", duration: "5.1s" },
  { left: "35%", top: "54%", size: 3, delay: "1.9s", duration: "6.2s" },
  { left: "63%", top: "48%", size: 2, delay: "0.3s", duration: "4.7s" },
  { left: "88%", top: "60%", size: 2, delay: "1.5s", duration: "5.9s" },
];

const CheckoutScreen: React.FC<Props> = ({
  cartItems,
  onBack,
  onOrderSuccess,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error";
    message: string;
  } | null>(null);

  const totalPayable = cartItems.reduce(
    (acc, item) => acc + item.pricing.final_price,
    0,
  );
  const totalTax = cartItems.reduce(
    (acc, item) => acc + item.pricing.taxAmount,
    0,
  );
  const isB2B = cartItems.some(
    (item) => item.pricing.invoiceType === "B2B_GST",
  );
  const totalItems = cartItems.length;

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      setFeedback({
        type: "error",
        message: "Add a delivery address before placing the order.",
      });
      return;
    }

    onOrderSuccess();
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
    <div className="flex items-center justify-between py-2">
      <span
        className={`text-sm ${isTax ? "font-semibold text-theme-tertiary" : "font-medium text-theme-primary"}`}
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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#F7F9FF_0%,#EEF3FF_100%)] dark:bg-theme-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,64,209,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(200,165,91,0.08),transparent_20%)] dark:hidden" />
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-full dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,114,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_24%)]" />
        {CHECKOUT_STARS.map((star, index) => (
          <span
            key={`${star.left}-${star.top}-${index}`}
            className="absolute rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.35)]"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `mmm-checkout-star ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes mmm-checkout-star {
          0%, 100% { opacity: 0.22; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.8); }
        }
      `}</style>

      <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-theme-border bg-theme-card/90 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-theme-border bg-theme-input text-theme-secondary transition-colors hover:text-[var(--brand-primary)]"
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
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--brand-primary)] dark:text-[#AFC0FF]">
              Checkout
            </p>
            <h2 className="text-lg font-black tracking-tight text-theme-primary">
              Review order
            </h2>
          </div>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#0C1F63] md:flex md:items-center dark:border-[#3756A6] dark:bg-[#1A2D63] dark:text-[#E7EEFF]">
          {totalItems} item{totalItems === 1 ? "" : "s"}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl space-y-10 px-6 pb-36 pt-24">
        <section className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#09174A] via-[#0C1F63] to-[#1740D1] px-8 py-8 text-white shadow-[0_28px_70px_rgba(9,23,74,0.26)]">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#DCE6FF]">
                Final step
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                A calmer checkout for your sleep upgrade.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 md:text-base">
                Review your mattress build, confirm delivery, and place the
                order with full pricing clarity before you move ahead.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-white/14 bg-white/8 px-4 py-4 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#DCE6FF]">
                  Order value
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {FinancialEngine.formatCurrency(totalPayable)}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/14 bg-white/8 px-4 py-4 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#DCE6FF]">
                  Invoice
                </p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-white">
                  {isB2B ? "Tax invoice" : "Retail invoice"}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/14 bg-white/8 px-4 py-4 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#DCE6FF]">
                  Delivery
                </p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-white">
                  {selectedAddress ? "Address added" : "Pending address"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {feedback && (
          <div className="rounded-[2rem] border border-[#D76A72]/40 bg-[#3B2030] px-5 py-4 text-sm font-semibold text-[#FFB8BE]">
            {feedback.message}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-theme-secondary">
            Order Items
          </h3>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-[2.5rem] border border-theme-border bg-theme-card p-6 shadow-theme-light"
            >
              <div className="grid gap-5 md:grid-cols-[120px_minmax(0,1fr)_auto] md:items-center">
                <div className="relative h-28 rounded-[2rem] bg-gradient-to-br from-[#EEF3FF] to-[#DCE6FF] dark:from-[#1B2D63] dark:to-[#13224C]">
                  <div className="absolute inset-x-4 bottom-5 h-6 rounded-[1.25rem] bg-[#4C2E17]/20 blur-[1px]" />
                  <div className="absolute inset-x-5 bottom-6 h-10 rounded-[1.5rem] bg-[linear-gradient(180deg,#FFFFFF_0%,#E9EEF9_100%)] shadow-[0_18px_40px_rgba(6,18,56,0.18)]" />
                  <div className="absolute left-7 bottom-12 h-5 w-7 rounded-[0.9rem] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF3FF_100%)] shadow-sm" />
                  <div className="absolute left-[58px] bottom-12 h-5 w-7 rounded-[0.9rem] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF3FF_100%)] shadow-sm" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--brand-primary)] shadow-sm dark:bg-white/10 dark:text-[#DCE6FF]">
                    Mattress
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-theme-primary">
                    {item.brand.name} Mattress
                  </h3>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--brand-primary)] dark:text-[#AFC0FF]">
                    Size: {item.dimensions} inches
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-theme-secondary">
                    Crafted for balanced support and a cleaner sleep setup with
                    your selected configuration.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[rgba(23,64,209,0.08)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--brand-primary)] dark:bg-white/10 dark:text-[#DCE6FF]">
                      Qty 1
                    </span>
                    <span className="rounded-full bg-[rgba(200,165,91,0.12)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#9A7A39] dark:bg-[#2C2446] dark:text-[#E3C98A]">
                      Premium build
                    </span>
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-theme-input px-5 py-4 text-left md:min-w-[170px]">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-theme-secondary">
                    Line total
                  </p>
                  <p className="mt-2 text-2xl font-black text-theme-primary">
                    {FinancialEngine.formatCurrency(item.pricing.final_price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="space-y-6 rounded-[2.5rem] border border-theme-border bg-theme-card p-6 shadow-theme-light">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black uppercase tracking-tighter text-theme-primary">
              Payment Summary
            </h4>
            <div
              className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                isB2B
                  ? "border border-amber-200 bg-amber-100 text-amber-700"
                  : "border border-emerald-200 bg-emerald-100 text-emerald-700"
              }`}
            >
              {isB2B ? "TAX INVOICE" : "RETAIL INVOICE"}
            </div>
          </div>

          <div className="space-y-2 rounded-[2rem] bg-theme-input p-5">
            <SummaryRow
              label={isB2B ? "Subtotal (Base Price)" : "Item MRP (Subtotal)"}
              value={isB2B ? totalPayable - totalTax : totalPayable}
            />

            {isB2B && <SummaryRow label="GST (18%)" value={totalTax} isTax />}

            {!isB2B && (
              <p className="text-[10px] font-black uppercase italic tracking-widest text-emerald-600">
                (Price includes all taxes)
              </p>
            )}

            <div className="my-4 h-px bg-theme-border" />

            <div className="flex items-end justify-between pt-2">
              <span className="text-xl font-black uppercase tracking-tighter text-theme-primary">
                Total Payable
              </span>
              <span className="text-3xl font-black text-indigo-600">
                {FinancialEngine.formatCurrency(totalPayable)}
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-[2.5rem] border border-theme-border bg-theme-card p-6 shadow-theme-light">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-theme-secondary">
              Delivery Address
            </h4>
            {selectedAddress && (
              <button
                onClick={() => setIsAddressPickerOpen(true)}
                className="text-[9px] font-black uppercase tracking-widest text-indigo-600"
              >
                Change
              </button>
            )}
          </div>

          {selectedAddress ? (
            <div className="flex items-center gap-6 rounded-[2.5rem] border border-indigo-100 bg-indigo-50 p-8 animate-in slide-in-from-bottom-2 duration-300 dark:border-[#29427E] dark:bg-[#13244F]">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
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
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    {selectedAddress.label}
                  </span>
                </div>
                <h4 className="text-sm font-bold leading-snug text-theme-primary">
                  {selectedAddress.details}
                </h4>
                <p className="mt-1 text-xs text-theme-secondary">
                  {selectedAddress.city} - {selectedAddress.pincode}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddressPickerOpen(true)}
              className="group w-full rounded-[2.5rem] border-2 border-dashed border-theme-border p-10 text-left transition-all hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-[#142456]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-input text-theme-secondary shadow-sm transition-all group-hover:bg-indigo-600 group-hover:text-white">
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
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-theme-primary transition-all group-hover:text-indigo-600">
                    Add delivery address
                  </p>
                  <p className="mt-1 text-xs text-theme-secondary">
                    Save the exact location and pincode for delivery updates.
                  </p>
                </div>
              </div>
            </button>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 z-40 w-full border-t border-theme-border bg-theme-card/88 p-4 backdrop-blur-xl md:p-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-theme-secondary">
              Ready to place order
            </p>
            <p className="mt-1 text-sm text-theme-secondary">
              {selectedAddress
                ? "Delivery address confirmed. You can place the order now."
                : "Add a delivery address to continue smoothly."}
            </p>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full rounded-[2rem] bg-[#00966C] px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-theme-2xl shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98] md:min-w-[320px] md:w-auto"
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
          setFeedback(null);
          setIsAddressPickerOpen(false);
        }}
      />
    </div>
  );
};

export default CheckoutScreen;
