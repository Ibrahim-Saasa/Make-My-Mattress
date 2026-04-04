import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../src/contexts/SessionContext";
import { BrandLogo, Button, Card, Input, Label } from "./UI";

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
  const [mockWhatsapp, setMockWhatsapp] = useState<{
    show: boolean;
    message: string;
  }>({
    show: false,
    message: "",
  });

  const triggerWhatsappSimulation = (message: string) => {
    setMockWhatsapp({ show: true, message });
    setTimeout(
      () => setMockWhatsapp((prev) => ({ ...prev, show: false })),
      8000,
    );
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
        if (error.message.includes("unsupported phone provider")) {
          setError(
            "WhatsApp delivery is not configured yet. Set up the Supabase Send SMS hook with your India WhatsApp provider before using phone login.",
          );
        } else {
          throw error;
        }
      } else {
        setStep("OTP_VERIFICATION");
        triggerWhatsappSimulation(
          "We sent your verification code on WhatsApp. Please open WhatsApp and enter the OTP here.",
        );
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

      setMockWhatsapp({ show: false, message: "" });
      navigate("/identity", { replace: true });
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

      navigate("/identity", { replace: true });
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
      {/* WhatsApp Notification Toast */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] transition-all duration-700 ease-out ${
          mockWhatsapp.show
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
                  "linear-gradient(135deg, #09174A 0%, #1237B5 55%, #1740D1 100%)",
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
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                WhatsApp • Now
              </div>
              <p className="text-sm text-slate-900 leading-relaxed">
                {mockWhatsapp.message}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Login Card */}
      <Card
        variant="elevated"
        className="w-full max-w-md space-y-6 border-[rgba(141,161,240,0.18)] bg-[#121C3B] p-8 shadow-[0_30px_80px_rgba(7,18,56,0.45)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(13, 24, 58, 0.98) 0%, rgba(18, 28, 59, 0.98) 100%)",
          borderColor: "rgba(127, 156, 255, 0.22)",
          boxShadow: "0 32px 90px rgba(6, 14, 44, 0.52)",
        }}
      >
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
              Make My Mattress
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#D4DDFF]">
              A calmer, more premium way to find the right comfort.
            </p>
          </div>
        </div>

        {/* Step Selector */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#DCE6FF]/12 p-1.5 ring-1 ring-white/8">
          <button
            type="button"
            onClick={() => setStep("PHONE_INPUT")}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              step === "PHONE_INPUT" || step === "OTP_VERIFICATION"
                ? "bg-white/95 text-[var(--brand-primary)] shadow-sm"
                : "text-[#B7C7F2]"
            }`}
          >
            Phone
          </button>
          <button
            type="button"
            onClick={() => setStep("EMAIL_PASSWORD")}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              step === "EMAIL_PASSWORD"
                ? "bg-white/95 text-[var(--brand-primary)] shadow-sm"
                : "text-[#B7C7F2]"
            }`}
          >
            Email
          </button>
        </div>

        {/* Login Forms */}
        {step === "PHONE_INPUT" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="mb-1 text-lg font-semibold text-white">
                Login to get started
              </h2>
              <p className="text-sm leading-relaxed text-[#D4DDFF]">
                Enter your WhatsApp number to continue
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <Label htmlFor="phone" className="text-[#EAF0FF]">
                  Mobile number
                </Label>
                <div className="mt-2 flex w-full gap-1">
                  <div className="flex h-15 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-[#7F9CFF]/30 bg-[#DDE7FF]/92">
                    <span className="font-semibold text-[#17398B]">+91</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Input
                      id="phone"
                      variant="large"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="0000000000"
                      className="h-15 !w-full !min-w-0 !rounded-2xl !border-[#8FA4E8] !bg-[#253250] !px-5 !text-white placeholder:!text-[#91A1C8] focus:!border-white"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-[#D76A72]/40 bg-[#3B2030] p-3">
                  <p className="text-sm text-[#FFB8BE]">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                size="lg"
                className="h-16 !rounded-2xl !text-base !font-extrabold"
              >
                Send on WhatsApp
              </Button>
            </form>
          </div>
        )}

        {step === "OTP_VERIFICATION" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="mb-1 text-lg font-semibold text-white">
                Verify your number
              </h2>
              <p className="text-sm leading-relaxed text-[#D4DDFF]">
                We sent a WhatsApp code to{" "}
                <span className="font-semibold text-white">+91 {phone}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <Label htmlFor="otp" className="text-[#EAF0FF]">
                  WhatsApp verification code
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
                  className="mt-2 h-16 !rounded-2xl !border-[#8FA4E8] !bg-[#253250] !font-mono !text-center !text-lg !tracking-[0.5em] !text-white placeholder:!text-[#91A1C8] focus:!border-white"
                  autoFocus
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-[#D76A72]/40 bg-[#3B2030] p-3">
                  <p className="text-sm text-[#FFB8BE]">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={otpInput.length < 6}
                size="lg"
                className="h-16 !rounded-2xl !text-base !font-extrabold"
              >
                Verify & Continue
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("PHONE_INPUT")}
                className="text-sm font-medium text-[#BFD0FF] hover:text-white hover:underline"
              >
                Use a different number
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-[#B7C5E8]">
                Didn't get it on WhatsApp?{" "}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="font-semibold text-[#DDE6FF] hover:text-white hover:underline"
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
              <h2 className="mb-1 text-lg font-semibold text-white">
                Login with email
              </h2>
              <p className="text-sm leading-relaxed text-[#D4DDFF]">
                Use your email and password
              </p>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-[#EAF0FF]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  variant="large"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 h-16 !rounded-2xl !border-[#8FA4E8] !bg-[#253250] !text-white placeholder:!text-[#91A1C8] focus:!border-white"
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-[#EAF0FF]">
                  Password
                </Label>
                <Input
                  id="password"
                  variant="large"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 h-16 !rounded-2xl !border-[#8FA4E8] !bg-[#253250] !text-white placeholder:!text-[#91A1C8] focus:!border-white"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-[#D76A72]/40 bg-[#3B2030] p-3">
                  <p className="text-sm text-[#FFB8BE]">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                size="lg"
                className="h-16 !rounded-2xl !text-base !font-extrabold"
              >
                Login
              </Button>
            </form>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-[#4A5D93]"></div>
          <span className="text-xs font-semibold uppercase text-[#9FB0DA]">
            or
          </span>
          <div className="h-px flex-1 bg-[#4A5D93]"></div>
        </div>

        {/* Footer Links */}
        <div className="space-y-3">
          <p className="text-center text-sm text-[#9FB0DA]">
            Prefer to look around first?{" "}
            <button
              type="button"
              onClick={() => navigate("/brand-hall")}
              className="font-semibold text-[#DDE6FF] hover:text-white hover:underline"
            >
              Browse as guest
            </button>
          </p>

          <p className="text-center text-sm text-[#9FB0DA]">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-[#DDE6FF] hover:text-white hover:underline"
            >
              Sign up
            </button>
          </p>

          <p className="text-center text-sm text-[#9FB0DA]">
            Admin user?{" "}
            <button
              type="button"
              onClick={() => navigate("/admin-login")}
              className="font-bold text-[#FFB8BE] hover:text-white hover:underline"
            >
              Access Capitol
            </button>
          </p>

          <p className="text-center text-xs leading-relaxed text-[#8D9EC6]">
            By continuing, you agree to our{" "}
            <button
              type="button"
              className="text-[#DDE6FF] hover:text-white hover:underline"
            >
              Terms
            </button>
            {" & "}
            <button
              type="button"
              className="text-[#DDE6FF] hover:text-white hover:underline"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginScreen;
