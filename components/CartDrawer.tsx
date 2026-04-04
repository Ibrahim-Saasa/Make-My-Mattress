import React from 'react';
import { FinancialEngine } from '../services/financialEngine';
import { BrandMetadata, PricingResult } from '../types';

interface CartItem {
  brand: BrandMetadata;
  dimensions: string;
  pricing: PricingResult;
  id: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<Props> = ({ isOpen, onClose, items, onRemove, onCheckout }) => {
  const subtotal = items.reduce((acc, item) => acc + item.pricing.final_price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-[rgba(7,18,56,0.55)] backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative flex w-screen max-w-md flex-col overflow-hidden bg-[linear-gradient(180deg,#F7F9FF_0%,#EEF3FF_100%)] shadow-theme-2xl animate-in slide-in-from-right duration-500 dark:bg-[linear-gradient(180deg,#08153B_0%,#0D1B4E_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,64,209,0.08),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(200,165,91,0.08),transparent_20%)] dark:hidden" />
          <div className="pointer-events-none absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_top,rgba(76,114,255,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_24%)]" />

          <div className="relative z-10 flex items-center justify-between border-b border-theme-border px-8 py-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--brand-primary)] dark:text-[#AFC0FF]">
                Cart
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-theme-primary">Your cart</h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-theme-secondary">
                {items.length} {items.length === 1 ? 'configuration' : 'configurations'} ready to review
              </p>
            </div>
            <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-theme-border bg-theme-input text-theme-secondary transition-colors hover:text-[var(--brand-primary)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative z-10 flex-1 space-y-8 overflow-y-auto p-8">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-theme-input text-theme-secondary">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                   </svg>
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-theme-primary">Your cart is empty</p>
                <p className="max-w-xs text-sm text-theme-secondary">
                  Add a mattress build to compare totals and continue to checkout.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="group relative rounded-[2rem] border border-theme-border bg-theme-card p-6 transition-all hover:border-indigo-100 hover:bg-theme-card-hover hover:shadow-xl hover:shadow-indigo-500/5">
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-theme-border bg-theme-card text-theme-secondary shadow-sm transition-all hover:text-red-500"
                    aria-label={`Remove ${item.brand.name} from cart`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-indigo-600">
                        {item.brand.type} Series
                      </span>
                      <h4 className="text-lg font-black text-theme-primary">{item.brand.name}</h4>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-theme-secondary">
                        {item.dimensions} INCHES
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-theme-primary">
                        {FinancialEngine.formatCurrency(item.pricing.final_price)}
                      </div>
                      <span className="text-[9px] font-bold text-theme-secondary uppercase tracking-widest block mt-0.5">
                        {item.pricing.invoiceType}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="relative z-10 border-t border-theme-border bg-white/40 p-8 backdrop-blur-sm dark:bg-[#081742]/40">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-theme-secondary">Cart Subtotal</span>
                  <span className="text-3xl font-black text-theme-primary tracking-tighter">
                    {FinancialEngine.formatCurrency(subtotal)}
                  </span>
                </div>
                <p className="text-[9px] text-theme-secondary text-right uppercase tracking-widest font-bold">
                  Final delivery and taxes shown at checkout
                </p>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-theme-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98]"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
