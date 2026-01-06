
import React, { useState } from 'react';
import { BrandMetadata, UserRole } from '../types';

interface Props {
  brand: BrandMetadata;
  userRole: UserRole;
  onBack: () => void;
}

const ProductDetailPage: React.FC<Props> = ({ brand, userRole, onBack }) => {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'CHECKING' | 'SUCCESS'>('IDLE');

  const retailPrice = 34500;
  const dealerPrice = 25800;

  const handlePincodeCheck = () => {
    setStatus('CHECKING');
    setTimeout(() => setStatus('SUCCESS'), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Left: Product Media */}
        <div className="space-y-12">
          <div className="bg-[#F2F4F7] rounded-[3rem] p-12 aspect-square flex flex-col items-center justify-center relative group">
            <h2 className="text-4xl font-black text-slate-800 opacity-20 group-hover:opacity-40 transition-opacity absolute top-12 left-12">{brand.name}</h2>
            
            {/* Cross Section View Mockup */}
            <div className="w-full max-w-sm space-y-2">
               <div className="h-6 bg-white rounded-t-xl border-x border-t border-slate-200 shadow-sm flex items-center justify-center">
                 <span className="text-[8px] font-bold text-slate-300">COOLING FABRIC</span>
               </div>
               <div className="h-20 bg-indigo-100/50 border-x border-slate-200 flex items-center justify-center">
                 <span className="text-[8px] font-bold text-indigo-400">SIGNATURE MEMORY FOAM</span>
               </div>
               <div className="h-32 bg-slate-200/50 border-x border-slate-200 rounded-b-xl flex items-center justify-center relative overflow-hidden">
                 <span className="text-[8px] font-bold text-slate-400">HIGH RESILIENCE BASE</span>
                 <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,_transparent,_transparent_20px,_#000_20px,_#000_22px)]"></div>
               </div>
            </div>

            <div className="mt-12 text-center">
              <span className="inline-block bg-white px-4 py-2 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm border border-slate-100">
                Triple Layer Architecture
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             {[1,2,3].map(i => (
               <div key={i} className="aspect-square bg-slate-50 rounded-3xl border border-slate-100"></div>
             ))}
          </div>
        </div>

        {/* Right: Purchase Info */}
        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded">BESTSELLER</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <svg key={s} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
              <span className="text-xs text-slate-400 font-bold">(4.9/5)</span>
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{brand.name}</h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Experience the pinnacle of sleep engineering. The {brand.name} series features our proprietary transition foam technology that adapts instantly to your body heat and posture.
            </p>
          </div>

          {/* Pricing Highlight */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Selected Configuration</span>
              {userRole === UserRole.DEALER ? (
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-slate-900">₹{dealerPrice.toLocaleString()}</span>
                  <span className="text-xl text-slate-300 line-through mb-1">₹{retailPrice.toLocaleString()}</span>
                  <span className="text-xs text-emerald-500 font-bold mb-2">DEALER NET</span>
                </div>
              ) : (
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-slate-900">₹{retailPrice.toLocaleString()}</span>
                  <span className="text-xs text-indigo-600 font-bold mb-2">MRP (Incl. All Taxes)</span>
                </div>
              )}
            </div>
          </div>

          {/* Pincode Checker */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Delivery Check</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-400"
              />
              <button 
                onClick={handlePincodeCheck}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                {status === 'CHECKING' ? 'Checking...' : status === 'SUCCESS' ? 'Serviceable ✓' : 'Check'}
              </button>
            </div>
            {status === 'SUCCESS' && <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider px-2">Guaranteed Delivery within 48 Hours</p>}
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-indigo-600 text-white py-6 rounded-[2rem] font-extrabold text-lg shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all">
              Add to Wishlist
            </button>
            <button className="flex-1 bg-slate-900 text-white py-6 rounded-[2rem] font-extrabold text-lg hover:bg-black hover:scale-[1.02] transition-all">
              Buy Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
