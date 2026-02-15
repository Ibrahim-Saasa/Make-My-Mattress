import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../src/contexts/SessionContext";
import { AdminEngine } from "../services/adminEngine";
import { BulkPricingUploader } from "../services/bulkPricingUploader";
import { OrderAnalytics, ProductionStage } from "../types";
import LaunchChecklist from "./LaunchChecklist";

const AdminCapitol: React.FC = () => {
  const [stats, setStats] = useState<OrderAnalytics | null>(null);
  const [isArmoryOpen, setIsArmoryOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    processed: number;
    time_ms: number;
  } | null>(null);
  const navigate = useNavigate();
  const { clearSession } = useSession();

  useEffect(() => {
    AdminEngine.getDashboardStats().then(setStats);
  }, []);

  const simulateUpload = async () => {
    const mockCSV =
      "sku,product_id,mrp,dealer_price\nSS-72-36-6,brand_1,24000,18000\nSW-75-60-8,brand_2,45000,32000";
    const result = await BulkPricingUploader.processPricingCSV(mockCSV);
    setUploadStatus(result);
    setTimeout(() => {
      setIsArmoryOpen(false);
      setUploadStatus(null);
    }, 3000);
  };

  if (!stats)
    return <div className="p-12 text-theme-secondary">Loading War Room...</div>;

  return (
    <div className="min-h-screen bg-theme-background text-theme-primary p-8 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-theme-border pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-theme-primary">
            The Capitol <span className="text-indigo-500 italic">Command</span>
          </h1>
          <p className="text-xs font-bold text-theme-tertiary tracking-[0.3em] uppercase mt-1">
            Hindustan Mattress Co. Global View
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-theme-card px-6 py-3 rounded-xl text-xs font-bold text-theme-secondary hover:bg-indigo-600 hover:text-white transition-all">
            SYSTEM HEALTH: OPTIMAL
          </button>
          <button
            onClick={() => setIsArmoryOpen(true)}
            className="bg-brand-amber px-6 py-3 rounded-xl text-xs font-bold text-black shadow-lg shadow-amber-500/20"
          >
            OPEN ARMORY UPLOADER
          </button>
          <button
            onClick={async () => {
              try {
                await clearSession();
              } catch (err) {
                console.error("Error clearing session on logout:", err);
              }
              navigate("/login", { replace: true });
            }}
            className="bg-rose-600 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-rose-700 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* War Room Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-theme-card border border-theme-border p-8 rounded-3xl">
          <span className="text-[10px] font-bold text-theme-tertiary uppercase tracking-widest block mb-4">
            Total Revenue Today
          </span>
          <div className="text-4xl font-black text-theme-primary">
            ₹{(stats.revenue_today / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-emerald-500 font-bold mt-2">
            +14% vs Yesterday
          </div>
        </div>
        <div className="bg-theme-card border border-theme-border p-8 rounded-3xl">
          <span className="text-[10px] font-bold text-theme-tertiary uppercase tracking-widest block mb-4">
            Pending Production
          </span>
          <div className="text-4xl font-black text-theme-primary">
            {stats.pipeline[ProductionStage.NEW] +
              stats.pipeline[ProductionStage.CUTTING] +
              stats.pipeline[ProductionStage.STITCHING]}
          </div>
          <div className="text-xs text-amber-500 font-bold mt-2">
            Active Factory Load
          </div>
        </div>
        <div className="col-span-2 bg-theme-card border border-theme-border p-8 rounded-3xl overflow-hidden relative">
          <div className="flex justify-between items-end h-full">
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-theme-tertiary uppercase tracking-widest block mb-4">
                Demand Hotspots
              </span>
              <div className="space-y-4">
                {stats.hotspots.map((h) => (
                  <div key={h.city} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    <span className="text-theme-primary font-bold text-sm">
                      {h.city}
                    </span>
                    <span className="text-[10px] text-theme-tertiary uppercase">
                      {h.count} Orders
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-theme-card border border-theme-border rounded-3xl p-10">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
            Production Velocity
          </h3>
          <div className="space-y-6">
            {Object.entries(stats.pipeline).map(([stage, count]) => (
              <div
                key={stage}
                className="flex items-center justify-between group"
              >
                <span className="text-[10px] font-bold text-theme-tertiary uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                  {stage}
                </span>
                <div className="flex-1 mx-8 h-1.5 bg-theme-input border-theme-input rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000"
                    style={{ width: `${((count as number) / 150) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-black text-theme-primary">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900/5 border border-indigo-500/10 rounded-3xl p-10 flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-theme-input rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-theme-primary mb-2 uppercase tracking-tighter">
            Tax & Compliance Hub
          </h3>
          <p className="text-xs text-theme-tertiary mb-8 max-w-xs mx-auto">
            Export GSTR-1, GSTR-3B, and dealer commission ledger for the current
            fiscal period.
          </p>
          <button
            onClick={async () => {
              const csv = await AdminEngine.generateGSTReport(5, 2024);
              alert("GSTR-1 Data Generated. Ready for filing.");
            }}
            className="bg-indigo-600/10 border border-indigo-600/30 text-indigo-400 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
          >
            GENERATE GST REPORT
          </button>
        </div>
      </div>

      {/* Launch Strategy Tracker */}
      <LaunchChecklist />

      {/* Armory Modal */}
      {isArmoryOpen && (
        <div className="fixed inset-0 bg-theme-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-theme-card border border-theme-border w-full max-w-lg p-12 rounded-[3rem] shadow-theme-2xl relative">
            <button
              onClick={() => setIsArmoryOpen(false)}
              className="absolute top-8 right-8 text-theme-tertiary hover:text-theme-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-brand-amber rounded-[2rem] flex items-center justify-center text-black mx-auto mb-6 shadow-2xl shadow-amber-500/40">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-theme-primary uppercase tracking-tighter italic">
                Armory <span className="text-brand-amber">Uploader</span>
              </h2>
              <p className="text-xs text-theme-tertiary mt-2 italic">
                Batch update 5,000+ variants in sub-2 seconds.
              </p>
            </div>

            {!uploadStatus ? (
              <div
                onClick={simulateUpload}
                className="border-2 border-dashed border-theme-border rounded-[2rem] p-12 text-center cursor-pointer hover:border-brand-amber hover:bg-amber-500/5 transition-all group"
              >
                <span className="text-xs font-bold text-theme-tertiary group-hover:text-brand-amber">
                  DROP MASTER_PRICING.CSV HERE
                </span>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="text-4xl font-black text-brand-amber animate-pulse">
                  SUCCESS
                </div>
                <p className="text-sm font-bold text-theme-primary">
                  Processed {uploadStatus.processed} variants in{" "}
                  {uploadStatus.time_ms}ms
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCapitol;
