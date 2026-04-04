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
    <div className="min-h-screen bg-theme-background p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-theme-input flex items-center justify-center text-theme-secondary hover:bg-indigo-600 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-3xl font-black text-theme-primary tracking-tight">Your Profile</h2>
          <div className="w-10 h-10"></div> {/* Spacer */}
        </div>

        <div className="bg-theme-card border border-theme-border p-8 rounded-[2.5rem] space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-black text-indigo-600">Hello, {firstName || 'User'}!</h3>
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
                  className="w-full bg-theme-input border border-theme-border rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors text-theme-primary"
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
                  className="w-full bg-theme-input border border-theme-border rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors text-theme-primary"
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
                className="w-full bg-theme-input border border-theme-border rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors text-theme-primary"
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
                className="w-full bg-theme-input border border-theme-border rounded-2xl px-6 py-4 font-bold focus:outline-none focus:border-indigo-600 transition-colors text-theme-primary"
              />
            </div>

            {error && <p className="text-xs font-bold text-red-500 px-2 text-center">{error}</p>}
            {successMessage && <p className="text-xs font-bold text-emerald-500 px-2 text-center">{successMessage}</p>}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center"
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
