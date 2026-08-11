import React, { useState } from 'react';
import { 
  Stethoscope, User, Lock, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, KeyRound, Building2
} from 'lucide-react';
import { Button } from '../common/Button';
import './LoginPage.css';

/* ============================================================
   SYNCHRO — Split Visual Login Experience
   "Hospital Workflow, In Sync."
   ============================================================ */

export const LoginPage = ({ onLoginSuccess, onBackToLanding }) => {
  const [portalRole, setPortalRole] = useState('staff'); // 'staff' | 'patient'
  const [email, setEmail] = useState('dr.sharma@apexmedical.org');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleSelect = (role) => {
    setPortalRole(role);
    if (role === 'staff') {
      setEmail('dr.sharma@apexmedical.org');
    } else {
      setEmail('patient.jenkins@synchro.health');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="synchro-login-page">
      {/* ── LEFT SIDE: Animated Medical Illustration & Branding ── */}
      <div className="login-left-side">
        <div className="login-brand-header">
          <div className="login-brand-mark">S</div>
          <span className="login-brand-title">SYNCHRO</span>
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
              Connecting admissions, operating suites, and sterile services.
            </p>
          </div>
        </div>

        <div className="login-left-footer">
          <ShieldCheck size={14} />
          <span>Synchro Workflow Intelligence Platform</span>
        </div>
      </div>

      {/* ── RIGHT SIDE: Clean Translucent Floating Login Panel ── */}
      <div className="login-right-side">
        <div className="login-card-panel">
          <div className="login-panel-header">
            <h2 className="login-panel-title">Welcome back</h2>
            <p className="login-panel-sub">Sign in to continue to Synchro.</p>
          </div>

          {/* Portal Role Selector */}
          <div className="portal-role-selector">
            <button 
              type="button"
              className={`portal-role-btn ${portalRole === 'staff' ? 'is-active accent-staff' : ''}`}
              onClick={() => handleRoleSelect('staff')}
            >
              <Stethoscope size={14} />
              <span>Doctor / Staff</span>
            </button>

            <button 
              type="button"
              className={`portal-role-btn ${portalRole === 'patient' ? 'is-active accent-patient' : ''}`}
              onClick={() => handleRoleSelect('patient')}
            >
              <User size={14} />
              <span>Patient</span>
            </button>
          </div>

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hospital.org"
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
                placeholder="Enter password"
                required 
              />
            </div>

            <span className="form-forgot-link">Forgot password?</span>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              icon={ArrowRight}
              className="login-submit-btn"
            >
              Sign In to {portalRole === 'staff' ? 'Staff Workspace' : 'Patient Portal'}
            </Button>
          </form>

          {/* Trust Footer */}
          <div className="login-trust-badge">
            <Lock size={12} />
            <span>Secure Healthcare Workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
};
