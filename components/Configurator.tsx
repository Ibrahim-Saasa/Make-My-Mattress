
import React, { useState, useMemo, useEffect } from 'react';
import { BrandMetadata, UserRole, MattressParams } from '../types';
import { LENGTHS, BREADTHS, THICKNESS_STEPS } from '../constants';
import { calculateMattressPrice } from '../services/pricingEngine';
import VisionExchange from './VisionExchange';

interface Props {
  brand: BrandMetadata;
  userRole: UserRole;
  onNext: () => void;
  onBack: () => void;
}

const Configurator: React.FC<Props> = ({ brand, userRole, onNext, onBack }) => {
  const [params, setParams] = useState<MattressParams>({
    length: 72,
    breadth: 36,
    thickness: 6,
    materialRate: brand.baseRate,
    userType: userRole,
    demandLevel: 'PEAK' // Simulating peak wedding season demand for demo
  });

  const [exchangeData, setExchangeData] = useState<{ size: string; condition: string; value: number } | null>(null);
  const [pricePulse, setPricePulse] = useState(false);

  const results = useMemo(() => calculateMattressPrice(params), [params]);

  const finalTotal = results.totalPrice - (exchangeData?.value || 0);

  useEffect(() => {
    setPricePulse(true);
    const timer = setTimeout(() => setPricePulse(false), 300);
    return () => clearTimeout(timer);
  }, [finalTotal]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-indigo-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Back to Hall</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Visual Preview */}
        <div className="lg:col-span-7 sticky top-32 space-y-8">
          <div className="bg-slate-50 rounded-[3rem] p-12 aspect-[4/3] flex items-center justify-center relative overflow-hidden group">
            {/* Perspective View of Mattress Block */}
            <div className="relative w-full max-w-sm transition-transform duration-700 hover:scale-105" style={{ perspective: '1000px' }}>
              <div 
                className="bg-white rounded-xl shadow-2xl transition-all duration-500 relative"
                style={{ 
                  height: `${params.thickness * 15}px`,
                  transform: 'rotateX(45deg) rotateZ(-45deg)',
                  boxShadow: '20px 20px 60px rgba(0,0,0,0.1)'
                }}
              >
                <div className="absolute inset-0 bg-indigo-50/20 rounded-xl border border-slate-100"></div>
                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-300 tracking-tighter opacity-50">
                   {brand.name.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 left-12">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Configuration</span>
              <h4 className="text-2xl font-extrabold text-slate-900">{params.length}" × {params.breadth}"</h4>
              <p className="text-indigo-600 font-bold">{params.thickness}" Signature Profile</p>
            </div>
          </div>

          {/* AI Vision Section */}
          <VisionExchange onResult={setExchangeData} />
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-extrabold text-slate-900">{brand.name}</h1>
              {results.surgeApplied && (
                <div className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12 10.607a1 1 0 010-1.414l.706-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                  WEDDING SEASON PRICING
                </div>
              )}
            </div>
            <p className="text-slate-500">{brand.description}</p>
          </div>

          <div className="space-y-8">
            <section>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">Core Thickness</label>
              <div className="flex gap-3">
                {THICKNESS_STEPS.map(t => (
                  <button 
                    key={t}
                    onClick={() => setParams({...params, thickness: t})}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${
                      params.thickness === t 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/20 scale-105' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    {t}"
                  </button>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 block">Length</label>
                <div className="relative">
                  <select 
                    value={params.length}
                    onChange={(e) => setParams({...params, length: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 appearance-none text-sm font-bold focus:outline-none"
                  >
                    {LENGTHS.map(l => <option key={l} value={l}>{l} Inches</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 block">Breadth</label>
                <div className="relative">
                  <select 
                    value={params.breadth}
                    onChange={(e) => setParams({...params, breadth: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 appearance-none text-sm font-bold focus:outline-none"
                  >
                    {BREADTHS.map(b => <option key={b} value={b}>{b} Inches</option>)}
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* AI Exchange Credit Feedback */}
          {exchangeData && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-emerald-600 uppercase">AI Exchange Value Applied</span>
                <span className="text-lg font-black text-emerald-600">-₹{exchangeData.value.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-emerald-500">
                AI detected a <span className="font-bold">{exchangeData.size}</span> mattress with <span className="font-bold">{exchangeData.condition}</span>.
              </p>
            </div>
          )}

          {/* Pricing Action Area */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 block">Payable Total</span>
                <div className={`text-4xl font-extrabold transition-all duration-300 ${pricePulse ? 'scale-110 text-emerald-400' : 'scale-100'}`}>
                   ₹{finalTotal.toLocaleString()}
                </div>
                {results.surgeApplied && (
                  <span className="text-[10px] text-amber-400 font-bold block mt-1 uppercase">+ ₹{results.surgeAmount.toLocaleString()} Peak Demand Surcharge</span>
                )}
              </div>
              <button 
                onClick={onNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-500/40"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
