import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, ArrowRight, ShieldCheck, Sparkles, X, Mail, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardForRole } from '../../config/roles';
import { SynchroLogo } from '../common/SynchroLogo';
import { Button } from '../common/Button';
import './LoginPage.css';

/* ============================================================
   SYNCHRO — Single Login Architecture
   "Hospital Workflow, In Sync."
   
   - Single clean login (/login)
   - Role automatically determined after authentication
   - Redirects to role-specific dashboard:
       FRONT_DESK -> /frontdesk
       NURSING    -> /nursing
       DOCTOR     -> /doctor
       BILLING    -> /billing
       ADMIN      -> /admin
   - Password recovery modal architecture
   ============================================================ */

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signOut, isAuthenticated, profile, resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleRoleSelectChange = (roleValue) => {
    setSelectedRole(roleValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      // 1. Attempt Authentication via Supabase Auth
      const res = await signIn(email, password);
      // Read role directly from public.profiles or user metadata
      const userRole = res?.profile?.role || res?.user?.user_metadata?.role || 'DOCTOR';
      const targetDashboard = getDashboardForRole(userRole);
      navigate(targetDashboard, { replace: true });
    } catch (err) {
      console.error('[Supabase Auth Error] Login submission failed:', {
        message: err?.message,
        status: err?.status,
        code: err?.code,
        error: err
      });
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await resetPassword(forgotEmail);
      setForgotSuccess(true);
    } catch (err) {
      console.error('[Supabase Reset Password Error]', err);
      setForgotSuccess(true);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="synchro-login-page">
      {/* ── LEFT SIDE: Animated Medical Illustration & Branding ── */}
      <div className="login-left-side">
        <div className="login-brand-header">
          <SynchroLogo size="lg" variant="dark" showTagline={true} onClick={() => navigate('/')} />
        </div>

        <div className="login-left-content">
          <div className="login-3d-graphic-wrapper">
            <img 
              src="/assets/images/hospital_triad.png" 
              alt="Synchro Hospital Workflow Illustration" 
              className="login-3d-img"
            />
          </div>

          <div className="login-hero-headline">
            <h1 className="login-headline-main">
              Hospital Workflow, <br />
              <span className="login-headline-accent">In Sync.</span>
            </h1>
            <p className="login-headline-sub">
              Connecting admissions, operating suites, nursing, and billing.
            </p>
          </div>
        </div>

        <div className="login-left-footer">
          <ShieldCheck size={14} />
          <span>Synchro Workflow Intelligence Platform</span>
        </div>
      </div>

      {/* ── RIGHT SIDE: Translucent Floating Login Panel ── */}
      <div className="login-right-side">
        <div className="login-card-panel">
          <div className="login-panel-header">
            <h2 className="login-panel-title">Sign in to Synchro</h2>
            <p className="login-panel-sub">Select your designation or enter credentials to access your workspace.</p>
          </div>

          {/* Active Session Banner Handler */}
          {isAuthenticated && (
            <div style={{
              margin: '0 0 16px 0',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                <span>Active Session: {profile?.display_name || 'Staff Member'} ({profile?.role || 'User'})</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <Button size="sm" variant="primary" icon={ArrowRight} onClick={() => {
                  const targetDashboard = getDashboardForRole(profile?.role);
                  navigate(targetDashboard, { replace: true });
                }}>
                  Continue to Dashboard
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  if (signOut) signOut();
                }}>
                  Switch Account
                </Button>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm, 8px)',
              background: 'var(--status-red-bg, #fef2f2)',
              border: '1px solid var(--status-red-border, #fca5a5)',
              color: 'var(--status-red-text, #991b1b)',
              fontSize: 'var(--text-xs, 12px)',
              fontFamily: 'var(--font-mono, monospace)',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {/* Single Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Designation / Role Selection</label>
              <select 
                className="form-input" 
                value={selectedRole} 
                onChange={(e) => handleRoleSelectChange(e.target.value)}
                style={{ cursor: 'pointer', backgroundColor: '#ffffff' }}
              >
                <option value="">-- Select Designation / Role --</option>
                <option value="FRONT_DESK">Front Desk / Patient Intake & Admissions</option>
                <option value="DOCTOR">Doctor / Clinical Operations Lead</option>
                <option value="NURSE">Nursing & PACU Recovery Lead</option>
                <option value="CSSD">CSSD Sterilization & Inventory Lead</option>
                <option value="OT_MANAGER">Operating Theatre Coordinator / OT Lead</option>
                <option value="BILLING">Billing / Revenue & Claims Manager</option>
                <option value="ADMIN">Hospital Administrator (Executive Command)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address or Employee ID</label>
              <input 
                type="text" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hospital.org or EMP-ID"
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required 
              />
            </div>

            <button
              type="button"
              className="form-forgot-link"
              onClick={() => {
                setForgotEmail(email);
                setForgotSuccess(false);
                setShowForgotModal(true);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              Forgot password?
            </button>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              icon={ArrowRight}
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating Role...' : 'SIGN IN TO WORKSPACE'}
            </Button>

            {/* New Member Registration Link */}
            <div style={{
              marginTop: '16px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--text-muted, #64748b)'
            }}>
              <span>New member? </span>
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-blue, #2563eb)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  fontSize: '13px'
                }}
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Trust Badge */}
          <div className="login-trust-badge">
            <Lock size={12} />
            <span>Role-Based Secure Healthcare Access</span>
          </div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 25, 47, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            background: 'var(--surface-card, #ffffff)',
            borderRadius: 'var(--radius-lg, 18px)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
            width: '100%',
            maxWidth: '440px',
            padding: '28px',
            position: 'relative',
          }}>
            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--status-cyan-bg)',
                border: '1px solid var(--status-cyan-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--status-cyan-text)',
              }}>
                <Mail size={18} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-navy-head)' }}>
                Reset Password
              </h3>
            </div>

            {forgotSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={40} style={{ color: 'var(--status-green)', marginBottom: '12px' }} />
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700 }}>
                  Reset link dispatched
                </h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: '6px' }}>
                  If an account exists for <strong>{forgotEmail}</strong>, password reset instructions have been sent.
                </p>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowForgotModal(false)}
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Enter your registered hospital email address to receive a password reset link.
                </p>

                <div className="form-group">
                  <label className="form-label">Hospital Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@hospital.org"
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setShowForgotModal(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={forgotLoading}
                    style={{ flex: 1 }}
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
