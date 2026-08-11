import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Bell, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Check, 
  Search, 
  UserCog
} from 'lucide-react';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { useRole, ROLES } from '../../context/RoleContext';
import './Header.css';

/**
 * SYNCHRO Top Bar
 * 
 * Contains:
 * - Breadcrumb & page title (left)
 * - Live time indicator (center)
 * - Quick search, role switcher, hospital selector,
 *   notification bell, user profile (right)
 */
export const Header = ({
  pageTitle = 'Flow Board',
  breadcrumb = ['Operations', 'Flow Board'],
  onAlertClick,
  onOpenSearch
}) => {
  const { activeRole, switchRole } = useRole();
  const [selectedHospital, setSelectedHospital] = useState('Apex Medical Center • Main Pavilion');
  const [showHospitalMenu, setShowHospitalMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const notifRef = useRef(null);
  const roleRef = useRef(null);
  const hospitalRef = useRef(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Managed Notifications State
  const [notifications, setNotifications] = useState([
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
    },
    {
      id: 'NOTIF-3',
      group: 'Attention',
      title: 'OT-03 turnover exceeds expected duration.',
      desc: 'Turnover duration currently at 34m against 25m hospital benchmark target.',
      time: '12 mins ago',
      department: 'OT',
      deptPillar: 'indigo',
      isRead: false
    },
    {
      id: 'NOTIF-4',
      group: 'Attention',
      title: 'Patient transfer pending.',
      desc: 'Porter transport dispatch for Patient P-1024 delayed by radiology transfer in 4C.',
      time: '16 mins ago',
      department: 'Admissions',
      deptPillar: 'blue',
      isRead: false
    },
    {
      id: 'NOTIF-5',
      group: 'Information',
      title: 'Patient P-1024 is now OT ready.',
      desc: 'Elena Rostova 100% pre-op cleared and marked for OT-02 Total Knee Replacement.',
      time: '18 mins ago',
      department: 'Admissions',
      deptPillar: 'blue',
      isRead: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif) => {
    setIsNotifPanelOpen(false);
    onAlertClick();
  };

  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <header className="synchro-header">
      {/* Left: Breadcrumb & Page Title */}
      <div className="header-left">
        <div className="header-breadcrumb">
          {breadcrumb.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight size={11} className="breadcrumb-separator" />}
              <span className={`breadcrumb-item ${idx === breadcrumb.length - 1 ? 'is-current' : ''}`}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
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
        {/* Search Trigger */}
        <button
          className="header-search-trigger"
          onClick={onOpenSearch}
          type="button"
          aria-label="Open Quick Search"
        >
          <Search size={14} className="search-trigger-icon" />
          <span className="search-trigger-text">Search patients, OTs, packs...</span>
          <span className="search-trigger-kbd">⌘K</span>
        </button>

        {/* Role Switcher */}
        <div className="role-switcher-wrapper" ref={roleRef}>
          <button
            className="role-trigger"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            type="button"
            aria-expanded={showRoleMenu}
          >
            <UserCog size={14} className="role-trigger-icon" />
            <span>{activeRole.name}</span>
            <span className="role-demo-tag">Demo</span>
            <ChevronDown size={12} className="role-trigger-chevron" />
          </button>

          {showRoleMenu && (
            <div className="role-dropdown">
              <div className="dropdown-header">Select Clinical Persona</div>
              {Object.values(ROLES).map((role) => (
                <button
                  key={role.id}
                  className={`role-option ${activeRole.id === role.id ? 'is-selected' : ''}`}
                  onClick={() => {
                    switchRole(role.id);
                    setShowRoleMenu(false);
                  }}
                  type="button"
                >
                  <div className="role-option-text">
                    <div className="role-option-name-row">
                      <span className="role-option-name">{role.name}</span>
                      <span className="role-option-user">{role.userName}</span>
                    </div>
                    <span className="role-option-desc">{role.description}</span>
                  </div>
                  {activeRole.id === role.id && <Check size={14} className="option-check" />}
                </button>
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
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </button>

          <NotificationPanel
            isOpen={isNotifPanelOpen}
            onClose={() => setIsNotifPanelOpen(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onViewAllAlerts={onAlertClick}
            onNotificationClick={handleNotificationClick}
          />
        </div>

        {/* User Profile */}
        <div className="header-user-profile">
          <div className={`user-avatar avatar-${activeRole.badgeColor}`}>
            <span>{activeRole.avatarInitials}</span>
          </div>
          <div className="user-info">
            <span className="user-name">{activeRole.userName}</span>
            <span className="user-role">
              <ShieldCheck size={10} className="user-role-shield" />
              <span>{activeRole.userRole}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
