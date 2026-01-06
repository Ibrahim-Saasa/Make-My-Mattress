
import React, { useState } from 'react';
import { ServiceType } from '../types';

interface Props {
  onSelect: (type: ServiceType) => void;
  onBack: () => void;
}

const ServiceHub: React.FC<Props> = ({ onSelect, onBack }) => {
  const [activeCamera, setActiveCamera] = useState<boolean>(false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Service Concierge</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { type: ServiceType.MEASURE, label: 'Sure-Fit Measurement', icon: 'M', color: 'indigo' },
          { type: ServiceType.REPAIR, label: 'Warranty Repair', icon: 'R', color: 'amber' },
          { type: ServiceType.DISPOSAL, label: 'Eco-Disposal', icon: 'D', color: 'emerald' }
        ].map(item => (
          <button 
            key={item.type}
            onClick={() => item.type === ServiceType.REPAIR ? setActiveCamera(true) : onSelect(item.type)}
            className="group relative bg-white border border-slate-100 p-8 rounded-[2.5rem] text-left hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center font-black text-xl mb-6 group-hover:bg-${item.color}-600 group-hover:text-white transition-all`}>
              {item.icon}
            </div>
            <h3 className="font-extrabold text-slate-900 mb-2">{item.label}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Book a certified technician for professional assistance.</p>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </button>
        ))}
      </div>

      {/* Repair Camera Overlay (Simulated) */}
      {activeCamera && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col p-8">
          <div className="flex justify-between items-center text-white mb-8">
             <div>
               <h4 className="font-bold">Report Defect</h4>
               <p className="text-[10px] text-slate-400">Align mattress with the ghost outline</p>
             </div>
             <button onClick={() => setActiveCamera(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          
          <div className="flex-1 border-4 border-white/20 rounded-[3rem] relative overflow-hidden flex items-center justify-center">
             {/* Ghost Outline */}
             <div className="w-4/5 h-2/3 border-2 border-dashed border-indigo-400/50 rounded-2xl relative">
                <div className="absolute inset-0 flex items-center justify-center text-indigo-400/30 font-black text-xs uppercase tracking-[0.5em] rotate-12">
                   Ghost Outline: Center Mattress
                </div>
             </div>
             <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none"></div>
          </div>

          <div className="py-12 flex justify-center">
             <button 
               onClick={() => { alert("Photo Captured! Admin will estimate repair cost."); setActiveCamera(false); }}
               className="w-20 h-20 bg-white rounded-full p-2 border-4 border-indigo-600"
             >
               <div className="w-full h-full bg-indigo-600 rounded-full"></div>
             </button>
          </div>
        </div>
      )}

      <div className="mt-12 bg-indigo-50/50 border border-indigo-100 p-8 rounded-[2.5rem] flex items-start gap-6">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
           <h4 className="font-bold text-slate-900 mb-1">Pricing Transparency</h4>
           <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
             A nominal ₹200 fee is collected for measurements. This amount is automatically adjusted (deducted) from your final mattress purchase price once dimensions are synced.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceHub;
