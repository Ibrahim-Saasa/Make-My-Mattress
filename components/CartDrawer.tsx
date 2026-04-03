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
        className="absolute inset-0 bg-theme-background/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-theme-card shadow-theme-2xl flex flex-col animate-in slide-in-from-right duration-500">
          <div className="p-8 border-b border-theme-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-theme-primary tracking-tight uppercase italic">Your cart</h2>
              <p className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mt-1">
                {items.length} {items.length === 1 ? 'configuration' : 'configurations'} ready to review
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-theme-card-hover rounded-full transition-colors text-theme-secondary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <div className="w-20 h-20 bg-theme-input rounded-full flex items-center justify-center text-theme-secondary">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                   </svg>
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-theme-secondary">Your cart is empty</p>
                <p className="max-w-xs text-sm text-theme-secondary">
                  Add a mattress build to compare totals and continue to checkout.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="relative group bg-theme-input border border-theme-border p-6 rounded-[2rem] transition-all hover:bg-theme-card-hover hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5">
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-theme-card border border-theme-border rounded-full flex items-center justify-center text-theme-secondary hover:text-red-500 transition-all shadow-sm"
                    aria-label={`Remove ${item.brand.name} from cart`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">
                        {item.brand.type} Series
                      </span>
                      <h4 className="text-lg font-black text-theme-primary">{item.brand.name}</h4>
                      <p className="text-[10px] font-bold text-theme-secondary uppercase tracking-[0.2em] mt-1">
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
            <div className="p-8 border-t border-theme-border bg-theme-input/50">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest block mb-1">Cart Subtotal</span>
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
