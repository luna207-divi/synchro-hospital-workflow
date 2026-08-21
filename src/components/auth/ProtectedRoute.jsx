import React from 'react';
import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardForRole, isRoleAuthorized } from '../../config/roles';
import { Button } from '../common/Button';

/**
 * Access Denied Component (403 Unauthorized Access)
 */
export const AccessDeniedPage = ({ currentRole, allowedRoles }) => {
  const navigate = useNavigate();
  const targetDashboard = getDashboardForRole(currentRole);

  const reqRoleDisplay = Array.isArray(allowedRoles) ? allowedRoles.join(' / ') : allowedRoles || 'ADMIN';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '24px',
      backgroundColor: '#f8fafc',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '32px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <ShieldAlert size={32} />
        </div>

        <div className="font-mono text-red font-bold" style={{ fontSize: '14px', letterSpacing: '0.1em', marginBottom: '8px' }}>
          403 — ACCESS DENIED
        </div>

        <h2 className="font-display font-bold text-navy-head" style={{ fontSize: '22px', marginBottom: '12px' }}>
          Restricted Security Zone
        </h2>

        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
          You don't have permission to access this area. Access is restricted to authorized personnel only.
        </p>

        <div style={{
          padding: '14px 16px',
          borderRadius: '10px',
          backgroundColor: '#f1f5f9',
          border: '1px solid #e2e8f0',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '12px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="font-mono text-muted">YOUR CURRENT ROLE:</span>
            <span className="font-mono font-bold text-navy-head">{(currentRole || 'UNKNOWN').toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="font-mono text-muted">REQUIRED ROLE:</span>
            <span className="font-mono font-bold text-red">{reqRoleDisplay}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size="md"
            variant="primary"
            icon={ArrowLeft}
            onClick={() => navigate(targetDashboard, { replace: true })}
          >
            RETURN TO DASHBOARD
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SYNCHRO — Protected & Role Guarded Route
   
   - Requires valid session (redirects to /login if unauthenticated)
   - Enforces Role Authorization (RBAC):
     If DOCTOR attempts /admin → renders AccessDeniedPage (403)
   ============================================================ */
export const ProtectedRoute = ({ allowedRoles = null }) => {
  const { isAuthenticated, profile, loading } = useAuth();
  const location = useLocation();

  // Show Synchro loading pulse while checking auth
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-gradient-canvas, #f4f8fc)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--accent-gradient, linear-gradient(135deg, #06b6d4, #2563eb))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '20px',
          }}>
            S
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs, 12px)',
            color: 'var(--text-muted, #64748b)',
            letterSpacing: '0.08em',
          }}>
            VERIFYING ACCESS PERMISSIONS...
          </span>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated — redirect to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check Role Authorization (e.g. FRONT_DESK attempting /admin)
  const userRole = profile?.role || 'DOCTOR';
  if (allowedRoles && !isRoleAuthorized(userRole, allowedRoles)) {
    console.warn(`[Synchro Security] Unauthorized route attempt to ${location.pathname} by role ${userRole}. Access Denied.`);
    
    // Render Access Denied 403 page
    return <AccessDeniedPage currentRole={userRole} allowedRoles={allowedRoles} />;
  }

  // Authorized — render target route
  return <Outlet />;
};
