
import React, { useState } from 'react';
import { UserRole } from '../types';

interface Props {
  onSelectRole: (role: UserRole) => void;
}

const IdentityScreen: React.FC<Props> = ({ onSelectRole }) => {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [gst, setGst] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Brand Story & Visual Identity */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-brand-navy rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M4 18L10 18M4 14L14 14M4 10L20 10" strokeLinecap="round"/>
                </svg>
             </div>
             <span className="text-xl font-black tracking-tighter uppercase text-brand-navy">Make My Mattress</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-extrabold text-slate-900 leading-tight tracking-tighter">
              Bespoke Comfort. <br/>
              <span className="text-indigo-600">Factory Direct.</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-md">
              The world's first vertically integrated mattress ecosystem. Designed in Pune, delivered to your bedroom.
            </p>
          </div>
          
          <div className="flex items-center gap-4 py-4">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                ))}
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Trusted by <span className="text-slate-900">250+ Certified Dealers</span>
             </p>
          </div>

          <div className="pt-8 flex flex-col gap-3 items-start opacity-60 hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onSelectRole(UserRole.FACTORY_MANAGER)}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] hover:text-brand-navy transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Internal: Production Floor
            </button>
            <button 
              onClick={() => onSelectRole(UserRole.SUPER_ADMIN)}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Internal: The Capitol
            </button>
          </div>
        </div>

        {/* Right Side: Identity Cards (CMO Refined) */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 space-y-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Identity Verification</p>
          
          <button 
            onClick={() => onSelectRole(UserRole.END_USER)}
            className="w-full group p-8 rounded-3xl border border-slate-100 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all text-left bg-[#FBFCFE]"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">Homeowner</h3>
                <p className="text-slate-400 text-xs">Direct factory pricing & AI sleep analysis.</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
            </div>
          </button>

          <div className={`w-full bg-[#FBFCFE] rounded-3xl border transition-all duration-500 overflow-hidden ${selected === UserRole.DEALER ? 'border-brand-amber shadow-2xl shadow-amber-500/10' : 'border-slate-100'}`}>
            <button 
              onClick={() => setSelected(UserRole.DEALER)}
              className="w-full p-8 text-left group"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">Trade Partner</h3>
                  <p className="text-slate-400 text-xs">Wholesale portal, B2B tax credits & leads.</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selected === UserRole.DEALER ? 'bg-brand-amber text-white shadow-lg shadow-amber-500/30' : 'bg-white text-brand-amber shadow-sm'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
              </div>
            </button>
            
            <div className={`px-8 pb-8 transition-all duration-500 ${selected === UserRole.DEALER ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="h-px bg-slate-100 mb-6"></div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter GSTIN for B2B Access"
                  value={gst}
                  onChange={(e) => setGst(e.target.value.toUpperCase())}
                  className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-brand-amber transition-colors"
                />
                <button 
                  disabled={gst.length < 15}
                  onClick={() => onSelectRole(UserRole.DEALER)}
                  className="bg-brand-amber text-white px-8 py-4 rounded-2xl font-extrabold text-sm hover:brightness-110 disabled:opacity-30 transition-all shadow-lg shadow-amber-500/20"
                >
                  VERIFY
                </button>
              </div>
              <p className="text-[9px] text-slate-400 mt-3 italic text-center uppercase tracking-widest font-bold">Encrypted B2B Channel Session</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityScreen;
