import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../src/contexts/SessionContext'; // Corrected import path

type LoginStep = 'PHONE_OTP' | 'EMAIL_PASSWORD';

const LoginScreen: React.FC = () => {
  const { supabase } = useSession();
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStep>('PHONE_OTP'); // Default to phone OTP
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mockSms, setMockSms] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const triggerSmsSimulation = (message: string) => {
    setMockSms({ show: true, message });
    setTimeout(() => setMockSms(prev => ({ ...prev, show: false })), 8000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit number");
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
      });

      if (error) {
        // Check for the specific "unsupported phone provider" error
        if (error.message.includes('unsupported phone provider')) {
          setError("SMS provider not configured. Please set up Twilio or another provider in your Supabase project settings (Authentication -> SMS).");
        } else {
          throw error;
        }
      } else {
        setStep('OTP_VERIFICATION'); // Move to OTP verification step
        triggerSmsSimulation(`Your OTP for Hindustan Mattress Co. is: [Check your phone for the actual OTP]`); // Supabase sends actual OTP
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
        type: 'sms',
      });

      if (error) {
        throw error;
      }

      setMockSms({ show: false, message: '' });
      navigate('/identity', { replace: true }); // Redirect to identity screen after successful login
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      navigate('/identity', { replace: true }); // Redirect to identity screen after successful login
    } catch (err: any) {
      console.error("Email Login Error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      
      {/* Simulated SMS Notification (Mock Push) */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] transition-all duration-700 ease-out ${
        mockSms.show ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0'
      }`}>
        <div className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 flex gap-4 items-start">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
             </svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">MESSAGES • NOW</span>
              <span className="text-[10px] text-slate-500 font-bold">SIM 1</span>
            </div>
            <p className="text-xs font-medium leading-relaxed text-slate-200">
              {mockSms.message}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full space-y-12 transition-all duration-500">
        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20 animate-pulse">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-black text-indigo-900 tracking-tighter uppercase italic">Make My Mattress</h1>
        </div>

        <div className="space-y-8">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('PHONE_OTP')}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border ${
                step === 'PHONE_OTP' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              Login with Phone
            </button>
            <button
              type="button"
              onClick={() => setStep('EMAIL_PASSWORD')}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border ${
                step === 'EMAIL_PASSWORD' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              Login with Email
            </button>
          </div>

          {step === 'PHONE_OTP' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Login to start building</h2>
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91 </span>
                    <input 
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter Mobile Number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-5 font-bold text-lg focus:outline-none focus:border-indigo-600 transition-colors"
                    />
                  </div>
                  
                  {error && <p className="text-xs font-bold text-red-500 px-2">{error}</p>}

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "SEND OTP"
                    )}
                  </button>
                </form>
              </div>
              {/* OTP Verification Section */}
              {step === 'OTP_VERIFICATION' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verify Identity</h2>
                      <button onClick={() => setStep('PHONE_OTP')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Change Number</button>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">We've sent a code to <span className="text-slate-900 font-bold">+91 {phone}</span></p>
                    
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="flex justify-center gap-4">
                        <input 
                          type="text"
                          maxLength={6} // OTPs are typically 6 digits for Supabase
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="• • • • • •"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-6 font-black text-4xl text-center tracking-[0.5em] focus:outline-none focus:border-indigo-600 transition-colors placeholder:text-slate-200"
                        />
                      </div>

                      {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}

                      <button 
                        type="submit"
                        disabled={isLoading || otpInput.length < 6} // OTPs are typically 6 digits for Supabase
                        className="w-full bg-brand-amber text-brand-navy py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center"
                      >
                        {isLoading ? (
                          <div className="w-6 h-6 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin"></div>
                        ) : (
                          "VERIFY & ENTER"
                        )}
                      </button>
                    </form>
                    
                    <div className="text-center mt-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Didn't receive code? <span className="text-indigo-600 cursor-pointer" onClick={handleSendOtp}>Resend SMS</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Login with Email</h2>
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  {error && <p className="text-xs font-bold text-red-500 px-2">{error}</p>}

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "LOGIN"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Don't have an account? <span className="text-indigo-600 cursor-pointer" onClick={() => navigate('/signup')}>Sign up here</span>
            </p>
          </div>

          <p className="text-[11px] text-center text-slate-400 leading-relaxed font-medium">
            By continuing, you agree to our <span className="text-indigo-600 underline cursor-pointer">Terms & Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;