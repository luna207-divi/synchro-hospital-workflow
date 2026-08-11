import React from 'react';
import { 
  Percent, 
  Clock, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  Sparkles,
  Layers,
  Building2
} from 'lucide-react';
import './OTPerformanceSidebar.css';

/**
 * OT Performance Sidebar Component
 * Displays real-time operational telemetry for all hospital operating theatres:
 * - Today's utilization
 * - Average surgery duration
 * - Average turnover
 * - Delayed procedures
 * - On-time procedures
 */
export const OTPerformanceSidebar = () => {
  const performanceMetrics = [
    {
      label: "Today's Utilization",
      value: '84.2%',
      sub: '+3.8% vs last week',
      trendGood: true,
      icon: Percent,
      color: 'blue'
    },
    {
      label: 'Avg Surgery Duration',
      value: '1h 52m',
      sub: 'Benchmark: 1h 45m (+7m)',
      trendGood: true,
      icon: Clock,
      color: 'indigo'
    },
    {
      label: 'Average Turnover',
      value: '21.4m',
      sub: '3.6m faster than target (25m)',
      trendGood: true,
      icon: RotateCcw,
      color: 'teal'
    },
    {
      label: 'Delayed Procedures',
      value: '2 cases',
      sub: 'OT-03 (CSSD lag) • OT-02 (Lab)',
      trendGood: false,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'On-Time Procedures',
      value: '16 / 18',
      sub: '88.9% on-time start rate',
      trendGood: true,
      icon: CheckCircle2,
      color: 'teal'
    }
  ];

  const suiteDistribution = [
    { name: 'OT-01', status: 'In Surgery', color: 'teal', pct: 70 },
    { name: 'OT-02', status: 'Preparation', color: 'amber', pct: 25 },
    { name: 'OT-03', status: 'Delayed', color: 'red', pct: 10 },
    { name: 'OT-04', status: 'Ready', color: 'blue', pct: 100 }
  ];

  return (
    <aside className="ot-performance-sidebar ot-card">
      <div className="perf-sidebar-header">
        <div className="perf-title-row">
          <Activity size={16} className="text-blue" />
          <h3 className="perf-title font-display">OT Performance</h3>
        </div>
        <span className="perf-live-tag font-mono">LIVE TELEMETRY</span>
      </div>

      {/* Main KPI Stats List */}
      <div className="perf-metrics-list">
        {performanceMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className={`perf-metric-item border-color-${m.color}`}>
              <div className="perf-metric-top">
                <span className="perf-metric-label">{m.label}</span>
                <div className={`perf-icon-badge badge-bg-${m.color}`}>
                  <Icon size={13} />
                </div>
              </div>

              <div className="perf-metric-val-row">
                <span className="perf-metric-val font-display">{m.value}</span>
                <span className={`perf-metric-sub font-mono ${m.trendGood ? 'text-teal' : 'text-red'}`}>
                  {m.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suite Occupancy Breakdown */}
      <div className="perf-suite-section">
        <span className="perf-section-heading font-mono">LIVE THEATRE OCCUPANCY</span>
        <div className="suite-bars-list">
          {suiteDistribution.map((suite) => (
            <div key={suite.name} className="suite-bar-item">
              <div className="suite-meta-line font-mono">
                <span className="suite-name">{suite.name}</span>
                <span className={`suite-status-text text-${suite.color}`}>{suite.status}</span>
              </div>
              <div className="suite-track">
                <div 
                  className={`suite-fill fill-${suite.color}`} 
                  style={{ width: `${suite.pct}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Turnaround Insight */}
      <div className="perf-ai-insight">
        <Sparkles size={14} className="perf-ai-icon" />
        <div className="perf-ai-text">
          <strong>AI Turnover Forecast:</strong> OT-04 ready for next case 12 mins ahead of schedule. Recommending early transfer for Patient #P-1027.
        </div>
      </div>
    </aside>
  );
};
