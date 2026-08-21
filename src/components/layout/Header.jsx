import React, { useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Bell, 
  ChevronDown, 
  ChevronRight,
  ArrowLeft,
  ShieldCheck, 
  Check, 
  UserCog,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Search,
  X
} from 'lucide-react';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { UserProfileModal } from '../auth/UserProfileModal';
import { useRole, ROLES } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { useWorkflow } from '../../context/WorkflowContext';
import { getDashboardForRole } from '../../config/roles';
import { useNotificationEngine } from '../../hooks/useNotificationEngine';
import './Header.css';

/**
 * SYNCHRO Top Bar
 * 
 * Features:
 * - Breadcrumb & page title (left)
 * - Live time indicator (center)
 * - Quick search, hospital selector, notification bell
 * - User Profile Dropdown Menu (My Profile, Notifications, Settings, Logout)
 */
export const Header = ({
  pageTitle = 'Flow Board',
  breadcrumb = ['Operations', 'Flow Board'],
  onAlertClick,
  onOpenSearch
}) => {
  const navigate = useNavigate();
  const { activeRole, switchRole } = useRole();
  const { user, profile, signOut } = useAuth();
  const { 
    allNotifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    acknowledge, 
    dismiss 
  } = useNotificationEngine();

  const workflow = useWorkflow();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState('Apex Medical Center • Main Pavilion');
  const [showHospitalMenu, setShowHospitalMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);

  const notifRef = useRef(null);
  const roleRef = useRef(null);
  const hospitalRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Search Results
  const searchResults = useMemo(() => {
    const q = (globalSearchQuery || '').toLowerCase().trim();
    if (!q) return [];
    
    const matchedPatients = (workflow.patients || []).filter(p => 
      (p.full_name || '').toLowerCase().includes(q) ||
      (p.patient_code || '').toLowerCase().includes(q) ||
      (p.procedure || '').toLowerCase().includes(q)
    ).slice(0, 4).map(p => ({ type: 'PATIENT', label: `${p.full_name} (${p.patient_code})`, sub: p.procedure, item: p }));

    const matchedPacks = (workflow.cssd_packs || []).filter(pack => 
      (pack.pack_code || '').toLowerCase().includes(q) ||
      (pack.pack_type || '').toLowerCase().includes(q)
    ).slice(0, 3).map(pack => ({ type: 'CSSD_PACK', label: `${pack.pack_code} • ${pack.pack_type}`, sub: `Status: ${pack.status}`, item: pack }));

    const matchedOTs = (workflow.operatingTheatres || []).filter(ot => 
      (ot.suite_code || '').toLowerCase().includes(q) ||
      (ot.name || '').toLowerCase().includes(q)
    ).slice(0, 2).map(ot => ({ type: 'OT', label: `${ot.suite_code} — ${ot.name}`, sub: `Surgeon: ${ot.surgeon}`, item: ot }));

    return [...matchedPatients, ...matchedPacks, ...matchedOTs];
  }, [globalSearchQuery, workflow]);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const defaultNotifs = [
    {
      id: 'NOTIF-1',
      group: 'Critical',
      title: 'Expired CSSD pack detected.',
      desc: 'Pack CSSD-EXP-09 (General Laparotomy Set #02) exceeded 72-hour sterile validity in Storage B.',
      time: '4 mins ago',
      department: 'CSSD',
      deptPillar: 'teal',
      isRead: false
    },
    {
      id: 'NOTIF-2',
      group: 'Critical',
      title: 'Required instrument pack unavailable.',
      desc: 'Tray CSSD-00142 delayed in Autoclave #2 cooldown. OT-03 scheduled incision delayed.',
      time: '22 mins ago',
      department: 'CSSD',
      deptPillar: 'teal',
      isRead: false
    }
  ];

  const mergedNotifications = allNotifications.length > 0 ? allNotifications : defaultNotifs;
  const activeUnreadCount = unreadCount > 0 ? unreadCount : mergedNotifications.filter(n => !(n.isRead || n.is_read)).length;

  const hospitalsList = [
    'Apex Medical Center • Main Pavilion',
    'Apex Medical Center • West Tower',
    'St. Jude Memorial • Surgical Center'
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifPanelOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setShowRoleMenu(false);
      }
      if (hospitalRef.current && !hospitalRef.current.contains(e.target)) {
        setShowHospitalMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleNotificationClick = (notif) => {
    setIsNotifPanelOpen(false);
    if (onAlertClick) onAlertClick();
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    try {
      await signOut();
    } catch (err) {
      // Ignore fallback signout error
    }
    navigate('/login', { replace: true });
  };

  const handleLogoRedirect = () => {
    const userRole = profile?.role || activeRole?.id;
    const targetDashboard = getDashboardForRole(userRole);
    navigate(targetDashboard);
  };

  const timeStr = currentTime ? currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }) : '12:00:00';

  const rawName = profile?.display_name || activeRole?.userName || 'Dr. Rajesh Sharma, MD';
  const displayName = rawName.replace(/^Dr\.\s*Dr\./i, 'Dr.').replace(/^Dr\.\s*Dr\s+/i, 'Dr. ');
  const displayRole = profile?.job_title || (profile?.role ? profile.role.replace('_', ' ') : activeRole?.userRole) || 'Chief Medical Lead';
  const initials = profile?.avatar_initials || (displayName ? displayName.replace(/^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DR');

  return (
    <>
      <header className="synchro-header">
        {/* Left: Functional Back/Breadcrumb & Page Title */}
        <div className="header-left">
          <div className="header-breadcrumb">
            <button 
              type="button" 
              className="breadcrumb-back-link"
              onClick={handleLogoRedirect}
              title="Return to Parent Dashboard"
            >
              <ArrowLeft size={13} className="breadcrumb-back-arrow" />
              <span>{breadcrumb[0] || 'Desk'}</span>
            </button>

            {breadcrumb[1] && (
              <>
                <ChevronRight size={11} className="breadcrumb-separator" />
                <span className="breadcrumb-item is-current">
                  {breadcrumb[1]}
                </span>
              </>
            )}
          </div>
          <h1 className="header-page-title">{pageTitle}</h1>
        </div>

        {/* Center: Live Indicator */}
        <div className="header-live-badge">
          <span className="header-live-dot" />
          <span className="header-live-label">Live</span>
          <span className="header-live-time">{timeStr}</span>
        </div>

        {/* Right Zone */}
        <div className="header-right">
          {/* Global Search Bar */}
          <div style={{ position: 'relative' }} ref={searchRef}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '4px 10px',
              width: '220px'
            }}>
              <Search size={14} style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search patient, MRN, pack, OT..."
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '11px',
                  fontFamily: 'var(--font-sans)',
                  width: '100%',
                  color: 'var(--text-primary)'
                }}
              />
              {globalSearchQuery && (
                <X size={12} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setGlobalSearchQuery('')} />
              )}
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                width: '320px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                padding: '8px',
                zIndex: 1100
              }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', padding: '4px 8px', borderBottom: '1px solid #f1f5f9' }}>
                  SEARCH MATCHES ({searchResults.length})
                </div>
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setShowSearchResults(false);
                      setGlobalSearchQuery('');
                      if (res.type === 'PATIENT') navigate('/app/patients');
                      else if (res.type === 'CSSD_PACK') navigate('/cssd');
                      else if (res.type === 'OT') navigate('/ot');
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      marginTop: '4px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-navy-head)' }}>{res.label}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{res.sub}</div>
                    </div>
                    <span className="font-mono" style={{ fontSize: '9px', fontWeight: 700, color: '#2563eb', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#eff6ff' }}>
                      {res.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hospital Selector */}
          <div className="hospital-selector-wrapper" ref={hospitalRef}>
            <button
              className="hospital-trigger"
              onClick={() => setShowHospitalMenu(!showHospitalMenu)}
              type="button"
              aria-expanded={showHospitalMenu}
            >
              <Building2 size={15} className="hospital-trigger-icon" />
              <span>{selectedHospital}</span>
              <ChevronDown size={12} className="hospital-trigger-chevron" />
            </button>

            {showHospitalMenu && (
              <div className="hospital-dropdown">
                <div className="dropdown-header">Select Hospital Facility</div>
                {hospitalsList.map((hosp) => (
                  <button
                    key={hosp}
                    className={`hospital-option ${selectedHospital === hosp ? 'is-selected' : ''}`}
                    onClick={() => {
                      setSelectedHospital(hosp);
                      setShowHospitalMenu(false);
                    }}
                    type="button"
                  >
                    <span>{hosp}</span>
                    {selectedHospital === hosp && <Check size={13} className="option-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="notification-anchor" ref={notifRef}>
            <button
              className={`header-notification-btn ${isNotifPanelOpen ? 'is-active' : ''}`}
              aria-label="View notifications"
              onClick={() => setIsNotifPanelOpen(!isNotifPanelOpen)}
              type="button"
            >
              <Bell size={17} />
              {activeUnreadCount > 0 && (
                <span className="notification-count">{activeUnreadCount}</span>
              )}
            </button>

            <NotificationPanel
              isOpen={isNotifPanelOpen}
              onClose={() => setIsNotifPanelOpen(false)}
              notifications={mergedNotifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onViewAllAlerts={onAlertClick}
              onNotificationClick={handleNotificationClick}
              onAcknowledge={acknowledge}
              onDismiss={dismiss}
            />
          </div>

          {/* User Profile Dropdown Menu */}
          <div className="role-switcher-wrapper" ref={profileRef}>
            <div 
              className="header-user-profile" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`user-avatar avatar-${activeRole?.badgeColor || 'purple'}`}>
                <span>{initials}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{displayName}</span>
                <span className="user-role">{displayRole}</span>
              </div>
              <ChevronDown size={14} className="user-dropdown-arrow" />
            </div>

            {showProfileMenu && (
              <div className="profile-dropdown-panel font-sans">
                {/* Profile Header Block */}
                <div className="profile-panel-header">
                  <div className={`user-avatar avatar-${activeRole?.badgeColor || 'purple'}`}>
                    <span>{initials}</span>
                  </div>
                  <div className="profile-panel-info">
                    <span className="profile-panel-name">{displayName}</span>
                    <span className="profile-panel-role" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {(profile?.role || activeRole?.id || 'DOCTOR').toUpperCase()} • {profile?.department || 'Clinical Operations'}
                    </span>
                  </div>
                </div>

                <div className="profile-panel-divider" />
                
                {/* Menu Actions */}
                <button
                  type="button"
                  className="profile-panel-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowProfileModal(true);
                  }}
                >
                  <UserIcon size={15} className="panel-item-icon" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  className="profile-panel-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert(`SESSION INFO: Authenticated as ${profile?.email || 'user@synchro.health'} (${profile?.role || 'STAFF'}). Session active.`);
                  }}
                >
                  <ShieldCheck size={15} className="panel-item-icon" />
                  <span>Session Information</span>
                </button>

                <div className="profile-panel-divider" />

                <button
                  type="button"
                  className="profile-panel-item is-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={15} className="panel-item-icon" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <UserProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};
