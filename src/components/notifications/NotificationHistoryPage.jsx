import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  CheckCircle2, 
  X, 
  Filter, 
  Search, 
  ExternalLink, 
  Settings, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  Building2,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { useNotificationEngine } from '../../hooks/useNotificationEngine';
import { NotificationPreferencesModal } from './NotificationPreferencesModal';
import './NotificationHistoryPage.css';

export const NotificationHistoryPage = () => {
  const navigate = useNavigate();
  const [statusTab, setStatusTab] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);

  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    acknowledge, 
    dismiss 
  } = useNotificationEngine({
    status: statusTab,
    department: deptFilter,
    search: searchQuery
  });

  const handleActionClick = (notif) => {
    markAsRead(notif.id);
    if (notif.actionRoute) {
      navigate(notif.actionRoute);
    } else if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  };

  return (
    <div className="notif-history-page">
      {/* 1. Header Card */}
      <div className="history-header-card">
        <div className="history-header-title-group">
          <div className="history-icon-box">
            <Bell size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="history-main-heading font-display">Notification History & Alerts</h1>
              {unreadCount > 0 ? (
                <Badge variant="red" size="xs">{unreadCount} Unread</Badge>
              ) : (
                <Badge variant="teal" size="xs">All Read</Badge>
              )}
            </div>
            <span className="history-subhead font-mono">
              Proactive multi-channel notification log, role routing, and audit trail
            </span>
          </div>
        </div>

        <div className="history-header-controls">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" icon={CheckCheck} onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}

          <Button 
            variant="primary" 
            size="sm" 
            icon={Settings}
            onClick={() => setIsPrefModalOpen(true)}
          >
            Preferences & Channels
          </Button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="history-filters-bar">
        <div className="filter-tabs-group">
          {['ALL', 'UNREAD', 'READ', 'ACKNOWLEDGED'].map((tab) => (
            <button
              key={tab}
              className={`history-tab-btn ${statusTab === tab ? 'is-active' : ''}`}
              onClick={() => setStatusTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            className="form-input" 
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            <option value="DOCTOR">Doctor</option>
            <option value="NURSING">Nursing</option>
            <option value="OT">Operating Theatres</option>
            <option value="CSSD">CSSD</option>
            <option value="BILLING">Billing</option>
            <option value="ADMIN">Admin</option>
          </select>

          <SearchInput
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '220px' }}
          />
        </div>
      </div>

      {/* 3. Notification History List */}
      <div className="history-list-container">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div 
              key={item.id}
              className={`history-card-item ${!item.is_read ? 'is-unread' : ''} ${item.priority === 'CRITICAL' ? 'is-critical' : ''} ${item.is_acknowledged ? 'is-acknowledged' : ''}`}
            >
              <div className="history-card-left">
                <div className={`notif-priority-indicator indicator-${item.priority ? item.priority.toLowerCase() : 'medium'}`} />

                <div className="history-item-content">
                  <div className="history-item-header">
                    <h3 className="history-item-title">{item.title}</h3>
                    <Badge variant={item.deptPillar || 'blue'} size="xs">{item.department || 'GENERAL'}</Badge>
                    <Badge variant={item.priority === 'CRITICAL' ? 'red' : item.priority === 'HIGH' ? 'amber' : 'teal'} size="xs">
                      {item.priority || 'MEDIUM'}
                    </Badge>
                  </div>

                  <p className="history-item-desc">{item.message || item.description}</p>

                  <div className="history-item-meta font-mono">
                    <span><Clock size={11} /> {item.time || new Date(item.timestamp).toLocaleTimeString()}</span>
                    {item.relatedOT && <span>• OT: <strong>{item.relatedOT}</strong></span>}
                    {item.relatedPatient && <span>• Patient: <strong>{item.relatedPatient}</strong></span>}
                    {item.is_acknowledged && (
                      <span className="text-teal" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> Acknowledged ({item.acknowledged_at ? new Date(item.acknowledged_at).toLocaleTimeString() : 'Done'})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="history-card-actions">
                {!item.is_acknowledged && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={Check} 
                    onClick={() => acknowledge(item.id)}
                    title="Acknowledge alert"
                  >
                    Acknowledge
                  </Button>
                )}

                <Button 
                  variant="primary" 
                  size="sm" 
                  icon={ExternalLink} 
                  onClick={() => handleActionClick(item)}
                >
                  {item.actionLabel || 'Go to Suite'}
                </Button>

                <button 
                  className="pref-close-btn" 
                  onClick={() => dismiss(item.id)}
                  title="Dismiss notification"
                  type="button"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-history-state">
            <Bell size={36} className="text-muted" style={{ opacity: 0.5, marginBottom: '12px' }} />
            <h3 className="font-display" style={{ color: 'var(--text-primary)', margin: '0 0 4px 0' }}>No notifications found</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
              No notification entries match your current filter settings.
            </p>
          </div>
        )}
      </div>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPrefModalOpen}
        onClose={() => setIsPrefModalOpen(false)}
      />
    </div>
  );
};
