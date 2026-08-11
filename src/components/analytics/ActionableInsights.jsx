import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  PackageCheck, 
  Activity, 
  UserCheck, 
  ShieldCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './ActionableInsights.css';

/**
 * Actionable Insights Component
 * High-visibility clinical AI recommendations to guide hospital administrative interventions.
 */
export const ActionableInsights = () => {
  const insights = [
    {
      id: 'INS-1',
      title: 'CSSD instrument availability is the largest source of OT delays.',
      category: 'CSSD Sterilization',
      pillar: 'teal',
      icon: PackageCheck,
      stat: '38% of all delays (42h lost/mo)',
      description: 'Morning autoclave batching creates a 45-minute cooling bottleneck between 09:30 AM and 10:45 AM. 3 surgical suites experienced delayed start times awaiting power tool sets.',
      recommendation: 'Stagger autoclave start cycles by 20 minutes and stage 2 reserve sets in Surgical Core #1.',
      actionLabel: 'Adjust Autoclave Schedule',
      severity: 'high'
    },
    {
      id: 'INS-2',
      title: 'OT-03 has consistently higher turnover time than other theatres.',
      category: 'Operating Theatres',
      pillar: 'indigo',
      icon: Activity,
      stat: '34m avg (Benchmark: 25m)',
      description: 'Turnover in OT-03 exceeds the 25-minute benchmark by 9 minutes on average, primarily driven by complex trauma sanitation and aerosolized canister disposal.',
      recommendation: 'Deploy dual-technician rapid turnaround team during back-to-back arthroscopic cases.',
      actionLabel: 'Assign Assist Sanitation Crew',
      severity: 'medium'
    },
    {
      id: 'INS-3',
      title: 'Patient transfer delays increased during the afternoon period.',
      category: 'Admissions & Transfer',
      pillar: 'blue',
      icon: UserCheck,
      stat: '+18m peak delay (1:00 PM - 3:30 PM)',
      description: 'Transport porter availability drops by 40% in early afternoon due to concurrent inpatient discharge transport and radiology transfers in Building 4C.',
      recommendation: 'Dedicate 2 surgical-exclusive transport porters to the Pre-Op holding floor during afternoon shift turnover.',
      actionLabel: 'Dedicate Surgical Porters',
      severity: 'medium'
    }
  ];

  return (
    <div className="ot-actionable-insights-section">
      <div className="insights-header-row">
        <div className="insights-title-group">
          <div className="insights-icon-box">
            <Sparkles size={18} className="text-purple" />
          </div>
          <div>
            <div className="insights-badge-row">
              <span className="insights-kicker font-mono">EXECUTIVE WORKFLOW INTELLIGENCE</span>
              <Badge variant="purple" size="xs">3 Priorities Detected</Badge>
            </div>
            <h2 className="insights-main-heading font-display">ACTIONABLE INSIGHTS</h2>
          </div>
        </div>

        <span className="insights-sub-text font-mono">
          Data-driven operational interventions to recover lost surgical time
        </span>
      </div>

      <div className="insights-cards-grid">
        {insights.map((ins) => {
          const Icon = ins.icon;
          return (
            <div key={ins.id} className={`insight-card border-pillar-${ins.pillar}`}>
              <div className="insight-card-top">
                <div className="insight-cat-tag">
                  <Badge variant={ins.pillar} size="xs">{ins.category}</Badge>
                  <span className="insight-stat-pill font-mono">{ins.stat}</span>
                </div>
                <Icon size={16} className={`text-${ins.pillar}`} />
              </div>

              <h3 className="insight-card-title font-display">{ins.title}</h3>
              <p className="insight-desc">{ins.description}</p>

              <div className="insight-rec-box font-mono">
                <span className="rec-prefix">AI Recommendation:</span>
                <span className="rec-copy">{ins.recommendation}</span>
              </div>

              <div className="insight-card-footer">
                <Button
                  size="xs"
                  variant="primary"
                  iconRight={ArrowRight}
                  onClick={() => alert(`Applied optimization: ${ins.actionLabel}`)}
                >
                  {ins.actionLabel}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
