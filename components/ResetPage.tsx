import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../src/contexts/SessionContext";

export default function ResetPage() {
  const { clearSession } = useSession();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleReset = async () => {
    setIsClearing(true);
    setMessage("Clearing all session data...");
    try {
      await clearSession();
      setMessage("✅ Session cleared successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      setMessage("❌ Error clearing session: " + (error as Error).message);
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            Session Reset
          </h1>
          <p className="text-slate-400 text-center mb-6">
            This will clear all stored session data and cookies. You'll need to
            log in again.
          </p>

          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">
              ⚠️ <strong>Warning:</strong> This action will clear all
              authentication data from your browser.
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg mb-6 text-center font-semibold ${
                message.includes("✅")
                  ? "bg-green-900/20 text-green-300 border border-green-700/50"
                  : message.includes("❌")
                    ? "bg-red-900/20 text-red-300 border border-red-700/50"
                    : "bg-blue-900/20 text-blue-300 border border-blue-700/50"
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleReset}
            disabled={isClearing}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all mb-3 ${
              isClearing
                ? "bg-slate-600 cursor-not-allowed opacity-50"
                : "bg-red-600 hover:bg-red-700 active:scale-95"
            }`}
          >
            {isClearing ? "🔄 Clearing..." : "🗑️ Clear All Data"}
          </button>

          <button
            onClick={() => navigate("/login")}
            disabled={isClearing}
            className="w-full py-3 rounded-lg font-bold text-slate-300 border border-slate-600 hover:border-slate-500 hover:text-white transition-all"
          >
            Go to Login
          </button>
        </div>

        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-sm font-bold text-slate-300 mb-2">Debug Info</h3>
          <code className="text-xs text-slate-400 block p-2 bg-slate-900 rounded border border-slate-700">
            All Supabase, auth, and session data will be removed.
          </code>
        </div>
      </div>
    </div>
  );
}
