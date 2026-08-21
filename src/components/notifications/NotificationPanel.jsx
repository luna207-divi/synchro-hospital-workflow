import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Check, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  ExternalLink, 
  X, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Settings,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { NotificationPreferencesModal } from './NotificationPreferencesModal';
import './NotificationPanel.css';

export const NotificationPanel = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAllAlerts,
  onNotificationClick,
  onAcknowledge,
  onDismiss
}) => {
  const navigate = useNavigate();
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);

  if (!isOpen) return null;

  // Group notifications by severity/group
  const criticalList = notifications.filter(n => n.group === 'Critical' || n.priority === 'CRITICAL' || n.severity === 'CRITICAL');
  const attentionList = notifications.filter(n => n.group === 'Attention' || n.priority === 'HIGH' || n.severity === 'ATTENTION');
  const infoList = notifications.filter(n => n.group === 'Information' || n.priority === 'MEDIUM' || n.priority === 'LOW' || n.severity === 'INFORMATION');

  const unreadCount = notifications.filter(n => !n.isRead && !n.is_read).length;

  const handleCardClick = (item) => {
    if (onMarkAsRead) onMarkAsRead(item.id);

    if (item.actionRoute) {
      navigate(item.actionRoute);
      onClose();
    } else if (item.actionUrl || item.action_url) {
      navigate(item.actionUrl || item.action_url);
      onClose();
    } else if (onNotificationClick) {
      onNotificationClick(item);
    }
  };

  return (
    <div className="ot-notification-panel ot-card" onClick={(e) => e.stopPropagation()}>
      {/* 1. Header */}
      <div className="notification-panel-header">
        <div className="notif-header-left">
          <div className="notif-bell-icon-box">
            <Bell size={15} className="text-primary" />
          </div>
          <div>
            <div className="notif-title-row">
              <h3 className="notif-main-title font-display">Notifications</h3>
              {unreadCount > 0 ? (
                <Badge variant="red" size="xs">{unreadCount} Unread</Badge>
              ) : (
                <Badge variant="teal" size="xs">All Caught Up</Badge>
              )}
            </div>
            <span className="notif-sub font-mono">Proactive multi-channel alerts</span>
          </div>
        </div>

        <div className="notif-header-actions">
          <button
            className="btn-close-notif"
            onClick={() => setIsPrefModalOpen(true)}
            title="Notification Engine Preferences"
            type="button"
            style={{ marginRight: '4px' }}
          >
            <Settings size={14} />
          </button>

          {unreadCount > 0 && (
            <button
              className="btn-mark-all-read font-mono"
              onClick={onMarkAllAsRead}
              type="button"
              title="Mark all notifications as read"
            >
              <CheckCheck size={13} />
              <span>Mark all read</span>
            </button>
          )}
          <button className="btn-close-notif" onClick={onClose} aria-label="Close notifications">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 2. Notifications Body */}
      <div className="notification-panel-body">
        {notifications.length === 0 && (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={28} style={{ opacity: 0.4, marginBottom: '8px' }} />
            <p className="font-mono" style={{ fontSize: '0.8rem', margin: 0 }}>No active notifications</p>
          </div>
        )}

        {/* Critical Group */}
        {criticalList.length > 0 && (
          <div className="notif-group-section">
            <div className="notif-group-header font-mono">
              <div className="group-header-label text-red">
                <AlertOctagon size={12} />
                <span>CRITICAL ({criticalList.length})</span>
              </div>
              <span className="group-action-hint">Immediate action required</span>
            </div>

            <div className="notif-items-list">
              {criticalList.map((item) => (
                <div
                  key={item.id}
                  className={`notif-item-card severity-critical ${!(item.isRead || item.is_read) ? 'is-unread' : 'is-read'}`}
                  onClick={() => handleCardClick(item)}
                >
                  <div className="notif-card-top">
                    <div className="notif-dept-row">
                      {!(item.isRead || item.is_read) && <span className="unread-pulse-dot dot-red" />}
                      <Badge variant={item.deptPillar || 'red'} size="xs">{item.department || 'ALERT'}</Badge>
                      <span className="notif-time font-mono">{item.time || 'Just now'}</span>
                    </div>

                    {!(item.isRead || item.is_read) && (
                      <button
                        className="btn-mark-single-read font-mono"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onMarkAsRead) onMarkAsRead(item.id);
                        }}
                        type="button"
                        title="Mark as read"
                      >
                        <Check size={11} />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>

                  <h4 className="notif-title font-display">{item.title}</h4>
                  <p className="notif-desc">{item.message || item.desc}</p>
                  
                  {item.actionLabel && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                      <span>{item.actionLabel}</span>
                      <ChevronRight size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attention Group */}
        {attentionList.length > 0 && (
          <div className="notif-group-section">
            <div className="notif-group-header font-mono">
              <div className="group-header-label text-amber">
                <AlertTriangle size={12} />
                <span>ATTENTION ({attentionList.length})</span>
              </div>
              <span className="group-action-hint">Workflow lag warning</span>
            </div>

            <div className="notif-items-list">
              {attentionList.map((item) => (
                <div
                  key={item.id}
                  className={`notif-item-card severity-attention ${!(item.isRead || item.is_read) ? 'is-unread' : 'is-read'}`}
                  onClick={() => handleCardClick(item)}
                >
                  <div className="notif-card-top">
                    <div className="notif-dept-row">
                      {!(item.isRead || item.is_read) && <span className="unread-pulse-dot dot-amber" />}
                      <Badge variant={item.deptPillar || 'indigo'} size="xs">{item.department || 'OT'}</Badge>
                      <span className="notif-time font-mono">{item.time || 'Just now'}</span>
                    </div>

                    {!(item.isRead || item.is_read) && (
                      <button
                        className="btn-mark-single-read font-mono"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onMarkAsRead) onMarkAsRead(item.id);
                        }}
                        type="button"
                        title="Mark as read"
                      >
                        <Check size={11} />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>

                  <h4 className="notif-title font-display">{item.title}</h4>
                  <p className="notif-desc">{item.message || item.desc}</p>
                  
                  {item.actionLabel && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                      <span>{item.actionLabel}</span>
                      <ChevronRight size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information Group */}
        {infoList.length > 0 && (
          <div className="notif-group-section">
            <div className="notif-group-header font-mono">
              <div className="group-header-label text-teal">
                <Info size={12} />
                <span>INFORMATION ({infoList.length})</span>
              </div>
              <span className="group-action-hint">Operational readiness</span>
            </div>

            <div className="notif-items-list">
              {infoList.map((item) => (
                <div
                  key={item.id}
                  className={`notif-item-card severity-info ${!(item.isRead || item.is_read) ? 'is-unread' : 'is-read'}`}
                  onClick={() => handleCardClick(item)}
                >
                  <div className="notif-card-top">
                    <div className="notif-dept-row">
                      {!(item.isRead || item.is_read) && <span className="unread-pulse-dot dot-teal" />}
                      <Badge variant={item.deptPillar || 'blue'} size="xs">{item.department || 'SYSTEM'}</Badge>
                      <span className="notif-time font-mono">{item.time || 'Just now'}</span>
                    </div>

                    {!(item.isRead || item.is_read) && (
                      <button
                        className="btn-mark-single-read font-mono"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onMarkAsRead) onMarkAsRead(item.id);
                        }}
                        type="button"
                        title="Mark as read"
                      >
                        <Check size={11} />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>

                  <h4 className="notif-title font-display">{item.title}</h4>
                  <p className="notif-desc">{item.message || item.desc}</p>

                  {item.actionLabel && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                      <span>{item.actionLabel}</span>
                      <ChevronRight size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer */}
      <div className="notification-panel-footer">
        <button
          className="btn-view-all-alerts font-mono"
          onClick={() => {
            navigate('/notifications');
            onClose();
          }}
          type="button"
        >
          <span>View all notifications & preferences</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPrefModalOpen}
        onClose={() => setIsPrefModalOpen(false)}
      />
    </div>
  );
};

