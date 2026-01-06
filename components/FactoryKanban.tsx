import React, { useState } from 'react';
import { ProductionStage } from '../types';
import { ProductionEngine } from '../services/productionEngine';

const FactoryKanban: React.FC = () => {
  const [orders, setOrders] = useState([
    { id: 'ORD-1201', model: 'Slumbersoft (King)', stage: ProductionStage.NEW },
    { id: 'ORD-1202', model: 'Sleepworks (Queen)', stage: ProductionStage.CUTTING },
    { id: 'ORD-1203', model: 'Spinowell (Single)', stage: ProductionStage.STITCHING },
    { id: 'ORD-1204', model: 'SleepGenie (Double)', stage: ProductionStage.NEW },
    { id: 'ORD-1205', model: 'Slumbersoft (Single)', stage: ProductionStage.CUTTING },
  ]);

  const moveOrder = async (orderId: string, newStage: ProductionStage) => {
    await ProductionEngine.updateProductionStage(orderId, newStage, 'OP_42');
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, stage: newStage } : o));
  };

  const columns = [
    { id: ProductionStage.NEW, label: 'NEW ORDERS', color: 'indigo' },
    { id: ProductionStage.CUTTING, label: 'FOAM CUTTING', color: 'amber' },
    { id: ProductionStage.STITCHING, label: 'STITCHING', color: 'blue' },
    { id: ProductionStage.QC_PASSED, label: 'QUALITY CONTROL', color: 'emerald' }
  ];

  return (
    <div className="min-h-screen bg-theme-background p-8 flex flex-col h-screen overflow-hidden text-theme-primary">
      <div className="flex justify-between items-center mb-8 flex-shrink-0">
        <div>
          <h2 className="text-4xl font-black text-theme-primary tracking-tighter italic uppercase">Shop Floor <span className="text-amber-500">Live</span></h2>
          <p className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mt-1">Hindustan Mattress Co. Production Line</p>
        </div>
        <div className="flex items-center gap-4 text-theme-secondary text-[10px] font-bold uppercase tracking-widest bg-theme-input px-4 py-2 rounded-xl">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
           Active Terminal #F1
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto flex-1 pb-4 snap-x">
        {columns.map(col => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col snap-start">
            <div className={`flex items-center justify-between border-b-4 border-${col.color}-500/30 pb-4 mb-6`}>
              <h3 className="text-xs font-black text-theme-secondary uppercase tracking-[0.2em]">{col.label}</h3>
              <span className={`bg-${col.color}-500/10 text-${col.color}-500 text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                {orders.filter(o => o.stage === col.id).length}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
              {orders.filter(o => o.stage === col.id).map(order => (
                <div 
                  key={order.id} 
                  className="bg-theme-card p-6 rounded-[2rem] border border-theme-border shadow-xl active:scale-95 transition-all group relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>
                   
                   <div className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-1">{order.id}</div>
                   <h4 className="text-lg font-black text-theme-primary mb-6 leading-tight">{order.model}</h4>
                   
                   <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const nextIdx = columns.findIndex(c => c.id === col.id) + 1;
                          if (nextIdx < columns.length) moveOrder(order.id, columns[nextIdx].id);
                          else moveOrder(order.id, ProductionStage.DISPATCHED);
                        }}
                        className={`flex-1 bg-${col.color}-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2`}
                      >
                        NEXT STAGE
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </button>
                   </div>
                </div>
              ))}
              {orders.filter(o => o.stage === col.id).length === 0 && (
                <div className="h-full border-2 border-dashed border-theme-border rounded-[2rem] flex items-center justify-center text-[10px] font-bold text-theme-tertiary uppercase tracking-widest">
                   No Active Load
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactoryKanban;