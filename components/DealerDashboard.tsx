
import React, { useState } from 'react';
import { LedgerEntry } from '../types';

interface Props {
  onBack: () => void;
}

const DealerDashboard: React.FC<Props> = ({ onBack }) => {
  const [ledger] = useState<LedgerEntry[]>([
    { date: '2024-05-18', order_id: 'ORD-9912', commission: 4500, tax_deducted: 225, net_payout: 4275, status: 'PAID' },
    { date: '2024-05-19', order_id: 'ORD-9915', commission: 3800, tax_deducted: 190, net_payout: 3610, status: 'PENDING' },
    { date: '2024-05-20', order_id: 'ORD-9921', commission: 5200, tax_deducted: 260, net_payout: 4940, status: 'PENDING' },
  ]);

  const totalCommission = ledger.reduce((acc, curr) => acc + curr.commission, 0);

  const downloadPDF = (id: string) => {
    alert(`Downloading Voucher for Order ${id}... (PDF Simulated)`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
           <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Partner Vault</h2>
             <p className="text-slate-500 text-sm">Transparency in every transaction.</p>
           </div>
           <button onClick={onBack} className="bg-white border border-slate-200 px-6 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
             EXIT TO RETAIL
           </button>
        </div>

        {/* Financial Tickers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">Available Commission</span>
              <div className="text-4xl font-black">₹{totalCommission.toLocaleString()}</div>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold">
                 <span className="bg-white/20 px-2 py-1 rounded">Next Payout: 1st June</span>
              </div>
           </div>
           <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Total TDS Deducted</span>
              <div className="text-4xl font-black text-slate-900">₹725</div>
              <p className="text-[10px] text-slate-400 mt-2">Section 194H Compliant</p>
           </div>
           <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem]">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 block">Target Bonus Pool</span>
              <div className="text-4xl font-black text-emerald-700">₹12,000</div>
              <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-4 overflow-hidden">
                 <div className="bg-emerald-600 h-full w-[65%]"></div>
              </div>
           </div>
        </div>

        {/* The Ledger */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden">
           <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Commission Ledger</h3>
              <button className="text-[10px] font-bold text-indigo-600 hover:underline">Download Annual Certificate</button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                       <th className="px-8 py-4">Date</th>
                       <th className="px-8 py-4">Order ID</th>
                       <th className="px-8 py-4">Gross Commission</th>
                       <th className="px-8 py-4">TDS (5%)</th>
                       <th className="px-8 py-4">Net Payout</th>
                       <th className="px-8 py-4">Voucher</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {ledger.map(entry => (
                       <tr key={entry.order_id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-6 text-sm font-medium text-slate-500">{entry.date}</td>
                          <td className="px-8 py-6">
                             <div className="text-sm font-bold text-slate-900">{entry.order_id}</div>
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${entry.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {entry.status}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-sm font-bold text-slate-900">₹{entry.commission}</td>
                          <td className="px-8 py-6 text-sm text-slate-400">-₹{entry.tax_deducted}</td>
                          <td className="px-8 py-6 text-sm font-black text-indigo-600">₹{entry.net_payout}</td>
                          <td className="px-8 py-6">
                             <button 
                                onClick={() => downloadPDF(entry.order_id)}
                                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all"
                             >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
