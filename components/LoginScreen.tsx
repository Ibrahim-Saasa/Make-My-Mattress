import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../src/contexts/SessionContext";
import { Button, Card, Input, Label } from "./UI";

type LoginStep = "PHONE_INPUT" | "OTP_VERIFICATION" | "EMAIL_PASSWORD";

const LoginScreen: React.FC = () => {
  const { supabase } = useSession();
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStep>("PHONE_INPUT"); // Default to phone input
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mockSms, setMockSms] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const triggerSmsSimulation = (message: string) => {
    setMockSms({ show: true, message });
    setTimeout(() => setMockSms((prev) => ({ ...prev, show: false })), 8000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit number");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
      });

      if (error) {
        // Check for the specific "unsupported phone provider" error
        if (error.message.includes("unsupported phone provider")) {
          setError(
            "SMS provider not configured. Please set up Twilio or another provider in your Supabase project settings (Authentication -> SMS).",
          );
        } else {
          throw error;
        }
      } else {
        setStep("OTP_VERIFICATION"); // Move to OTP verification step
        triggerSmsSimulation(
          `Your OTP for Hindustan Mattress Co. is: [Check your phone for the actual OTP]`,
        ); // Supabase sends actual OTP
      }
    } catch (err: any) {
      console.error("OTP Send Error:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otpInput,
        type: "sms",
      });

      if (error) {
        throw error;
      }

      setMockSms({ show: false, message: "" });
      navigate("/identity", { replace: true }); // Redirect to identity screen after successful login
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      navigate("/identity", { replace: true }); // Redirect to identity screen after successful login
    } catch (err: any) {
      console.error("Email Login Error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden antialiased font-sans text-slate-100"
      style={{
        background:
          "linear-gradient(135deg,#041229 0%, #0b3b66 45%, #153f6f 100%)",
      }}
    >
      {/* Subtle radial shine */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side at 15% 15%, rgba(255,255,255,0.12), rgba(255,255,255,0) 40%)",
        }}
      />
      <div
        className="absolute -bottom-32 -right-24 w-[420px] h-[420px] rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side at 85% 85%, rgba(255,255,255,0.06), rgba(255,255,255,0) 30%)",
        }}
      />
      {/* SMS Notification Toast */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] transition-all duration-700 ease-out ${
          mockSms.show
            ? "translate-y-0 opacity-100"
            : "-translate-y-32 opacity-0"
        }`}
      >
        <Card variant="glass">
          <div className="flex gap-4 items-start">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg,#041229 0%, #0b3b66 45%, #153f6f 100%)",
              }}
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
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Messages • Now
              </div>
              <p className="text-sm text-slate-900 leading-relaxed">
                {mockSms.message}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Login Card */}
      <Card variant="elevated" className="w-full max-w-md space-y-6 p-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg,#041229 0%, #0b3b66 45%, #153f6f 100%)",
              }}
            >
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Make My Mattress
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Sleep experience designed for clarity and comfort.
            </p>
          </div>
        </div>

        {/* Step Selector */}
        <div className="grid grid-cols-2 gap-3 bg-slate-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setStep("PHONE_INPUT")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              step === "PHONE_INPUT" || step === "OTP_VERIFICATION"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Phone
          </button>
          <button
            type="button"
            onClick={() => setStep("EMAIL_PASSWORD")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              step === "EMAIL_PASSWORD"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Email
          </button>
        </div>

        {/* Login Forms */}
        {step === "PHONE_INPUT" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-1">
                Login to get started
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter your phone number to continue
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <Label htmlFor="phone" className="dark:text-slate-200">
                  Mobile number
                </Label>
                <div className="flex gap-2 mt-2 w-full">
                  <div className="flex items-center px-4 py-4 bg-slate-100 rounded-xl border border-slate-300 flex-shrink-0 w-20 justify-center">
                    <span className="text-slate-600 font-semibold">+91</span>
                  </div>
                  <Input
                    id="phone"
                    variant="large"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="9876543210"
                    className="flex-1 w-full"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                size="lg"
              >
                Send OTP
              </Button>
            </form>
          </div>
        )}

        {step === "OTP_VERIFICATION" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-1">
                Verify your number
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We sent a code to{" "}
                <span className="font-semibold text-slate-50">+91 {phone}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <Label htmlFor="otp" className="dark:text-slate-200">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  variant="large"
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) =>
                    setOtpInput(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  className="font-mono text-center text-lg tracking-[0.5em] mt-2"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={otpInput.length < 6}
                size="lg"
              >
                Verify & Continue
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("PHONE_INPUT")}
                className="text-sm text-indigo-600 hover:underline font-medium"
              >
                Use a different number
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-600">
                Didn't get a code?{" "}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        )}

        {step === "EMAIL_PASSWORD" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Login with email
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use your email and password
              </p>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  variant="large"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2"
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  variant="large"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                size="lg"
              >
                Login
              </Button>
            </form>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs text-slate-500 uppercase font-semibold">
            or
          </span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Footer Links */}
        <div className="space-y-3">
          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Sign up
            </button>
          </p>

          <p className="text-center text-sm text-slate-600">
            Admin user?{" "}
            <button
              type="button"
              onClick={() => navigate("/admin-login")}
              className="text-rose-600 hover:underline font-bold"
            >
              Access Capitol
            </button>
          </p>

          <p className="text-center text-xs text-slate-500 leading-relaxed">
            By continuing, you agree to our{" "}
            <button type="button" className="text-indigo-600 hover:underline">
              Terms
            </button>
            {" & "}
            <button type="button" className="text-indigo-600 hover:underline">
              Privacy Policy
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginScreen;
