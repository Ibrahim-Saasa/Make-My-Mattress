
import React, { useState, useMemo, useEffect } from 'react';
import { BrandMetadata, UserRole, MattressParams, PricingResult } from '../types';
import { LENGTHS, BREADTHS, THICKNESS_STEPS } from '../constants';
import { calculateMattressPrice } from '../services/pricingEngine';
import { calculateLogistics, fetchRelatedProducts } from '../services/logisticsEngine';
import { FinancialEngine } from '../services/financialEngine';

interface Props {
  brand: BrandMetadata;
  userRole: UserRole;
  onNext: (params: MattressParams, pricing: PricingResult) => void;
  onBack: () => void;
  onBookService: () => void;
}

const SmartConfigurator: React.FC<Props> = ({ brand, userRole, onNext, onBack, onBookService }) => {
  const [params, setParams] = useState<MattressParams>({
    length: 72,
    breadth: 36,
    thickness: 6,
    materialRate: brand.baseRate,
    userType: userRole,
    demandLevel: 'NORMAL'
  });

  const [isCustomModalOpen, setCustomModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState({ l: '', b: '' });
  const [validationError, setValidationError] = useState<string | null>(null);

  const triggerHaptic = (impact: 'light' | 'medium') => {
    if (navigator.vibrate) {
      navigator.vibrate(impact === 'light' ? 10 : 25);
    }
  };

  const results = useMemo(() => {
    try {
      setValidationError(null);
      return calculateMattressPrice(params);
    } catch (e: any) {
      setValidationError(e.message);
      return null;
    }
  }, [params]);

  const logistics = useMemo(() => calculateLogistics(params.length, params.breadth, params.thickness), [params]);
  const upsells = useMemo(() => fetchRelatedProducts(params.length, params.breadth), [params.length, params.breadth]);

  const handleCustomSize = () => {
    const l = parseFloat(customInput.l);
    const b = parseFloat(customInput.b);
    
    if (l < 12 || b < 12) {
      setValidationError("Minimum 12x12 inches required.");
      return;
    }

    setParams({ ...params, length: l, breadth: b });
    setCustomModalOpen(false);
    triggerHaptic('medium');
  };

  const handleAddToCartAction = () => {
    if (results) {
      onNext(params, results);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Half: Visual Anchor */}
      <div className="h-1/2 bg-slate-50 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
        <button onClick={onBack} className="absolute top-6 left-6 z-20 text-slate-400 hover:text-indigo-600 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="relative w-full max-w-md transition-all duration-700 ease-out" style={{ perspective: '1200px' }}>
          <div 
            className="bg-white rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative transition-all duration-500"
            style={{ 
              height: `${params.thickness * 18}px`,
              width: `${Math.min((params.breadth / 84) * 100, 100)}%`,
              margin: '0 auto',
              transform: 'rotateX(55deg) rotateZ(-45deg)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            }}
          >
             <div className="absolute inset-0 border border-slate-100/50 rounded-2xl"></div>
             <div className="absolute top-4 left-4 text-[10px] font-black text-indigo-200 tracking-[0.3em] uppercase">Hindustan Mattress Co</div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8">
           <div className="flex items-center gap-2 mb-1">
             <span className="text-4xl font-black text-slate-900 tracking-tighter">{params.length}" × {params.breadth}"</span>
             {logistics.is_cargo && <span className="bg-amber-100 text-brand-amber text-[8px] font-bold px-2 py-1 rounded">HEAVY CARGO</span>}
           </div>
           <p className="text-indigo-600 font-bold tracking-widest text-[10px] uppercase">{brand.name} | {params.thickness}" SIGNATURE PROFILE</p>
        </div>
      </div>

      {/* Bottom Half: Control Center */}
      <div className="h-1/2 overflow-y-auto p-8 space-y-10 pb-40">
        
        {validationError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-xs font-bold animate-pulse">
            Error: {validationError}
          </div>
        )}

        <section>
          <div className="flex justify-between items-end mb-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comfort Profile</label>
            <span className="text-[10px] font-bold text-indigo-500">Thickness Variation</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
            {THICKNESS_STEPS.map(t => (
              <button 
                key={t}
                onClick={() => { setParams({...params, thickness: t}); triggerHaptic('light'); }}
                className={`flex-shrink-0 w-24 py-6 rounded-3xl font-bold transition-all border snap-center ${
                  params.thickness === t 
                  ? 'bg-brand-navy text-white border-brand-navy shadow-xl' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'
                }`}
              >
                <span className="text-2xl block">{t}"</span>
                <span className="text-[8px] opacity-60 uppercase">{t < 6 ? 'Basic' : t < 8 ? 'Premium' : 'Royal'}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Frame Length</label>
            <div className="flex flex-wrap gap-2">
              {LENGTHS.map(l => (
                <button 
                  key={l}
                  onClick={() => { setParams({...params, length: l}); triggerHaptic('light'); }}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
                    params.length === l ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {l}"
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Frame Breadth</label>
              <button 
                onClick={onBookService}
                className="text-[10px] font-bold text-indigo-600 hover:underline"
              >
                Book Expert Measurement
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {BREADTHS.map(b => (
                <button 
                  key={b}
                  onClick={() => { setParams({...params, breadth: b}); triggerHaptic('light'); }}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
                    params.breadth === b ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {b}"
                </button>
              ))}
              <button 
                onClick={() => setCustomModalOpen(true)}
                className="px-6 py-3 rounded-2xl text-sm font-bold transition-all border bg-brand-amber/10 text-brand-amber border-brand-amber/20 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Odd Size
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Footer (CMO-Amber Action) */}
      <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 p-6 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Estimated Total</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {results ? FinancialEngine.formatCurrency(results.final_price) : '---'}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {userRole === UserRole.DEALER ? 'Excl. GST' : 'All-Inclusive'}
              </span>
            </div>
          </div>
          <button 
            disabled={!!validationError}
            onClick={handleAddToCartAction}
            className="bg-brand-amber text-brand-navy px-12 py-5 rounded-[2rem] font-black text-sm hover:brightness-110 hover:shadow-2xl hover:shadow-amber-500/30 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-20"
          >
            ADD TO CART
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>

      {/* Custom Size Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm p-12 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Custom Build</h3>
            <p className="text-sm text-slate-500 mb-8">Pricing is calculated dynamically based on square-inch surface area.</p>
            <div className="space-y-4 mb-10">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Length (Inch)</label>
                <input 
                  type="number"
                  value={customInput.l}
                  onChange={e => setCustomInput({...customInput, l: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-bold focus:outline-none focus:border-indigo-600"
                  placeholder="72.5"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Breadth (Inch)</label>
                <input 
                  type="number"
                  value={customInput.b}
                  onChange={e => setCustomInput({...customInput, b: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-bold focus:outline-none focus:border-indigo-600"
                  placeholder="36.5"
                />
              </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setCustomModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-900">Cancel</button>
               <button onClick={handleCustomSize} className="flex-1 bg-brand-navy text-white rounded-2xl font-bold py-4 shadow-xl">Apply Specs</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartConfigurator;
