import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRole } from './context/RoleContext';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { getDashboardForRole } from './config/roles';

/* ============================================================
   SYNCHRO — App Shell
   
   Derives active navigation and header titles from current route.
   Syncs RoleContext with the authenticated user on mount.
   Supports role dashboards (/admin, /doctor, /nursing, /frontdesk, /billing).
   ============================================================ */

const ROUTE_META = {
  'admin':      { label: 'Operational Analytics', section: 'Admin',        pageTitle: 'Executive Command Center' },
  'doctor':     { label: 'Flow Board',            section: 'Operations',   pageTitle: 'Doctor Command Workspace' },
  'nursing':    { label: 'SterileFlow CSSD',      section: 'Nursing',      pageTitle: 'Sterile Instrument Flow' },
  'frontdesk':  { label: 'Patient Admissions',    section: 'Front Desk',   pageTitle: 'Pre-Op Intake & Admissions' },
  'billing':    { label: 'Management Reports',   section: 'Billing',      pageTitle: 'Financial & Utilization Reports' },
  'flow-board': { label: 'Flow Board',            section: 'Operations',   pageTitle: 'Command Workspace' },
  'live-flow':  { label: 'Live Flow',             section: 'Operations',   pageTitle: 'Live Flow Telemetry' },
  'readiness':  { label: 'OT Control Room',       section: 'Operations',   pageTitle: 'OT Control Room' },
  'instruments':{ label: 'Instruments',            section: 'Operations',   pageTitle: 'SterileFlow CSSD' },
  'alerts':     { label: 'Alerts',                section: 'Intelligence', pageTitle: 'Active Alerts' },
  'analytics':  { label: 'Analytics',             section: 'Intelligence', pageTitle: 'Operational Analytics' },
  'reports':    { label: 'Reports',               section: 'Intelligence', pageTitle: 'Reports' },
  'patients':   { label: 'Patients',              section: 'Operations',   pageTitle: 'Patient Registry' },
  'patient':    { label: 'My Care Journey',       section: 'Patient',      pageTitle: 'My Care Journey' },
  'settings':   { label: 'Settings',              section: 'System',       pageTitle: 'Settings' },
  'notifications': { label: 'Notifications',      section: 'System',       pageTitle: 'Notification History' },
};

export const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, switchRole } = useRole();
  const { profile } = useAuth();

  // Sync RoleContext with authenticated user profile role
  useEffect(() => {
    if (profile?.role) {
      switchRole(profile.role);
    }
  }, [profile?.role]);

  // Derive primary route segment
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const primaryRoute = pathSegments[0] === 'app'
    ? (pathSegments[1] || 'flow-board')
    : (pathSegments[0] || 'doctor');

  const meta = ROUTE_META[primaryRoute] || ROUTE_META['doctor'];

  const pageTitle = (profile?.role === 'PATIENT' || activeRole?.id === 'patient')
    ? 'My Care Journey'
    : meta.pageTitle;

  const handleNavSelect = (item) => {
    // Build correct role-scoped path based on authenticated user
    const userRole = profile?.role;
    const baseDashboard = getDashboardForRole(userRole);
    
    // Items that are sub-routes of the role dashboard
    const subRoutes = ['live-flow', 'readiness'];
    
    if (item.id === 'notifications') {
      navigate('/notifications');
    } else if (item.id === 'alerts') {
      // Admin gets /admin/alerts, others get /app/alerts
      if (userRole === 'ADMIN') {
        navigate('/admin/alerts');
      } else {
        navigate('/app/alerts');
      }
    } else if (item.id === 'reports') {
      if (userRole === 'ADMIN') {
        navigate('/admin/reports');
      } else {
        navigate('/app/reports');
      }
    } else if (item.id === 'analytics') {
      navigate('/app/analytics');
    } else if (item.id === 'settings') {
      navigate('/app/settings');
    } else if (item.id === 'flow-board') {
      // flow-board = the role's primary dashboard
      navigate(baseDashboard);
    } else if (subRoutes.includes(item.id) && userRole === 'DOCTOR') {
      navigate(`/doctor/${item.id}`);
    } else if (item.id === 'frontdesk') {
      navigate('/frontdesk');
    } else if (item.id === 'instruments') {
      navigate('/app/instruments');
    } else {
      navigate(`/app/${item.id}`);
    }
  };

  const handleAlertClick = () => {
    const userRole = profile?.role;
    if (userRole === 'ADMIN') {
      navigate('/admin/alerts');
    } else {
      navigate('/app/alerts');
    }
  };

  return (
    <AppLayout
      activeNav={primaryRoute}
      onNavSelect={handleNavSelect}
      pageTitle={pageTitle}
      breadcrumb={[meta.section, meta.label]}
      onAlertClick={handleAlertClick}
    >
      <Outlet />
    </AppLayout>
  );
};
