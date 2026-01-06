import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../src/contexts/SessionContext';

type SignupMethod = 'EMAIL' | 'PHONE';

const SignupScreen: React.FC = () => {
  const { supabase } = useSession();
  const navigate = useNavigate();

  const [method, setMethod] = useState<SignupMethod>('EMAIL');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      let signUpError;
      if (method === 'EMAIL') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName },
          },
        });
        signUpError = error;
      } else { // PHONE
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

      setSuccessMessage('Signup successful! Please check your email/phone for a confirmation link/OTP.');
      // Optionally redirect to login after a short delay
      setTimeout(() => navigate('/login'), 3000);

    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-500/20 border border-slate-200">
        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-indigo-700 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-700/30">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-black text-indigo-900 tracking-tighter uppercase italic">Create Account</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-100 border border-slate-300 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-700 transition-colors shadow-sm"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-100 border border-slate-300 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-700 transition-colors shadow-sm"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setMethod('EMAIL')}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border hover:scale-[1.02] ${
                method === 'EMAIL' ? 'bg-indigo-700 text-white border-indigo-700 shadow-lg shadow-indigo-500/20' : 'bg-slate-100 text-slate-600 border-slate-300 shadow-sm'
              }`}
            >
              Sign up with Email
            </button>
            <button
              type="button"
              onClick={() => setMethod('PHONE')}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border hover:scale-[1.02] ${
                method === 'PHONE' ? 'bg-indigo-700 text-white border-indigo-700 shadow-lg shadow-indigo-500/20' : 'bg-slate-100 text-slate-600 border-slate-300 shadow-sm'
              }`}
            >
              Sign up with Phone
            </button>
          </div>

          {method === 'EMAIL' ? (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100 border border-slate-300 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-700 transition-colors shadow-sm"
                placeholder="john.doe@example.com"
                required
              />
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Phone Number</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">+91 </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-100 border border-slate-300 rounded-2xl pl-14 pr-6 py-4 font-bold focus:outline-none focus:border-indigo-700 transition-colors shadow-sm"
                  placeholder="Enter Mobile Number"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-700 transition-colors shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-xs font-bold text-red-600 px-2 text-center">{error}</p>}
          {successMessage && <p className="text-xs font-bold text-emerald-600 px-2 text-center">{successMessage}</p>}

          <button
            type="submit"
            disabled={isLoading || !firstName || !lastName || !password || (method === 'EMAIL' && !email) || (method === 'PHONE' && phone.length < 10)}
            className="w-full bg-indigo-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-700/30 hover:bg-indigo-800 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "SIGN UP"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Already have an account? <span className="text-indigo-700 cursor-pointer" onClick={() => navigate('/login')}>Log in here</span>
          </p>
        </div>

        <p className="text-[11px] text-center text-slate-500 leading-relaxed font-medium">
          By continuing, you agree to our <span className="text-indigo-700 underline cursor-pointer">Terms & Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;