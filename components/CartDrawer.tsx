
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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Your Empire Cart</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {items.length} {items.length === 1 ? 'Mattress' : 'Mattresses'} in build
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                   </svg>
                </div>
                <p className="text-sm font-bold uppercase tracking-widest">Cart is empty</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="relative group bg-slate-50 border border-slate-100 p-6 rounded-[2rem] transition-all hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5">
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all shadow-sm"
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
                      <h4 className="text-lg font-black text-slate-900">{item.brand.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                        {item.dimensions} INCHES
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">
                        {FinancialEngine.formatCurrency(item.pricing.final_price)}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                        {item.pricing.invoiceType}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {items.length > 0 && (
              <div className="pt-8">
                <div className="bg-brand-navy p-6 rounded-[2rem] text-white">
                  <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Empire Protection Add-on</h5>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold leading-tight">Waterproof Smart Protector</p>
                      <p className="text-[10px] text-indigo-300 mt-0.5">₹1,800 • Fitted for {items[0].dimensions.split('x').slice(0,2).join('x')}</p>
                    </div>
                    <button className="bg-brand-amber text-brand-navy text-[10px] font-black px-4 py-2 rounded-xl">ADD</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Cart Subtotal</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">
                    {FinancialEngine.formatCurrency(subtotal)}
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 text-right uppercase tracking-widest font-bold">
                  Excl. Shipping & Discounts
                </p>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98]"
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
