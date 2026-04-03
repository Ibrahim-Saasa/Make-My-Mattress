import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../src/contexts/SessionContext";
import { BrandLogo, Card, Input, Label, Button } from "./UI";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      let signUpError;
      if (method === "EMAIL") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName },
          },
        });
        signUpError = error;
      } else {
        // PHONE
        const { error } = await supabase.auth.signUp({
          phone: `+91${phone}`,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName },
          },
        });
        signUpError = error;
      }

      if (signUpError) {
        throw signUpError;
      }

      setSuccessMessage(
        "Signup successful! Please check your email/phone for a confirmation link/OTP.",
      );
      // Optionally redirect to login after a short delay
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 antialiased font-sans text-slate-100"
      style={{
        background:
          "linear-gradient(135deg, #09174A 0%, #1237B5 55%, #1740D1 100%)",
      }}
    >
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-18 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side at 15% 15%, rgba(255,255,255,0.1), rgba(255,255,255,0) 40%)",
        }}
      />
      <div
        className="absolute -bottom-32 -right-24 w-[420px] h-[420px] rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side at 85% 85%, rgba(255,255,255,0.06), rgba(255,255,255,0) 30%)",
        }}
      />
      <Card variant="elevated" className="max-w-md w-full space-y-6 p-8">
        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-[1.9rem] border border-[rgba(23,64,209,0.14)] bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F6FF_100%)] px-7 py-6 shadow-[0_20px_40px_rgba(9,23,74,0.12)]">
              <BrandLogo
                showWordmark={false}
                size="xl"
                layout="stacked"
                className="gap-4"
              />
            </div>
          </div>
          <h1 className="brand-header text-2xl font-extrabold text-slate-800">
            Create account
          </h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                variant="large"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                variant="large"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              size="md"
              variant={method === "EMAIL" ? "primary" : "secondary"}
              className="flex-1"
              onClick={() => setMethod("EMAIL")}
            >
              Sign up with Email
            </Button>
            <Button
              type="button"
              size="md"
              variant={method === "PHONE" ? "primary" : "secondary"}
              className="flex-1"
              onClick={() => setMethod("PHONE")}
            >
              Sign up with Phone
            </Button>
          </div>

          {method === "EMAIL" ? (
            <div>
              <Label>Email</Label>
              <Input
                variant="large"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                required
              />
            </div>
          ) : (
            <div>
              <Label>Phone Number</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-semibold">
                  +91
                </span>
                <Input
                  variant="large"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="pl-14"
                  placeholder="Enter Mobile Number"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <Label>Password</Label>
            <Input
              variant="large"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600 text-center">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-sm font-medium text-emerald-600 text-center">
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            className="py-4"
            disabled={
              isLoading ||
              !firstName ||
              !lastName ||
              !password ||
              (method === "EMAIL" && !email) ||
              (method === "PHONE" && phone.length < 10)
            }
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-slate-600 mb-3">
            Want to browse first?{" "}
            <button
              className="text-indigo-600 font-semibold"
              onClick={() => navigate("/brand-hall")}
            >
              Continue as guest
            </button>
          </p>

          <p className="text-xs text-slate-600">
            Already have an account?{" "}
            <button
              className="text-indigo-600 font-semibold"
              onClick={() => navigate("/login")}
            >
              Log in here
            </button>
          </p>
        </div>

        <p className="text-xs text-center text-slate-500">
          By continuing, you agree to our{" "}
          <span className="text-indigo-600 underline">
            Terms & Privacy Policy
          </span>
          .
        </p>
      </Card>
    </div>
  );
};

export default SignupScreen;
