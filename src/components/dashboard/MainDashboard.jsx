import React, { useState } from 'react';
import { KPIRow } from './KPIRow';
import { LiveOTGrid } from './LiveOTGrid';
import { ActiveAlertsList } from './ActiveAlertsList';
import { DelayAnalysisChart } from './DelayAnalysisChart';
import { UtilizationTrendChart } from './UtilizationTrendChart';
import { WorkflowTimeline } from './WorkflowTimeline';
import { 
  Sparkles, 
  RefreshCw, 
  Download, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ReadinessPill } from '../common/ReadinessPill';
import { PulseIndicator } from '../common/PulseIndicator';
import './MainDashboard.css';

/**
 * Main OTFlow AI Command Center Dashboard
 * The primary operations dashboard answering:
 * 1. How are hospital operating theatres performing? (KPIs + Live OT Grid)
 * 2. Are there active delays? (Delayed Procedures KPI + Alert Cards)
 * 3. Why are delays happening? (Delay Root-Cause Analysis)
 * 4. Are patients ready? (Pre-Op Readiness Triads)
 * 5. Are sterile instrument packs available? (CSSD Status & Tray RFID trackers)
 * 6. What needs attention right now? (Active Bottleneck Alerts + Quick Action Triggers)
 */
export const MainDashboard = () => {
  const [selectedShift, setSelectedShift] = useState('Day Shift (07:00 - 15:30)');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="ot-main-dashboard">
      {/* 1. Dashboard Subheader Command Bar */}
      <div className="dashboard-command-bar">
        <div className="command-bar-left">
          <div className="telemetry-live-pill">
            <PulseIndicator status="teal" label="Live IoT Stream Active" />
            <span className="telemetry-sep">•</span>
            <span className="telemetry-latency font-mono">Sync: 42ms</span>
          </div>

          <div className="active-triad-summary">
            <span className="triad-summary-caption">Global Triad State:</span>
            <ReadinessPill
              patientStatus="ready"
              otStatus="ready"
              cssdStatus="pending"
              overallRisk="medium"
              size="sm"
            />
          </div>
        </div>

        <div className="command-bar-right">
          <div className="shift-selector font-mono">
            <Calendar size={13} className="shift-icon" />
            <span>{selectedShift}</span>
          </div>

          <Button
            size="xs"
            variant="secondary"
            icon={RefreshCw}
            isLoading={isRefreshing}
            onClick={handleRefresh}
          >
            Sync Feeds
          </Button>

          <Button
            size="xs"
            variant="secondary"
            icon={Download}
          >
            Daily Briefing
          </Button>
        </div>
      </div>

      {/* 2. Top KPI Row (5 Critical Operational Metrics) */}
      <section className="dashboard-section">
        <KPIRow />
      </section>

      {/* 3. Live Operating Theatres (OT-01, OT-02, OT-03, OT-04) */}
      <section className="dashboard-section">
        <LiveOTGrid />
      </section>

      {/* 4. Operations Intelligence Row: Active Alerts + Delay Root-Cause Analysis */}
      <section className="dashboard-section grid-2-col">
        <ActiveAlertsList />
        <DelayAnalysisChart />
      </section>

      {/* 5. OT Utilization Trend (7-Day Line/Area Chart) */}
      <section className="dashboard-section">
        <UtilizationTrendChart />
      </section>

      {/* 6. Recent Workflow Events Timeline */}
      <section className="dashboard-section">
        <WorkflowTimeline />
      </section>
    </div>
  );
};
