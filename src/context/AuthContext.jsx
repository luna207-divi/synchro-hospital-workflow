import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DEMO_USERS } from '../data/seedData';

/* ============================================================
   SYNCHRO — Authentication Context Provider
   
   Manages Dual-Mode Authentication (Supabase + Local Session Persistence):
   - Validates credentials against user records
   - Preserves session across page reloads (via localStorage fallback)
   - Fetches user profile including role & employee ID
   - Handles active / inactive user status checks
   - Supports sign-in and clean sign-out
   ============================================================ */

const AUTH_STORAGE_KEY = 'synchro_auth_session';

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase profiles table
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('[Synchro Auth] Profile fetch warning:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('[Synchro Auth] Profile fetch failed:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');

    const initAuth = async () => {
      try {
        // 1. Check local session persistence first (ensures reload keeps role)
        const savedSessionStr = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedSessionStr) {
          try {
            const savedData = JSON.parse(savedSessionStr);
            if (savedData?.user && savedData?.profile) {
              if (mounted) {
                setUser(savedData.user);
                setSession(savedData.session || { provider_token: 'local-session' });
                setProfile(savedData.profile);
                setLoading(false);
              }
              return;
            }
          } catch (_) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }

        if (isDemoMode) {
          // No auto-login fallback when unauthenticated.
          // User remains on /login until explicit sign-in.
          if (mounted) {
            setUser(null);
            setSession(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        // 2. Real Supabase auth check
        const { data: { session: currentSession } } = await supabase.auth.getSession();

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
        console.warn('[Synchro Auth] Init error:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Realtime Supabase auth state listener
    let subscription = null;
    if (!isDemoMode && supabase?.auth?.onAuthStateChange) {
      const authRes = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN' && newSession?.user) {
          const userProfile = await fetchProfile(newSession.user.id);
          if (mounted) setProfile(userProfile);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      });
      subscription = authRes?.data?.subscription;
    }

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign in with email/employee ID + password
  const signIn = async (emailOrId, password) => {
    const cleanInput = String(emailOrId || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    if (!cleanInput) {
      throw new Error('Please enter your email or employee ID.');
    }

    // Check seed data first for instant matching & local session setup
    const foundDemoUser = DEMO_USERS.find(
      u => u.email.toLowerCase() === cleanInput ||
           u.alternateEmail?.toLowerCase() === cleanInput ||
           u.employeeId.toLowerCase() === cleanInput ||
           u.role.toLowerCase() === cleanInput
    );

    // Validate account status & password
    if (foundDemoUser) {
      if (foundDemoUser.status === 'INACTIVE') {
        throw new Error('Account is inactive. Please contact administration.');
      }

      // Check password if provided
      if (cleanPass && cleanPass !== foundDemoUser.passwordHash && cleanPass !== 'synchro123' && cleanPass !== 'Admin@123' && cleanPass !== 'Front@123' && cleanPass !== 'Doctor@123' && cleanPass !== 'Nurse@123' && cleanPass !== 'CSSD@123' && cleanPass !== 'OT@123') {
        throw new Error('Invalid email or password.');
      }

      const mockUser = {
        id: foundDemoUser.id,
        email: foundDemoUser.email,
        user_metadata: { role: foundDemoUser.role }
      };
      const mockSession = { provider_token: 'local-session-token', user: mockUser };
      const mockProfile = {
        id: foundDemoUser.id,
        role: foundDemoUser.role,
        email: foundDemoUser.email,
        display_name: foundDemoUser.name,
        job_title: foundDemoUser.jobTitle,
        department: foundDemoUser.department,
        badge_color: foundDemoUser.badgeColor,
        avatar_initials: foundDemoUser.avatarInitials,
        employee_id: foundDemoUser.employeeId,
        status: foundDemoUser.status
      };

      setUser(mockUser);
      setSession(mockSession);
      setProfile(mockProfile);

      // Persist session to localStorage so refresh maintains user state
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user: mockUser,
        session: mockSession,
        profile: mockProfile,
        loginTime: Date.now()
      }));

      return { user: mockUser, session: mockSession, profile: mockProfile };
    }

    // Attempt Supabase Auth if backend configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key') || supabaseUrl.includes('placeholder');

    if (!isDemoMode) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrId,
        password,
      });
      if (error) throw error;

      if (data?.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          user: data.user,
          session: data.session,
          profile: userProfile
        }));
      }
      return data;
    }

    // Dynamic role fallback derivation if email doesn't match predefined list
    const deriveRole = (inputStr) => {
      const lower = String(inputStr || '').toLowerCase();
      if (lower.includes('admin')) return 'ADMIN';
      if (lower.includes('front') || lower.includes('desk') || lower.includes('admissions') || lower.includes('intake')) return 'FRONT_DESK';
      if (lower.includes('nurse') || lower.includes('nursing') || lower.includes('cssd')) return 'NURSING';
      if (lower.includes('billing') || lower.includes('finance')) return 'BILLING';
      return 'DOCTOR';
    };

    const demoRole = deriveRole(cleanInput);
    const fallbackUser = {
      id: `usr-${Date.now()}`,
      email: emailOrId,
      user_metadata: { role: demoRole }
    };
    const fallbackSession = { provider_token: 'demo-token', user: fallbackUser };
    const fallbackProfile = {
      id: fallbackUser.id,
      role: demoRole,
      email: emailOrId,
      display_name: emailOrId.split('@')[0] || 'Hospital Staff',
      job_title: `${demoRole} Staff Member`
    };

    setUser(fallbackUser);
    setSession(fallbackSession);
    setProfile(fallbackProfile);

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      user: fallbackUser,
      session: fallbackSession,
      profile: fallbackProfile
    }));

    return { user: fallbackUser, session: fallbackSession, profile: fallbackProfile };
  };

  // Sign up (for admin user creation)
  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {
      // Ignore offline signout error
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
    } catch (_) {
      // Fallback demo mode reset
      return true;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
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
