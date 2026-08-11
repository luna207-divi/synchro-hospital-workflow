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
      value: '84.2%',
      trend: { direction: 'up', value: '+3.8%', label: 'vs last week', isPositive: true },
      context: 'Target: 80.0% • Peak 91% at 10 AM',
      icon: Percent,
      accentColor: 'blue'
    },
    {
      id: 'surgeries',
      title: 'Surgeries Today',
      value: '28',
      unit: 'cases',
      trend: { direction: 'up', value: '+4', label: 'vs schedule', isPositive: true },
      context: '18 Completed • 6 Active • 4 Upcoming',
      icon: CalendarCheck2,
      accentColor: 'teal'
    },
    {
      id: 'active-ots',
      title: 'Active OTs',
      value: '6 / 8',
      unit: 'suites',
      trend: { direction: 'neutral', value: '75%', label: 'in-case occupancy', isPositive: true },
      context: '2 Suites in Turnover Sanitation',
      icon: Activity,
      accentColor: 'indigo'
    },
    {
      id: 'delays',
      title: 'Delayed Procedures',
      value: '2',
      unit: 'cases',
      trend: { direction: 'down', value: '-1', label: 'vs yesterday', isPositive: true },
      context: 'Avg Delay: 18m • 1 CSSD / 1 Transfer',
      icon: AlertTriangle,
      accentColor: 'red'
    },
    {
      id: 'turnover',
      title: 'Average OT Turnover',
      value: '21.4',
      unit: 'mins',
      trend: { direction: 'down', value: '-4.2m', label: 'faster turnaround', isPositive: true },
      context: 'Benchmark: 25.0m • Top: OT-01 (16m)',
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
