
import React, { useState } from 'react';
import { ServiceRequest, RequestStatus, ServiceType, Cart } from '../types';
import { ServiceConcierge } from '../services/serviceConcierge';

interface Props {
  onBack: () => void;
}

const TechnicianPortal: React.FC<Props> = ({ onBack }) => {
  const [activeJob, setActiveJob] = useState<ServiceRequest | null>(null);
  const [dims, setDims] = useState({ l: '', b: '' });
  const [syncing, setSyncing] = useState(false);

  const mockJobs: ServiceRequest[] = [
    { 
      request_id: 'SR-7721', 
      user_id: 'USR-88', 
      service_type: ServiceType.MEASURE, 
      status: RequestStatus.ASSIGNED, 
      scheduled_date: '2024-05-20', 
      time_slot: '10:00 AM', 
      service_fee: 200, 
      is_fee_adjusted: false, 
      payment_transaction_id: 'TXN-1', 
      sac_code: '9983' 
    }
  ];

  const handleSync = async () => {
    if (!activeJob) return;
    setSyncing(true);
    
    // Simulating the Sync Call
    const mockCart: Cart = { user_id: activeJob.user_id, items: [{ product_id: 'p1', length: 0, breadth: 0, thickness: 6, is_custom: false }], applied_service_credit: 0 };
    await ServiceConcierge.submitDimensions(activeJob.request_id, parseFloat(dims.l), parseFloat(dims.b), mockCart);
    
    setTimeout(() => {
      setSyncing(false);
      alert("SYNC SUCCESSFUL: Dimensions pushed to User Cart.");
      setActiveJob(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-12">
           <h2 className="text-2xl font-black tracking-tighter uppercase italic">Dealer Tech Port</h2>
           <button onClick={onBack} className="text-xs font-bold text-slate-500 hover:text-white">Exit Portal</button>
        </div>

        {!activeJob ? (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Pending Assignments</h3>
            {mockJobs.map(job => (
              <button 
                key={job.request_id}
                onClick={() => setActiveJob(job)}
                className="w-full bg-slate-800 border border-slate-700 p-6 rounded-3xl text-left hover:border-indigo-500 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Standard Measure</span>
                    <h4 className="text-xl font-bold">Ref: {job.request_id}</h4>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded">₹{job.service_fee} PAID</div>
                </div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {job.scheduled_date}</span>
                  <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {job.time_slot}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 p-10 rounded-[2.5rem] space-y-8 animate-in slide-in-from-bottom duration-500">
             <div>
                <h3 className="text-3xl font-black">Input Measurements</h3>
                <p className="text-xs text-slate-400 mt-2 italic">Verify bed frame with digital tape before syncing.</p>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Length (Inches)</label>
                  <input 
                    type="number"
                    value={dims.l}
                    onChange={e => setDims({...dims, l: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 font-black text-2xl text-indigo-400 focus:outline-none focus:border-indigo-500"
                    placeholder="00"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Breadth (Inches)</label>
                  <input 
                    type="number"
                    value={dims.b}
                    onChange={e => setDims({...dims, b: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 font-black text-2xl text-indigo-400 focus:outline-none focus:border-indigo-500"
                    placeholder="00"
                  />
                </div>
             </div>

             <div className="pt-6 space-y-3">
                <button 
                  onClick={handleSync}
                  disabled={!dims.l || !dims.b || syncing}
                  className="w-full bg-indigo-600 py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {syncing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : 'SYNC TO CUSTOMER'}
                </button>
                <button onClick={() => setActiveJob(null)} className="w-full py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Discard Entry</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianPortal;
