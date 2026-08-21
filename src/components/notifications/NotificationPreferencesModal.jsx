import React from 'react';
import { 
  X, 
  Bell, 
  Smartphone, 
  Mail, 
  Radio, 
  MessageSquare, 
  ShieldCheck, 
  ShieldAlert,
  Volume2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Button } from '../common/Button';
import { useNotificationEngine } from '../../hooks/useNotificationEngine';
import './NotificationPreferencesModal.css';

export const NotificationPreferencesModal = ({ isOpen, onClose }) => {
  const { 
    preferences, 
    updatePreferences, 
    browserPermission, 
    requestBrowserPermission,
    sendTestNotification
  } = useNotificationEngine();

  if (!isOpen) return null;

  const handleChannelToggle = (channelKey) => {
    updatePreferences({
      channels: {
        ...preferences.channels,
        [channelKey]: !preferences.channels[channelKey]
      }
    });
  };

  const handlePrivacyToggle = () => {
    updatePreferences({
      maskPHIOnExternalBanners: !preferences.maskPHIOnExternalBanners
    });
  };

  return (
    <div className="notif-pref-backdrop" onClick={onClose}>
      <div className="notif-pref-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notif-pref-header">
          <div className="pref-title-group">
            <div className="pref-icon-box">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="pref-main-title font-display">Notification Engine Preferences</h3>
              <span className="pref-subtitle font-mono">Proactive Multi-Channel Routing & PHI Security Settings</span>
            </div>
          </div>
          <button className="pref-close-btn" onClick={onClose} aria-label="Close settings">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="notif-pref-body">
          {/* Section 1: Active Channels */}
          <div>
            <div className="pref-section-title font-mono">
              <Radio size={14} className="text-teal" />
              <span>Communication Channels & Adapters</span>
            </div>

            <div className="pref-channels-grid">
              {/* 1. In-App Toasts & Bell */}
              <div className={`pref-channel-card ${preferences.channels.inApp ? 'is-active' : ''}`}>
                <div className="channel-info-col">
                  <Bell size={18} className="channel-icon text-primary" />
                  <div>
                    <div className="channel-name">In-App Floating Toasts</div>
                    <div className="channel-desc">Realtime in-app alerts & bell panel</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle-switch" 
                  checked={preferences.channels.inApp}
                  onChange={() => handleChannelToggle('inApp')}
                />
              </div>

              {/* 2. Browser Push */}
              <div className={`pref-channel-card ${preferences.channels.browserPush ? 'is-active' : ''}`}>
                <div className="channel-info-col">
                  <Smartphone size={18} className="channel-icon text-cyan" />
                  <div>
                    <div className="channel-name">Browser Native Push</div>
                    <div className="channel-desc">OS desktop alerts (Web Notification API)</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle-switch" 
                  checked={preferences.channels.browserPush}
                  onChange={() => handleChannelToggle('browserPush')}
                />
              </div>

              {/* 3. SMS Gateway */}
              <div className={`pref-channel-card ${preferences.channels.sms ? 'is-active' : ''}`}>
                <div className="channel-info-col">
                  <Smartphone size={18} className="channel-icon text-amber" />
                  <div>
                    <div className="channel-name">SMS Gateway (Twilio)</div>
                    <div className="channel-desc">Integration ready for emergency SMS</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle-switch" 
                  checked={preferences.channels.sms}
                  onChange={() => handleChannelToggle('sms')}
                />
              </div>

              {/* 4. Email Adapter */}
              <div className={`pref-channel-card ${preferences.channels.email ? 'is-active' : ''}`}>
                <div className="channel-info-col">
                  <Mail size={18} className="channel-icon text-purple" />
                  <div>
                    <div className="channel-name">Clinical Email (SES / SendGrid)</div>
                    <div className="channel-desc">Integration ready for shift reports</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle-switch" 
                  checked={preferences.channels.email}
                  onChange={() => handleChannelToggle('email')}
                />
              </div>

              {/* 5. Hospital Pager */}
              <div className={`pref-channel-card ${preferences.channels.pager ? 'is-active' : ''}`}>
                <div className="channel-info-col">
                  <Radio size={18} className="channel-icon text-red" />
                  <div>
                    <div className="channel-name">Hospital Pager (SNPP)</div>
                    <div className="channel-desc">Integration ready TAP/SNPP pager adapter</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle-switch" 
                  checked={preferences.channels.pager}
                  onChange={() => handleChannelToggle('pager')}
                />
              </div>

              {/* 6. MS Teams / Slack */}
              <div className={`pref-channel-card ${preferences.channels.enterpriseTeams ? 'is-active' : ''}`}>
                <div className="channel-info-col">
                  <MessageSquare size={18} className="channel-icon text-teal" />
                  <div>
                    <div className="channel-name">MS Teams / Slack</div>
                    <div className="channel-desc">Enterprise webhook adaptive cards</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle-switch" 
                  checked={preferences.channels.enterpriseTeams}
                  onChange={() => handleChannelToggle('enterpriseTeams')}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Browser Permission Status */}
          <div>
            <div className="pref-section-title font-mono">
              <Smartphone size={14} className="text-cyan" />
              <span>Native OS Browser Push Status</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-surface-card)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Permission Status: <strong style={{ color: browserPermission === 'granted' ? '#10b981' : '#f59e0b' }}>{browserPermission?.toUpperCase()}</strong>
                </span>
                <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Proactively alerts staff on OS desktop without needing to keep Synchro open.
                </p>
              </div>

              {browserPermission !== 'granted' && (
                <Button variant="primary" size="sm" onClick={requestBrowserPermission}>
                  Enable Push
                </Button>
              )}
            </div>
          </div>

          {/* Section 3: HIPAA PHI Privacy Protection */}
          <div>
            <div className="pref-section-title font-mono">
              <Lock size={14} className="text-emerald" />
              <span>HIPAA / Patient Privacy Safeguards</span>
            </div>

            <div className={`privacy-banner-card ${!preferences.maskPHIOnExternalBanners ? 'is-warning' : ''}`}>
              {preferences.maskPHIOnExternalBanners ? (
                <ShieldCheck size={24} className="privacy-icon" />
              ) : (
                <ShieldAlert size={24} className="privacy-icon" />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 className="privacy-title">Mask Patient Medical Information on External OS Banners</h4>
                  <input 
                    type="checkbox" 
                    className="toggle-switch" 
                    checked={preferences.maskPHIOnExternalBanners}
                    onChange={handlePrivacyToggle}
                  />
                </div>
                <p className="privacy-desc">
                  When enabled, browser push popups and SMS banners replace sensitive clinical patient names with Suite codes (e.g. <em>"OT-405 Instruments Ready"</em> instead of displaying patient names on unencrypted OS screens).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="notif-pref-footer">
          <Button variant="ghost" size="sm" onClick={sendTestNotification}>
            🧪 Send Test Alert (Doctor OT-405)
          </Button>

          <Button variant="primary" size="md" icon={CheckCircle2} onClick={onClose}>
            Save & Done
          </Button>
        </div>
      </div>
    </div>
  );
};
