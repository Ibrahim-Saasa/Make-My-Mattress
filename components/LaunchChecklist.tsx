
import React, { useState } from 'react';

const LaunchChecklist: React.FC = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const tasks = [
    { id: 'w1_1', week: 1, title: 'Edge Case Testing', desc: 'Stress test PricingEngine with dimensions 1x1 and 999x999.' },
    { id: 'w1_2', week: 1, title: 'GST Validation', desc: 'Test Dealer login with invalid/expired GST patterns.' },
    { id: 'w2_1', week: 2, title: 'WhatsApp Outreach', desc: 'Send "Wholesale Portal" invitation to top 50 dealers.' },
    { id: 'w3_1', week: 3, title: 'Friends & Family', desc: 'Deploy beta build to 20 trusted internal users.' },
    { id: 'w4_1', week: 4, title: 'Live Payment Mode', desc: 'Switch Razorpay/PayU from TEST to LIVE keys.' },
  ];

  const toggle = (id: string) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompleted(next);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 mt-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Operation Bedrock</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">90-Day Roadmap Tracker</p>
        </div>
        <div className="text-right">
           <span className="text-3xl font-black text-brand-amber">
              {Math.round((completed.size / tasks.length) * 100)}%
           </span>
           <p className="text-[10px] text-slate-500 font-bold uppercase">Launch Readiness</p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => toggle(task.id)}
            className={`flex items-center gap-6 p-6 rounded-3xl border cursor-pointer transition-all ${
              completed.has(task.id) ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              completed.has(task.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
            }`}>
              {completed.has(task.id) && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Week {task.week}</span>
                <h4 className={`text-sm font-bold ${completed.has(task.id) ? 'text-slate-400 line-through' : 'text-white'}`}>{task.title}</h4>
              </div>
              <p className="text-xs text-slate-500">{task.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* WhatsApp Template CMO Refinement */}
      <div className="mt-10 p-6 bg-brand-navy rounded-2xl border border-indigo-500/30">
        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">WhatsApp Outreach Template</h4>
        <p className="text-xs text-indigo-100 leading-relaxed italic">
          "Namaste [Dealer Name]! Hindustan Mattress Co. is going digital. Download 'Make My Mattress' now for instant wholesale pricing, GST ready-invoices, and exclusive B2B stock. Use Code: HMCTRADE24. Download: [Link]"
        </p>
      </div>
    </div>
  );
};

export default LaunchChecklist;
