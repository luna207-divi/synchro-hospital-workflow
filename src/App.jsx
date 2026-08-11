import React, { useState, useEffect } from 'react';
import { RoleProvider, useRole } from './context/RoleContext';
import { DemoProvider } from './context/DemoContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { DoctorPortal } from './components/portal/DoctorPortal';
import { PatientPortal } from './components/portal/PatientPortal';
import { LiveFlow } from './components/liveflow/LiveFlow';
import { SterileFlow } from './components/cssd/SterileFlow';
import { OTControl } from './components/theatres/OTControl';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';

/* ── Stub Pages for views not yet redesigned ────────────── */
const StubPage = ({ title, description }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '16px',
    textAlign: 'center'
  }}>
    <div style={{
      width: '64px',
      height: '64px',
      borderRadius: '16px',
      background: 'var(--status-cyan-bg)',
      border: '1px solid var(--status-cyan-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      color: 'var(--status-cyan-text)'
    }}>
      ⚡
    </div>
    <h2 style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-xl)',
      fontWeight: 700,
      color: 'var(--text-navy-head)',
      letterSpacing: '-0.02em'
    }}>
      {title}
    </h2>
    <p style={{
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      maxWidth: '400px',
      lineHeight: 1.5
    }}>
      {description}
    </p>
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--status-cyan-text)',
      padding: '4px 12px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--status-cyan-bg)',
      border: '1px solid var(--status-cyan-border)'
    }}>
      COMING IN PHASE 2
    </span>
  </div>
);

function AppContent() {
  const { activeRole, isNavAllowed } = useRole();
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'login' | 'platform'
  const [activeItem, setActiveItem] = useState({
    id: 'flow-board',
    label: 'Flow Board',
    section: 'Operations'
  });

  useEffect(() => {
    if (!isNavAllowed(activeItem.id)) {
      setActiveItem({
        id: 'flow-board',
        label: 'Flow Board',
        section: 'Operations'
      });
    }
  }, [activeRole, activeItem.id, isNavAllowed]);

  const handleNavSelect = (item) => {
    setActiveItem(item);
  };

  const handleTopBarAlertClick = () => {
    setActiveItem({
      id: 'alerts',
      label: 'Alerts',
      section: 'Intelligence'
    });
  };

  const handleNavigateToCSSD = () => {
    setActiveItem({
      id: 'instruments',
      label: 'Instruments',
      section: 'Operations'
    });
  };

  const handleNavigateToOTControl = () => {
    setActiveItem({
      id: 'readiness',
      label: 'OT Control Room',
      section: 'Operations'
    });
  };

  // Render Login Page
  if (viewMode === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={() => setViewMode('platform')} 
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  // Render Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage 
        onEnterPlatform={() => setViewMode('login')} 
      />
    );
  }

  // Render Platform Workspace Shell
  const renderContent = () => {
    // If patient role is active in top role switcher, render PatientPortal
    if (activeRole.id === 'patient') {
      return <PatientPortal />;
    }

    switch (activeItem.id) {
      case 'flow-board':
        return <DoctorPortal onNavigateToCSSD={handleNavigateToCSSD} onNavigateToOTControl={handleNavigateToOTControl} />;
      case 'live-flow':
        return <LiveFlow />;
      case 'instruments':
        return <SterileFlow onNavigateToOTControl={handleNavigateToOTControl} />;
      case 'readiness':
        return <OTControl onNavigateToCSSD={handleNavigateToCSSD} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'alerts':
        return <StubPage 
          title="Active Alerts" 
          description="Contextual workflow alerts grouped by severity. Auto-correlated to OT events, delay causes, and responsible departments." 
        />;
      case 'reports':
        return <StubPage 
          title="Management Reports" 
          description="Weekly and monthly executive summaries. PDF-ready reports with utilization benchmarks and improvement recommendations." 
        />;
      default:
        return <DoctorPortal onNavigateToCSSD={handleNavigateToCSSD} onNavigateToOTControl={handleNavigateToOTControl} />;
    }
  };

  const getPageTitle = () => {
    if (activeRole.id === 'patient') return 'My Care Journey';
    switch (activeItem.id) {
      case 'flow-board': return 'Command Workspace';
      case 'live-flow': return 'Live Flow Telemetry';
      case 'instruments': return 'SterileFlow CSSD';
      case 'readiness': return 'OT Control Room';
      case 'analytics': return 'Operational Analytics';
      case 'alerts': return 'Alerts';
      case 'reports': return 'Reports';
      default: return activeItem.label;
    }
  };

  return (
    <AppLayout
      activeNav={activeItem.id}
      onNavSelect={handleNavSelect}
      pageTitle={getPageTitle()}
      breadcrumb={[activeItem.section, activeItem.label]}
      onAlertClick={handleTopBarAlertClick}
    >
      {renderContent()}
    </AppLayout>
  );
}

export function App() {
  return (
    <RoleProvider>
      <DemoProvider>
        <AppContent />
      </DemoProvider>
    </RoleProvider>
  );
}

export default App;
