import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../src/contexts/SessionContext";
import { UserRole } from "../types";

type AdminLoginStep = "EMAIL_PASSWORD" | "LOADING" | "CHECKING_ROLE";

const AdminLoginScreen: React.FC = () => {
  const { supabase } = useSession();
  const navigate = useNavigate();

  const [step, setStep] = useState<AdminLoginStep>("EMAIL_PASSWORD");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setStep("LOADING");

    try {
      // Sign in with email and password
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      if (!data.user) {
        throw new Error("No user data returned");
      }

      // Check if user has admin role
      setStep("CHECKING_ROLE");
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        throw new Error("Could not verify admin status");
      }

      const adminProfile = profileData as { role: string } | null;

      // Verify user is SUPER_ADMIN
      if (!adminProfile || adminProfile.role !== UserRole.SUPER_ADMIN) {
        // Sign out the user immediately
        await supabase.auth.signOut();
        setIsLoading(false);
        setStep("EMAIL_PASSWORD");
        setError("Access denied. Admin credentials required.");
        return;
      }

      // Admin authenticated successfully - redirect to admin dashboard
      navigate("/admin-capitol", { replace: true });
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
      setIsLoading(false);
      setStep("EMAIL_PASSWORD");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-red-600/40 transform -rotate-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">
            Admin Capitol
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
            Executive Access Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-[2.5rem] p-10 shadow-2xl">
          {step === "EMAIL_PASSWORD" ? (
            <form onSubmit={handleAdminLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  disabled={isLoading}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-2xl px-5 py-4 text-white placeholder-slate-500 text-sm font-bold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all disabled:opacity-50"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-2xl px-5 py-4 text-white placeholder-slate-500 text-sm font-bold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all disabled:opacity-50"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm font-bold text-center animate-in fade-in">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-600/40 hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Authenticating..." : "Enter Capitol"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-slate-600"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  or
                </span>
                <div className="flex-1 h-px bg-slate-600"></div>
              </div>

              {/* Regular Login Link */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all text-center"
              >
                Back to User Login
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-red-600/30 rounded-full animate-pulse"></div>
                <div
                  className="absolute inset-2 bg-red-600/20 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
              </div>
              <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                {step === "LOADING"
                  ? "Authenticating..."
                  : "Verifying Permissions..."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[9px] text-slate-500 font-bold uppercase tracking-widest">
          <p>Secure Executive Portal</p>
          <p className="mt-2">Authorized Access Only</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginScreen;
