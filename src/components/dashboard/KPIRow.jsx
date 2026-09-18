import React from 'react';
import { 
  Percent, 
  CalendarCheck2, 
  Activity, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus 
} from 'lucide-react';
import './KPIRow.css';

/**
 * Top KPI Row for Hospital Operations Command Center
 * Displays: OT Utilization, Surgeries Today, Active OTs, Delayed Procedures, Average OT Turnover
 */
export const KPIRow = () => {
  const kpiData = [
    {
      id: 'utilization',
      title: 'OT Utilization',
      value: '0%',
      trend: { direction: 'neutral', value: '0%', label: 'vs last week', isPositive: true },
      context: 'Target: 80.0%',
      icon: Percent,
      accentColor: 'blue'
    },
    {
      id: 'surgeries',
      title: 'Surgeries Today',
      value: '0',
      unit: 'cases',
      trend: { direction: 'neutral', value: '0', label: 'vs schedule', isPositive: true },
      context: '0 Completed • 0 Active • 0 Upcoming',
      icon: CalendarCheck2,
      accentColor: 'teal'
    },
    {
      id: 'active-ots',
      title: 'Active OTs',
      value: '0 / 12',
      unit: 'suites',
      trend: { direction: 'neutral', value: '0%', label: 'in-case occupancy', isPositive: true },
      context: '0 Suites in Turnover Sanitation',
      icon: Activity,
      accentColor: 'indigo'
    },
    {
      id: 'delays',
      title: 'Delayed Procedures',
      value: '0',
      unit: 'cases',
      trend: { direction: 'neutral', value: '0', label: 'vs yesterday', isPositive: true },
      context: 'Avg Delay: 0m',
      icon: AlertTriangle,
      accentColor: 'red'
    },
    {
      id: 'turnover',
      title: 'Average OT Turnover',
      value: '0',
      unit: 'mins',
      trend: { direction: 'neutral', value: '0m', label: 'vs target', isPositive: true },
      context: 'Benchmark: 25.0m',
      icon: Clock,
      accentColor: 'teal'
    }
  ];

  return (
    <div className="ot-kpi-row-grid">
      {kpiData.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className={`kpi-card ot-card accent-${item.accentColor}`}>
            <div className="kpi-card-header">
              <span className="kpi-card-title">{item.title}</span>
              <div className="kpi-icon-pill">
                <Icon size={15} />
              </div>
            </div>

            <div className="kpi-card-body">
              <div className="kpi-value-row">
                <span className="kpi-metric-number font-display">{item.value}</span>
                {item.unit && <span className="kpi-metric-unit font-mono">{item.unit}</span>}
              </div>

              <div className="kpi-trend-row">
                <div className={`kpi-trend-badge trend-${item.trend.isPositive ? 'good' : 'warn'}`}>
                  {item.trend.direction === 'up' && <TrendingUp size={11} />}
                  {item.trend.direction === 'down' && <TrendingDown size={11} />}
                  {item.trend.direction === 'neutral' && <Minus size={11} />}
                  <span className="font-mono">{item.trend.value}</span>
                </div>
                <span className="kpi-trend-sub">{item.trend.label}</span>
              </div>
            </div>

            <div className="kpi-card-footer">
              <span className="kpi-context-text">{item.context}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
