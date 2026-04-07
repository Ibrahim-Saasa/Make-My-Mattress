import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../src/contexts/SessionContext";
import { Card, Input, Label, Button, BrandLogo } from "./UI";

type SignupMethod = "EMAIL" | "PHONE";

const SignupScreen: React.FC = () => {
  const { supabase } = useSession();
  const navigate = useNavigate();

  const [method, setMethod] = useState<SignupMethod>("EMAIL");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [signupStep, setSignupStep] = useState<"FORM" | "OTP_VERIFICATION">(
    "FORM",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (method === "EMAIL") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName },
          },
        });

        if (error) {
          throw error;
        }

        setSuccessMessage(
          "Signup successful! Please check your email for a confirmation link.",
        );
        setTimeout(() => navigate("/login"), 3000);
      } else {
        if (phone.length < 10) {
          setError("Please enter a valid 10-digit number");
          return;
        }

        const { error } = await supabase.auth.signInWithOtp({
          phone: `+91${phone}`,
        });

        if (error) {
          throw error;
        }

        setSuccessMessage(
          "OTP sent on WhatsApp. Enter the code below to finish signup.",
        );
        setSignupStep("OTP_VERIFICATION");
      }
    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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

      const { error: updateError } = await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName },
      });

      if (updateError) {
        throw updateError;
      }

      navigate("/identity", { replace: true });
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
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
      {/* Main Signup Card */}
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
              Create account
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#D4DDFF]">
              Join the premium comfort community.
            </p>
          </div>
        </div>

        {/* Method Selector */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#DCE6FF]/12 p-1.5 ring-1 ring-white/8">
          <button
            type="button"
            onClick={() => setMethod("EMAIL")}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              method === "EMAIL"
                ? "bg-white/95 text-[var(--brand-primary)] shadow-sm"
                : "text-[#B7C7F2]"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setMethod("PHONE")}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              method === "PHONE"
                ? "bg-white/95 text-[var(--brand-primary)] shadow-sm"
                : "text-[#B7C7F2]"
            }`}
          >
            Phone
          </button>
        </div>

        {/* Signup Forms */}

        <form
          onSubmit={
            signupStep === "OTP_VERIFICATION" ? handleVerifyOtp : handleSignup
          }
          className="space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-[#EAF0FF]">
                First Name
              </Label>
              <Input
                id="firstName"
                variant="large"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="mt-2 h-15 !rounded-2xl !border-[#8FA4E8] !bg-[#253250] !text-white placeholder:!text-[#91A1C8] focus:!border-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-[#EAF0FF]">
                Last Name
              </Label>
              <Input
                id="lastName"
                variant="large"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="mt-2 h-15 !rounded-2xl !border-[#8FA4E8] !bg-[#253250] !text-white placeholder:!text-[#91A1C8] focus:!border-white"
                required
              />
            </div>
          </div>

          {method === "EMAIL" ? (
            <>
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
                  placeholder="john.doe@example.com"
                  className="mt-2 h-15 !rounded-2xl !border-[#8FA4E8] !bg-[#253250] !text-white placeholder:!text-[#91A1C8] focus:!border-white"
                  required
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
                  className="mt-2 h-15 !rounded-2xl !border-[#8FA4E8] !bg-[#253250] !text-white placeholder:!text-[#91A1C8] focus:!border-white"
                  required
                />
              </div>
            </>
          ) : signupStep === "OTP_VERIFICATION" ? (
            <>
              <div>
                <p className="text-sm leading-relaxed text-[#D4DDFF]">
                  We sent a WhatsApp code to{" "}
                  <span className="font-semibold text-white">+91 {phone}</span>.
                </p>
              </div>
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
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setSignupStep("FORM");
                    setOtpInput("");
                  }}
                  className="text-sm font-medium text-[#BFD0FF] hover:text-white hover:underline"
                >
                  Use a different number
                </button>
              </div>
            </>
          ) : (
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
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-[#D76A72]/40 bg-[#3B2030] p-3">
              <p className="text-sm text-[#FFB8BE]">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-3">
              <p className="text-sm text-emerald-200">{successMessage}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            size="lg"
            className="h-16 !rounded-2xl !text-base !font-extrabold"
            disabled={
              isLoading ||
              !firstName ||
              !lastName ||
              (method === "EMAIL" && (!email || !password)) ||
              (method === "PHONE" &&
                signupStep === "FORM" &&
                phone.length < 10) ||
              (method === "PHONE" &&
                signupStep === "OTP_VERIFICATION" &&
                otpInput.length < 6)
            }
          >
            {method === "PHONE" && signupStep === "FORM"
              ? "Send on WhatsApp"
              : method === "PHONE" && signupStep === "OTP_VERIFICATION"
              ? "Verify & Continue"
              : "Create Account"}
          </Button>
        </form>

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
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-[#DDE6FF] hover:text-white hover:underline"
            >
              Log in
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

export default SignupScreen;
