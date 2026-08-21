import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardForRole, isRoleAuthorized } from '../../config/roles';

/* ============================================================
   SYNCHRO — Protected & Role Guarded Route
   
   - Requires valid session (redirects to /login if unauthenticated)
   - Enforces Role Authorization (RBAC):
     If DOCTOR attempts /admin → redirects back to /doctor
     If NURSING attempts /billing → redirects back to /nursing
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

  // 2. Check Role Authorization (e.g. DOCTOR attempting /admin)
  const userRole = profile?.role || 'DOCTOR';
  if (allowedRoles && !isRoleAuthorized(userRole, allowedRoles)) {
    const userDashboard = getDashboardForRole(userRole);
    console.warn(`[Synchro Security] Unauthorized route attempt to ${location.pathname} by role ${userRole}. Redirecting to ${userDashboard}`);
    
    // Unauthorized state → Return to user's assigned dashboard
    return <Navigate to={userDashboard} replace />;
  }

  // Authorized — render target route
  return <Outlet />;
};
