import React from 'react';
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

/* ── Page Components ──────────────────────────────────────── */
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppShell } from './AppShell';

/* Dashboard Views */
import { DoctorPortal } from './components/portal/DoctorPortal';
import { BillingPortal } from './components/portal/BillingPortal';
import { LiveFlow } from './components/liveflow/LiveFlow';
import { OTControl } from './components/theatres/OTControl';
import { SterileFlow } from './components/cssd/SterileFlow';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { PatientPortal } from './components/portal/PatientPortal';
import { AdmissionsPage } from './components/admissions/AdmissionsPage';
import { CSSDPage } from './components/cssd/CSSDPage';
import { NursingPortal } from './components/cssd/NursingPortal';
import { ReportsPage } from './components/reports/ReportsPage';
import { AlertsPage } from './components/alerts/AlertsPage';
import { PatientsPage } from './components/patients/PatientsPage';
import { NotificationHistoryPage } from './components/notifications/NotificationHistoryPage';
import { AdminPortal } from './components/portal/AdminPortal';

export const router = createBrowserRouter([
  /* ── Public Routes ──────────────────────────────────────── */
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },

  /* ── Role Dashboards (Wrapped in Protected AppShell & Guards) ── */

  // 1. FRONT_DESK Dashboard (/frontdesk)
  {
    path: '/frontdesk',
    element: <ProtectedRoute allowedRoles={['FRONT_DESK', 'ADMISSIONS_STAFF', 'ADMIN', 'HOSPITAL_ADMIN']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <AdmissionsPage /> }
        ]
      }
    ]
  },

  // 2. NURSING Dashboard (/nursing)
  {
    path: '/nursing',
    element: <ProtectedRoute allowedRoles={['NURSING', 'NURSE', 'CSSD_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <NursingPortal /> },
          { path: 'cssd', element: <NursingPortal /> }
        ]
      }
    ]
  },

  // 3. DOCTOR Dashboard (/doctor)
  {
    path: '/doctor',
    element: <ProtectedRoute allowedRoles={['DOCTOR', 'SURGEON', 'OT_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DoctorPortal /> },
          { path: 'live-flow', element: <LiveFlow /> },
          { path: 'readiness', element: <OTControl /> },
          { path: 'patients', element: <PatientsPage /> }
        ]
      }
    ]
  },

  // 4. BILLING Dashboard (/billing)
  {
    path: '/billing',
    element: <ProtectedRoute allowedRoles={['BILLING', 'ADMIN', 'HOSPITAL_ADMIN']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <BillingPortal /> }
        ]
      }
    ]
  },

  // 5. ADMIN Dashboard (/admin)
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['ADMIN', 'HOSPITAL_ADMIN']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <AdminPortal /> },
          { path: 'alerts', element: <AlertsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'patients', element: <PatientsPage /> }
        ]
      }
    ]
  },

  // 6. Global Notifications Page (/notifications)
  {
    path: '/notifications',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <NotificationHistoryPage /> }
        ]
      }
    ]
  },

  /* ── Alias Protected Dashboard Routes ──────────────────────── */
  {
    path: '/front-desk',
    element: <ProtectedRoute allowedRoles={['FRONT_DESK', 'ADMISSIONS_STAFF', 'ADMIN', 'HOSPITAL_ADMIN']} />,
    children: [
      { index: true, element: <Navigate to="/frontdesk" replace /> }
    ]
  },
  {
    path: '/cssd',
    element: <ProtectedRoute allowedRoles={['NURSING', 'NURSE', 'CSSD_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN']} />,
    children: [
      { index: true, element: <Navigate to="/nursing" replace /> }
    ]
  },
  {
    path: '/ot',
    element: <ProtectedRoute allowedRoles={['DOCTOR', 'SURGEON', 'OT_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN']} />,
    children: [
      { index: true, element: <Navigate to="/doctor" replace /> }
    ]
  },

  /* ── General /app/* Navigation Backwards Compatibility ── */
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/doctor" replace /> },
          { path: 'frontdesk', element: <AdmissionsPage /> },
          { path: 'flow-board', element: <DoctorPortal /> },
          { path: 'live-flow', element: <LiveFlow /> },
          { path: 'readiness', element: <OTControl /> },
          { path: 'instruments', element: <SterileFlow /> },
          { path: 'patients', element: <PatientsPage /> },
          { path: 'alerts', element: <AlertsPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'notifications', element: <NotificationHistoryPage /> },
          { path: 'patient', element: <PatientPortal /> }
        ]
      }
    ]
  },

  /* ── Catch-all Redirect ─────────────────────────────────── */
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
