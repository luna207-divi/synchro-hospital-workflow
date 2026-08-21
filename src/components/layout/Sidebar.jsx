import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Workflow, 
  AlertTriangle, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Bell,
  Package,
  FileBarChart,
  Users,
  Activity
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { useWorkflow } from '../../context/WorkflowContext';
import { getDashboardForRole } from '../../config/roles';
import { SynchroLogo } from '../common/SynchroLogo';
import './Sidebar.css';

/**
 * SYNCHRO Sidebar Navigation Component
 * Enterprise Hospital Operations Navigation
 */
export const Sidebar = ({ activeNav: activeNavProp, onNavSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isNavAllowed, activeRole } = useRole();
  const { profile } = useAuth();
  const workflow = useWorkflow();

  const activeAlertsCount = (workflow.alerts || []).filter(a => a.status !== 'Resolved').length;

  // Determine active nav item from route
  const currentSegment = location.pathname.split('/').filter(Boolean)[1] || location.pathname.split('/').filter(Boolean)[0] || 'flow-board';
  const activeNav = activeNavProp || currentSegment;

  const handleBrandClick = () => {
    const userRole = profile?.role || activeRole?.id;
    const targetDashboard = getDashboardForRole(userRole);
    navigate(targetDashboard);
  };

  const allSections = [
    {
      title: 'Operations',
      items: [
        {
          id: 'frontdesk',
          label: 'Front Desk',
          icon: Users,
          section: 'Operations',
          description: 'Intake & patient registration'
        },
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
          icon: Activity,
          section: 'Operations',
          description: 'See hospital move live'
        },
        {
          id: 'patients',
          label: 'Patients',
          icon: Users,
          section: 'Operations',
          description: 'Admissions & patient profiles'
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
          alertCount: activeAlertsCount > 0 ? activeAlertsCount : 3,
          description: 'Active issues & exceptions'
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          section: 'Intelligence',
          description: 'Utilization & bottleneck metrics'
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: FileBarChart,
          section: 'Intelligence',
          description: 'Executive management reports'
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
      {/* ── Brand Header ───────────────────────────────────── */}
      <div className="sidebar-brand" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
        <SynchroLogo size="md" variant="dark" showTagline={true} />
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {filteredSections.map((section) => (
          <div key={section.title} className="nav-group">
            <div className="nav-group-label">{section.title}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id || (activeNav === 'doctor' && item.id === 'flow-board');
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
                  {item.alertCount ? (
                    <span className="nav-item-badge">{item.alertCount}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Live System Indicator Footer */}
      <div className="sidebar-bottom">
        <div className="sidebar-live-indicator">
          <span className="live-dot" />
          <span className="live-text">System Online • Operational</span>
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
