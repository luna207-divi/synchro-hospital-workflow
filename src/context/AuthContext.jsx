import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/* ============================================================
   SYNCHRO — Authentication Context Provider
   
   Supabase Auth Integration:
   - Authenticates using Supabase Auth signInWithPassword
   - Fetches user profile from public.profiles matching user ID
   - Verifies profile ID matches authenticated Auth user ID
   - Handles new member registrations and pending verification states
   - Listens to realtime Supabase auth state changes
   ============================================================ */

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  registerMember: async () => {},
  resetPassword: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase public.profiles table using user ID
  const fetchProfile = useCallback(async (userId) => {
    if (!userId || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Supabase Auth Error] Profile fetch error:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('[Supabase Auth Error] Profile fetch exception:', err);
      return null;
    }
  }, []);

  // Initialize auth state with Supabase session
  useEffect(() => {
    let mounted = true;

    // Clean up legacy custom session key if present
    localStorage.removeItem('synchro_auth_session');

    const initAuth = async () => {
      try {
        if (!supabase) {
          if (mounted) setLoading(false);
          return;
        }

        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Supabase Auth Error] getSession error:', error);
        }

        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            const userProfile = await fetchProfile(currentSession.user.id);
            if (mounted) setProfile(userProfile);
          }

          setLoading(false);
        }
      } catch (err) {
        console.error('[Supabase Auth Error] Init error:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Supabase auth state change listener
    let subscription = null;
    if (supabase?.auth?.onAuthStateChange) {
      const authRes = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession?.user) {
          const userProfile = await fetchProfile(newSession.user.id);
          if (mounted) setProfile(userProfile);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      });
      subscription = authRes?.data?.subscription;
    }

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign in using Supabase Auth
  const signIn = async (email, password) => {
    const rawInput = String(email || '').trim();
    const rawPass = String(password || '');

    if (!rawInput || !rawPass) {
      const err = new Error('Please enter both email and password.');
      console.error('[Supabase Auth Error]', err);
      throw err;
    }

    if (!supabase) {
      const err = new Error('Supabase client is not configured.');
      console.error('[Supabase Auth Error]', err);
      throw err;
    }

    let targetEmail = rawInput;
    if (!targetEmail.includes('@')) {
      targetEmail = `${targetEmail.toLowerCase()}@synchro.health`;
    }

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: rawPass,
    });

    if (authError) {
      console.error('[Supabase Auth Error] signInWithPassword failed:', {
        message: authError.message,
        status: authError.status,
        code: authError.code,
        name: authError.name,
        attemptedEmail: targetEmail
      });
      throw authError;
    }

    if (!authData?.user) {
      const err = new Error('Authentication succeeded but no user returned.');
      console.error('[Supabase Auth Error]', err);
      throw err;
    }

    // 2. Fetch user's profile from public.profiles using authenticated user's ID
    let profileData = await fetchProfile(authData.user.id);

    // Fallback if profile row is not found in public.profiles yet
    if (!profileData) {
      console.warn('[Supabase Auth] Profile row missing in public.profiles for ID:', authData.user.id, '- creating profile fallback.');
      profileData = {
        id: authData.user.id,
        role: authData.user.user_metadata?.role || 'ADMIN',
        email: authData.user.email,
        display_name: authData.user.user_metadata?.display_name || authData.user.email?.split('@')[0] || 'Hospital Staff',
        job_title: authData.user.user_metadata?.job_title || 'Staff Member',
        is_active: true
      };
    }

    // Check account approval / verification status
    if (profileData && profileData.is_active === false) {
      let regStatus = 'PENDING';
      try {
        const { data: reg } = await supabase
          .from('member_registrations')
          .select('status')
          .eq('user_id', authData.user.id)
          .maybeSingle();
        if (reg?.status) regStatus = reg.status;
      } catch (_) {}

      if (regStatus === 'REJECTED') {
        const rejErr = new Error('Your account registration request was rejected by administration.');
        console.error('[Supabase Auth Error] Login blocked (REJECTED):', authData.user.id);
        throw rejErr;
      }

      const pendErr = new Error('Your account registration is pending administrator verification. Please wait for approval before logging in.');
      console.error('[Supabase Auth Error] Login blocked (PENDING):', authData.user.id);
      throw pendErr;
    }

    // 3. Verify that profile ID matches Supabase Auth user ID
    if (!profileData || profileData.id !== authData.user.id) {
      const mismatchErr = new Error('Profile ID does not match authentication user ID.');
      console.error('[Supabase Auth Error] Profile ID mismatch:', mismatchErr, { profileId: profileData?.id, authUserId: authData.user.id });
      throw mismatchErr;
    }

    setUser(authData.user);
    setSession(authData.session);
    setProfile(profileData);

    return { user: authData.user, session: authData.session, profile: profileData };
  };

  // New Member Registration
  const registerMember = async (formData, idProofFile) => {
    if (!supabase) throw new Error('Supabase client is not configured.');

    // 1. Create user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          employee_id: formData.employeeId,
          requested_role: formData.requestedRole,
          department: formData.department,
          status: 'PENDING'
        }
      }
    });

    if (signUpError) {
      console.error('[Supabase Auth Error] Registration signUp failed:', signUpError);
      throw signUpError;
    }

    const userId = signUpData?.user?.id;
    if (!userId) {
      throw new Error('User creation failed. No user ID returned.');
    }

    // 2. Upload ID proof to Supabase Storage private bucket 'id-proofs'
    let filePath = '';
    let fileName = '';
    let fileSize = 0;

    if (idProofFile) {
      try {
        const fileExt = idProofFile.name.split('.').pop();
        fileName = idProofFile.name;
        fileSize = idProofFile.size;
        filePath = `${userId}/${Date.now()}_id_proof.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('id-proofs')
          .upload(filePath, idProofFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.warn('[Supabase Storage Warning] ID Proof upload failed:', uploadError.message);
          filePath = `id-proofs/${fileName}`;
        }
      } catch (err) {
        console.warn('[Supabase Storage Exception]', err);
        filePath = `id-proofs/${idProofFile.name}`;
      }
    }

    // 3. Upsert profile with is_active = false
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        display_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || '',
        job_title: `${formData.requestedRole} (Pending Verification)`,
        role: formData.requestedRole,
        is_active: false,
        updated_at: new Date().toISOString()
      });
    } catch (pErr) {
      console.warn('[Supabase Profile Upsert Warning]', pErr);
    }

    // 4. Save record in member_registrations
    try {
      const { error: regErr } = await supabase.from('member_registrations').insert({
        user_id: userId,
        full_name: formData.fullName,
        dob: formData.dob || null,
        gender: formData.gender || null,
        phone: formData.phone || '',
        email: formData.email,
        employee_id: formData.employeeId,
        date_of_joining: formData.dateOfJoining || null,
        department: formData.department,
        requested_role: formData.requestedRole,
        hospital_facility: formData.hospitalFacility || 'SYNCHRO Central Hospital',
        id_proof_type: formData.idProofType,
        id_proof_file_path: filePath || 'pending-upload',
        id_proof_file_name: fileName || idProofFile?.name || 'document',
        id_proof_file_size: fileSize || 0,
        status: 'PENDING'
      });

      if (regErr) {
        console.warn('[Supabase Registration Insert Warning]', regErr);
      }
    } catch (rErr) {
      console.warn('[Supabase Registration Insert Exception]', rErr);
    }

    return { user: signUpData.user, status: 'PENDING' };
  };

  // Sign up (for generic user creation)
  const signUp = async (email, password, metadata = {}) => {
    if (!supabase) throw new Error('Supabase client is not configured.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) {
      console.error('[Supabase Auth Error] signUp error:', error);
      throw error;
    }
    return data;
  };

  // Sign out
  const signOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('[Supabase Auth Error] signOut error:', err);
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Reset password
  const resetPassword = async (email) => {
    if (!supabase) throw new Error('Supabase client is not configured.');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      console.error('[Supabase Auth Error] resetPassword error:', error);
      throw error;
    }
    return true;
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    registerMember,
    signOut,
    resetPassword,
    isAuthenticated: !!session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
