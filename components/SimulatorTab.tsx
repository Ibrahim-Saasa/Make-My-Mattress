
import React, { useState, useMemo } from 'react';
import { FinancialEngine } from '../services/financialEngine';
import { UserRole, MattressParams } from '../types';
import { BRANDS, LENGTHS, BREADTHS, THICKNESS_STEPS } from '../constants';

const SimulatorTab: React.FC = () => {
  const [params, setParams] = useState<MattressParams>({
    length: 72,
    breadth: 36,
    thickness: 6,
    materialRate: BRANDS[0].baseRate,
    userType: UserRole.END_USER,
    coupon_code: '',
    dealer_auth_code: 'DEALER_2024_PRO'
  });

  const currentBrand = BRANDS.find(b => b.baseRate === params.materialRate) || BRANDS[0];

  // Mocking product data for simulator
  const mockProduct = {
    mrp_inr: (params.length * params.breadth * (1 + (params.thickness-4)*0.12) * (params.materialRate || 0.85)) + 1800,
    dealer_price_inr: (params.length * params.breadth * (1 + (params.thickness-4)*0.12) * (params.materialRate || 0.85)) + 1200
  };

  const results = useMemo(() => {
    try {
      return FinancialEngine.calculateFinalPrice(params, mockProduct);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [params, mockProduct]);

  if (!results) return <div>Error loading pricing logic.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h4 className="text-lg font-semibold border-b border-slate-800 pb-2 text-indigo-400">Financial Configuration</h4>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Channel Type</label>
          <div className="flex gap-4">
            {[UserRole.END_USER, UserRole.DEALER].map(role => (
              <button
                key={role}
                onClick={() => setParams({ ...params, userType: role })}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                  params.userType === role 
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {role === UserRole.END_USER ? 'B2C Retail' : 'B2B Dealer'}
              </button>
            ))}
          </div>
        </div>

        {params.userType === UserRole.END_USER ? (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Coupon Code (Try FESTIVAL10)</label>
            <input 
              type="text" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              value={params.coupon_code}
              onChange={(e) => setParams({...params, coupon_code: e.target.value})}
              placeholder="Enter coupon..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Dealer Auth Code</label>
            <input 
              type="password" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              value={params.dealer_auth_code}
              onChange={(e) => setParams({...params, dealer_auth_code: e.target.value})}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Material Series</label>
            <select 
              value={params.materialRate}
              onChange={(e) => setParams({ ...params, materialRate: parseFloat(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              {BRANDS.map(b => (
                <option key={b.id} value={b.baseRate}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Thickness</label>
            <select 
              value={params.thickness}
              onChange={(e) => setParams({ ...params, thickness: parseInt(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              {THICKNESS_STEPS.map(t => (
                <option key={t} value={t}>{t} Inches</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Outputs */}
      <div className="bg-indigo-950/20 p-8 rounded-2xl border border-indigo-500/30 flex flex-col justify-between relative overflow-hidden">
        <div>
          <h4 className="text-lg font-semibold text-indigo-300 mb-6 uppercase tracking-wider">
            {results.invoiceType === 'B2B_GST' ? 'Tax Invoice Preview' : 'Retail Summary'}
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-slate-400">
              <span>{results.invoiceType === 'B2B_GST' ? 'Net Taxable Value' : 'Item MRP (Inclusive)'}</span>
              <span className="font-mono text-slate-200 font-bold">₹{results.tax_breakdown.base.toLocaleString()}</span>
            </div>
            
            {results.invoiceType === 'B2B_GST' ? (
              <>
                <div className="flex justify-between items-center text-slate-400">
                  <span>CGST (9%)</span>
                  <span className="font-mono text-slate-200">₹{results.tax_breakdown.cgst?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>SGST (9%)</span>
                  <span className="font-mono text-slate-200">₹{results.tax_breakdown.sgst?.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center text-slate-400">
                <span>Internal Tax Component</span>
                <span className="font-mono text-slate-400 text-xs">₹{results.tax_breakdown.gst_total.toLocaleString()}</span>
              </div>
            )}
            
            <div className="h-px bg-indigo-500/30 my-4"></div>
            
            <div className="flex justify-between items-end">
              <div>
                <span className="block text-xs text-indigo-400 uppercase font-bold mb-1">Total Payable</span>
                <span className="text-4xl font-extrabold text-white">₹{results.final_price.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 mb-1">HSN CODE: {results.tax_breakdown.hsn_code}</span>
                <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold ${results.invoiceType === 'B2B_GST' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-blue-500/20 text-blue-500 border border-blue-500/50'}`}>
                  {results.invoiceType}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs italic text-slate-400">
          Note: B2B prices are calculated exclusive of tax and split into CGST/SGST. Retail prices are inclusive and follow seasonal discount patterns.
        </div>
      </div>
    </div>
  );
};

export default SimulatorTab;
