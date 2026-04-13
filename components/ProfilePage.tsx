import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../src/contexts/SessionContext';
import { Profile } from '../types';

const ProfilePage: React.FC = () => {
  const { session, isLoading: isLoadingSession, supabase } = useSession(); // Renamed isLoading to isLoadingSession to avoid conflict
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Local loading state for profile data
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isLoadingSession) {
      // Wait for the session context to finish loading
      return;
    }

    if (!session) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, date_of_birth')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data.');
      } else if (data) {
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setDateOfBirth(data.date_of_birth || '');
      }
      setEmail(session.user.email || ''); // Email comes from auth.users
      setIsLoading(false);
    };

    fetchProfile();
  }, [session, isLoadingSession, supabase, navigate]); // Added isLoadingSession to dependency array

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    if (!session) {
      setError('User session not found.');
      setIsSaving(false);
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: session.user.id,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth || null, // Store as null if empty
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (profileError) {
        throw profileError;
      }

      // Optionally update email in auth.users if it changed
      if (email !== session.user.email) {
        const { error: emailUpdateError } = await supabase.auth.updateUser({ email });
        if (emailUpdateError) {
          throw emailUpdateError;
        }
      }

      setSuccessMessage('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingSession || isLoading) { // Use both loading states
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-background text-theme-primary">
        Loading profile...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32 relative overflow-hidden"
      style={{
        background: 'var(--color-background)',
        backgroundColor: 'var(--color-background-solid)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(76,114,255,0.12),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(111,145,255,0.18),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle_at_bottom,rgba(200,165,91,0.10),transparent_42%)] dark:bg-[radial-gradient(circle_at_bottom,rgba(76,114,255,0.12),transparent_42%)]" />
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor: 'var(--color-input-bg)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-3xl font-black text-theme-primary tracking-tight">Your Profile</h2>
          <div className="w-10 h-10"></div> {/* Spacer */}
        </div>

        <div
          className="p-8 rounded-[2.5rem] space-y-8 border shadow-[0_28px_70px_rgba(9,23,74,0.12)] dark:shadow-[0_30px_80px_rgba(4,10,32,0.42)]"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--color-card-background) 96%, white 4%) 0%, var(--color-card-background) 100%)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-black text-[var(--brand-primary)] dark:text-[#6E92FF]">Hello, {firstName || 'User'}!</h3>
            <p className="text-sm text-theme-secondary mt-2">Manage your personal details here.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 block">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-2xl px-6 py-4 font-bold focus:outline-none transition-colors text-theme-primary"
                  style={{
                    backgroundColor: 'var(--color-input-bg)',
                    border: '1px solid var(--color-input-border)',
                  }}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 block">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-2xl px-6 py-4 font-bold focus:outline-none transition-colors text-theme-primary"
                  style={{
                    backgroundColor: 'var(--color-input-bg)',
                    border: '1px solid var(--color-input-border)',
                  }}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl px-6 py-4 font-bold focus:outline-none transition-colors text-theme-primary"
                style={{
                  backgroundColor: 'var(--color-input-bg)',
                  border: '1px solid var(--color-input-border)',
                }}
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 block">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-2xl px-6 py-4 font-bold focus:outline-none transition-colors text-theme-primary"
                style={{
                  backgroundColor: 'var(--color-input-bg)',
                  border: '1px solid var(--color-input-border)',
                }}
              />
            </div>

            {error && <p className="text-xs font-bold text-red-500 px-2 text-center">{error}</p>}
            {successMessage && <p className="text-xs font-bold text-emerald-500 px-2 text-center">{successMessage}</p>}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center"
              style={{
                background: 'linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-primary-deep) 100%)',
                boxShadow: '0 18px 36px rgba(23,64,209,0.22)',
              }}
            >
              {isSaving ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "SAVE PROFILE"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
