import React, { useState, useRef, useEffect } from 'react';
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
  Settings as SettingsIcon
} from 'lucide-react';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { UserProfileModal } from '../auth/UserProfileModal';
import { useRole, ROLES } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
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

  const [selectedHospital, setSelectedHospital] = useState('Apex Medical Center • Main Pavilion');
  const [showHospitalMenu, setShowHospitalMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const notifRef = useRef(null);
  const roleRef = useRef(null);
  const hospitalRef = useRef(null);
  const profileRef = useRef(null);

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

  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

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
              <div className="profile-dropdown-panel">
                {/* Profile Header Block */}
                <div className="profile-panel-header">
                  <div className={`user-avatar avatar-${activeRole?.badgeColor || 'purple'}`}>
                    <span>{initials}</span>
                  </div>
                  <div className="profile-panel-info">
                    <span className="profile-panel-name">{displayName}</span>
                    <span className="profile-panel-role">{displayRole}</span>
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
                    navigate('/app/settings');
                  }}
                >
                  <SettingsIcon size={15} className="panel-item-icon" />
                  <span>Account Settings</span>
                </button>

                <button
                  type="button"
                  className="profile-panel-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsNotifPanelOpen(true);
                  }}
                >
                  <Bell size={15} className="panel-item-icon" />
                  <span>Notification Preferences</span>
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
