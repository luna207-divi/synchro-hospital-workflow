import React from 'react';
import { 
  Workflow, 
  AlertTriangle, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Bell,
  Package,
  FileBarChart
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import './Sidebar.css';

/**
 * SYNCHRO Sidebar Navigation
 * 
 * Glassmorphic panel with:
 * - Synchro brand mark + tagline
 * - 6 primary views grouped by function
 * - Live system status indicator
 * - Bottom utility nav (Settings, Help)
 */
export const Sidebar = ({ activeNav = 'flow-board', onNavSelect }) => {
  const { isNavAllowed } = useRole();

  const allSections = [
    {
      title: 'Operations',
      items: [
        {
          id: 'flow-board',
          label: 'Flow Board',
          icon: Workflow,
          section: 'Operations',
          description: 'Live surgical pipeline'
        },
        {
          id: 'live-flow',
          label: 'Live Flow',
          icon: Workflow,
          section: 'Operations',
          description: 'See hospital move live'
        },
        {
          id: 'readiness',
          label: 'Readiness',
          icon: ClipboardCheck,
          section: 'Operations',
          description: 'Pre-flight gate checks'
        },
        {
          id: 'instruments',
          label: 'Instruments',
          icon: Package,
          section: 'Operations',
          description: 'Sterile pack lifecycle'
        }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        {
          id: 'alerts',
          label: 'Alerts',
          icon: Bell,
          section: 'Intelligence',
          alertCount: 3,
          description: 'Active issues & events'
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          section: 'Intelligence',
          description: 'Utilization & delays'
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: FileBarChart,
          section: 'Intelligence',
          description: 'Management summaries'
        }
      ]
    }
  ];

  // Filter sections and items based on role permissions
  const filteredSections = allSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => isNavAllowed(item.id))
    }))
    .filter(section => section.items.length > 0);

  const bottomItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      section: 'System'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      section: 'System'
    }
  ];

  return (
    <aside className="synchro-sidebar">
      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="brand-mark">
          <span>S</span>
        </div>
        <div className="brand-text">
          <span className="brand-name">Synchro</span>
          <span className="brand-tagline">Hospital Workflow, In Sync</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {filteredSections.map((section) => (
          <div key={section.title} className="nav-group">
            <div className="nav-group-label">{section.title}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => onNavSelect && onNavSelect(item)}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={18} className="nav-item-icon" />
                  <div className="nav-item-content">
                    <span className="nav-item-label">{item.label}</span>
                    <span className="nav-item-desc">{item.description}</span>
                  </div>
                  {item.alertCount && (
                    <span className="nav-item-badge">{item.alertCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <div className="sidebar-live-indicator">
          <span className="live-dot" />
          <span className="live-text">System Online • All Services Active</span>
        </div>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavSelect && onNavSelect(item)}
              type="button"
            >
              <Icon size={16} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
