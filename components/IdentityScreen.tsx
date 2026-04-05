import React, { useState } from "react";
import { UserRole } from "../types";
import { BrandLogo } from "./UI";

interface Props {
  onSelectRole: (role: UserRole) => void;
}

const IdentityScreen: React.FC<Props> = ({ onSelectRole }) => {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [gst, setGst] = useState("");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden antialiased font-sans text-slate-100"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(255,255,255,0.12), transparent 22%), radial-gradient(circle at bottom right, rgba(92,128,255,0.22), transparent 28%), linear-gradient(140deg, #07153F 0%, #0C2E89 42%, #1740D1 100%)",
      }}
    >
      {/* Subtle radial shine */}
      <div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side at 15% 15%, rgba(255,255,255,0.16), rgba(255,255,255,0) 42%)",
        }}
      />
      <div
        className="absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side at 85% 85%, rgba(112,149,255,0.25), rgba(255,255,255,0) 36%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,15,44,0.08)_0%,rgba(6,15,44,0.2)_100%)] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <BrandLogo
              showWordmark={false}
              size="xl"
              layout="stacked"
              className="gap-4"
            />
          </div>
          <div>
            <h1 className="brand-header text-2xl font-extrabold text-white">
              Welcome to Make My Mattress
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#D4DDFF]">
              How would you like to get started?
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <button
            onClick={() => onSelectRole(UserRole.END_USER)}
            className="w-full group p-6 rounded-2xl border border-[rgba(141,161,240,0.18)] bg-[#121C3B] hover:bg-[#1A2A4A] transition-all text-left shadow-[0_8px_32px_rgba(7,18,56,0.25)]"
            style={{
              background:
                "linear-gradient(180deg, rgba(13, 24, 58, 0.98) 0%, rgba(18, 28, 59, 0.98) 100%)",
              borderColor: "rgba(127, 156, 255, 0.22)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  I'm a Customer
                </h3>
                <p className="text-sm text-[#D4DDFF]">
                  Browse mattresses and get AI recommendations
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </button>

          <div className="relative">
            <button
              onClick={() => setSelected(UserRole.DEALER)}
              className={`w-full group p-6 rounded-2xl border transition-all text-left shadow-[0_8px_32px_rgba(7,18,56,0.25)] ${
                selected === UserRole.DEALER
                  ? "border-amber-400/50"
                  : "border-[rgba(141,161,240,0.18)]"
              }`}
              style={{
                background:
                  selected === UserRole.DEALER
                    ? "linear-gradient(180deg, rgba(120, 53, 15, 0.3) 0%, rgba(101, 67, 33, 0.3) 100%)"
                    : "linear-gradient(180deg, rgba(13, 24, 58, 0.98) 0%, rgba(18, 28, 59, 0.98) 100%)",
                borderColor:
                  selected === UserRole.DEALER
                    ? "rgba(251, 191, 36, 0.5)"
                    : "rgba(127, 156, 255, 0.22)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    I'm a Trade Partner
                  </h3>
                  <p className="text-sm text-[#D4DDFF]">
                    Access wholesale portal and B2B features
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                    selected === UserRole.DEALER
                      ? "bg-amber-400/20"
                      : "bg-white/10"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </button>

            {/* GST Input */}
            <div
              className={`mt-4 transition-all duration-300 overflow-hidden ${
                selected === UserRole.DEALER
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#EAF0FF]">
                  GSTIN for B2B Access
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your 15-digit GSTIN"
                    value={gst}
                    onChange={(e) => setGst(e.target.value.toUpperCase())}
                    className="flex-1 h-12 px-4 rounded-2xl border border-[#8FA4E8] bg-[#253250] text-white placeholder-[#91A1C8] focus:border-white focus:outline-none transition-colors"
                  />
                  <button
                    disabled={gst.length < 15}
                    onClick={() => onSelectRole(UserRole.DEALER)}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-2xl transition-all shadow-lg"
                  >
                    VERIFY
                  </button>
                </div>
                <p className="text-xs text-[#B7C7F2] text-center">
                  Required for wholesale partner verification
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-[#9FB0DA]">
            Questions about your role?{" "}
            <button className="text-[#DDE6FF] hover:text-white hover:underline font-semibold">
              Contact Support
            </button>
          </p>
          <p className="text-xs text-[#8D9EC6]">
            By continuing, you agree to our{" "}
            <button className="text-[#DDE6FF] hover:text-white hover:underline">
              Terms
            </button>
            {" & "}
            <button className="text-[#DDE6FF] hover:text-white hover:underline">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdentityScreen;
