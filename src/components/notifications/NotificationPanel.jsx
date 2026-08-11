import React from 'react';
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
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './NotificationPanel.css';

export const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAllAlerts,
  onNotificationClick
}) => {
  if (!isOpen) return null;

  // Group notifications by severity
  const criticalList = notifications.filter(n => n.group === 'Critical');
  const attentionList = notifications.filter(n => n.group === 'Attention');
  const infoList = notifications.filter(n => n.group === 'Information');

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <span className="notif-sub font-mono">Real-time hospital alerts</span>
          </div>
        </div>

        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <button
              className="btn-mark-all-read font-mono"
              onClick={onMarkAllAsRead}
              type="button"
              title="Mark all notifications as read"
            >
              <CheckCheck size={13} />
              <span>Mark all as read</span>
            </button>
          )}
          <button className="btn-close-notif" onClick={onClose} aria-label="Close notifications">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 2. Notifications Body (Grouped by Critical, Attention, Information) */}
      <div className="notification-panel-body">
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
                  className={`notif-item-card severity-critical ${!item.isRead ? 'is-unread' : 'is-read'}`}
                  onClick={() => {
                    onNotificationClick(item);
                    if (!item.isRead) onMarkAsRead(item.id);
                  }}
                >
                  <div className="notif-card-top">
                    <div className="notif-dept-row">
                      {!item.isRead && <span className="unread-pulse-dot dot-red" />}
                      <Badge variant={item.deptPillar} size="xs">{item.department}</Badge>
                      <span className="notif-time font-mono">{item.time}</span>
                    </div>

                    {!item.isRead && (
                      <button
                        className="btn-mark-single-read font-mono"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(item.id);
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
                  <p className="notif-desc">{item.desc}</p>
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
                  className={`notif-item-card severity-attention ${!item.isRead ? 'is-unread' : 'is-read'}`}
                  onClick={() => {
                    onNotificationClick(item);
                    if (!item.isRead) onMarkAsRead(item.id);
                  }}
                >
                  <div className="notif-card-top">
                    <div className="notif-dept-row">
                      {!item.isRead && <span className="unread-pulse-dot dot-amber" />}
                      <Badge variant={item.deptPillar} size="xs">{item.department}</Badge>
                      <span className="notif-time font-mono">{item.time}</span>
                    </div>

                    {!item.isRead && (
                      <button
                        className="btn-mark-single-read font-mono"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(item.id);
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
                  <p className="notif-desc">{item.desc}</p>
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
                  className={`notif-item-card severity-info ${!item.isRead ? 'is-unread' : 'is-read'}`}
                  onClick={() => {
                    onNotificationClick(item);
                    if (!item.isRead) onMarkAsRead(item.id);
                  }}
                >
                  <div className="notif-card-top">
                    <div className="notif-dept-row">
                      {!item.isRead && <span className="unread-pulse-dot dot-teal" />}
                      <Badge variant={item.deptPillar} size="xs">{item.department}</Badge>
                      <span className="notif-time font-mono">{item.time}</span>
                    </div>

                    {!item.isRead && (
                      <button
                        className="btn-mark-single-read font-mono"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(item.id);
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
                  <p className="notif-desc">{item.desc}</p>
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
            onViewAllAlerts();
            onClose();
          }}
          type="button"
        >
          <span>View all alerts</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};
