import React, { useState } from 'react';
import { 
  UserCheck, 
  Activity, 
  PackageCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Shield,
  Layers,
  Search,
  Filter,
  Download,
  Plus,
  Send,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../common/Button';
import { Input, SearchInput, Select, Toggle, Checkbox } from '../common/Input';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { PulseIndicator } from '../common/PulseIndicator';
import { ReadinessPill } from '../common/ReadinessPill';
import { MetricCard } from '../common/MetricCard';
import { AlertBanner } from '../common/AlertBanner';
import { TimelineBar, CycleProgressBar, RiskSparkline } from '../common/TelemetryChart';
import './DesignSystemShowcase.css';

export const DesignSystemShowcase = () => {
  const [toggleState, setToggleState] = useState(true);
  const [checkboxState, setCheckboxState] = useState(true);
  const [activeDismissed, setActiveDismissed] = useState(false);
  const [sortCol, setSortCol] = useState('time');
  const [sortDir, setSortDir] = useState('asc');

  // Sample data for High-Density Clinical Table
  const surgicalTableData = [
    {
      id: 'CASE-1048',
      patient: 'Robert Vance (MRN-8419)',
      procedure: 'Total Hip Arthroplasty',
      time: '08:30 AM',
      otSuite: 'OT #02',
      surgeon: 'Dr. A. Miller',
      patientStatus: 'ready',
      otStatus: 'ready',
      cssdStatus: 'ready',
      risk: 'low',
      trayId: 'CSSD-TH-04',
      status: 'In Prep'
    },
    {
      id: 'CASE-1049',
      patient: 'Elena Rostova (MRN-9204)',
      procedure: 'Laparoscopic Cholecystectomy',
      time: '09:15 AM',
      otSuite: 'OT #04',
      surgeon: 'Dr. K. Patel',
      patientStatus: 'ready',
      otStatus: 'ready',
      cssdStatus: 'pending',
      risk: 'medium',
      trayId: 'CSSD-LAP-12',
      status: 'Autoclave Stage 2'
    },
    {
      id: 'CASE-1050',
      patient: 'Marcus Chen (MRN-3318)',
      procedure: 'Anterior Cruciate Ligament (ACL)',
      time: '10:00 AM',
      otSuite: 'OT #01',
      surgeon: 'Dr. J. Gomez',
      patientStatus: 'delayed',
      otStatus: 'ready',
      cssdStatus: 'delayed',
      risk: 'high',
      trayId: 'CSSD-ORTHO-09',
      status: 'Reprocessing Lag (+28m)'
    },
    {
      id: 'CASE-1051',
      patient: 'Sarah Jenkins (MRN-7741)',
      procedure: 'Coronary Artery Bypass (CABG)',
      time: '10:45 AM',
      otSuite: 'OT #06',
      surgeon: 'Dr. R. Sharma',
      patientStatus: 'ready',
      otStatus: 'ready',
      cssdStatus: 'ready',
      risk: 'low',
      trayId: 'CSSD-CV-01',
      status: 'Sterile Verified'
    }
  ];

  const tableColumns = [
    {
      header: 'Case ID & Patient',
      key: 'id',
      sortable: true,
      render: (val, row) => (
        <div className="table-cell-patient">
          <span className="case-id font-mono">{val}</span>
          <span className="patient-name">{row.patient}</span>
        </div>
      )
    },
    {
      header: 'Procedure',
      key: 'procedure',
      render: (val) => <span className="procedure-text">{val}</span>
    },
    {
      header: 'Sched. Time',
      key: 'time',
      isMono: true,
      sortable: true
    },
    {
      header: 'OT Suite',
      key: 'otSuite',
      render: (val) => <Badge variant="indigo" size="xs">{val}</Badge>
    },
    {
      header: 'Triad Readiness State',
      key: 'risk',
      render: (_, row) => (
        <ReadinessPill
          patientStatus={row.patientStatus}
          otStatus={row.otStatus}
          cssdStatus={row.cssdStatus}
          overallRisk={row.risk}
          size="sm"
        />
      )
    },
    {
      header: 'CSSD RFID Tray',
      key: 'trayId',
      isMono: true,
      render: (val, row) => (
        <div className="tray-cell">
          <span className="tray-id font-mono">{val}</span>
          <span className="tray-status">{row.status}</span>
        </div>
      )
    },
    {
      header: 'Action',
      key: 'action',
      align: 'right',
      render: () => (
        <div className="table-row-actions">
          <Button size="xs" variant="secondary" icon={Eye}>View</Button>
          <Button size="xs" variant="ghost" icon={MoreHorizontal} />
        </div>
      )
    }
  ];

  return (
    <div className="ot-design-system-showcase">
      {/* 1. Header Banner & Product Story */}
      <section className="showcase-banner ot-card">
        <div className="banner-top-row">
          <div className="banner-badges">
            <Badge variant="blue" size="sm">OTFlow AI Design System v2.0</Badge>
            <Badge variant="teal" size="sm" dot>Enterprise Light Theme</Badge>
          </div>
          <span className="banner-version font-mono">Build 2026.08 • Clinical Production</span>
        </div>

        <div className="banner-hero-content">
          <h1 className="banner-title">
            Enterprise Healthcare Workflow Intelligence
          </h1>
          <p className="banner-description">
            Connecting <strong>Admissions</strong>, <strong>Operating Theatres</strong>, and <strong>CSSD Sterilization</strong> for real-time visibility, automated bottleneck detection, and actionable clinical delay prevention.
          </p>
        </div>

        {/* Product Story Pipeline Diagram */}
        <div className="banner-story-flow ot-well">
          <div className="story-step-node">
            <div className="story-step-icon icon-admissions"><UserCheck size={16} /></div>
            <div className="story-step-meta">
              <span className="story-step-title">Patient Readiness</span>
              <span className="story-step-desc">Admissions & Pre-Op</span>
            </div>
          </div>

          <span className="story-operator-sign">+</span>

          <div className="story-step-node">
            <div className="story-step-icon icon-ot"><Activity size={16} /></div>
            <div className="story-step-meta">
              <span className="story-step-title">OT Readiness</span>
              <span className="story-step-desc">Suites & Staff</span>
            </div>
          </div>

          <span className="story-operator-sign">+</span>

          <div className="story-step-node">
            <div className="story-step-icon icon-cssd"><PackageCheck size={16} /></div>
            <div className="story-step-meta">
              <span className="story-step-title">CSSD Readiness</span>
              <span className="story-step-desc">Sterile Packs & RFID</span>
            </div>
          </div>

          <div className="story-arrow-sign"><ArrowRight size={16} /></div>

          <div className="story-step-node node-ai">
            <div className="story-step-icon icon-ai"><Sparkles size={16} /></div>
            <div className="story-step-meta">
              <span className="story-step-title">Workflow Intelligence</span>
              <span className="story-step-desc">Early Delay Detection</span>
            </div>
          </div>

          <div className="story-arrow-sign"><ArrowRight size={16} /></div>

          <div className="story-step-node node-alerts">
            <div className="story-step-icon icon-alerts"><Shield size={16} /></div>
            <div className="story-step-meta">
              <span className="story-step-title">Alerts & Analytics</span>
              <span className="story-step-desc">Actionable Orchestration</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Color Palette & Token Swatches */}
      <section className="showcase-block">
        <div className="block-header">
          <h2 className="block-title">1. Color Palette Tokens</h2>
          <p className="block-sub">Calm clinical light theme tokens adhering strictly to enterprise healthcare visual standards.</p>
        </div>

        <div className="token-swatch-grid">
          <div className="swatch-card ot-card">
            <div className="swatch-color" style={{ backgroundColor: '#0F172A' }} />
            <div className="swatch-details">
              <span className="swatch-name">Deep Navy (Text)</span>
              <span className="swatch-code font-mono">#0F172A</span>
              <span className="swatch-desc">Primary text & titles</span>
            </div>
          </div>

          <div className="swatch-card ot-card">
            <div className="swatch-color" style={{ backgroundColor: '#2563EB' }} />
            <div className="swatch-details">
              <span className="swatch-name">Cool Blue (Primary Action)</span>
              <span className="swatch-code font-mono">#2563EB</span>
              <span className="swatch-desc">Buttons & Active States</span>
            </div>
          </div>

          <div className="swatch-card ot-card">
            <div className="swatch-color" style={{ backgroundColor: '#0D9488' }} />
            <div className="swatch-details">
              <span className="swatch-name">Clinical Teal (Positive / Ready)</span>
              <span className="swatch-code font-mono">#0D9488</span>
              <span className="swatch-desc">CSSD, Sterile, Ready</span>
            </div>
          </div>

          <div className="swatch-card ot-card">
            <div className="swatch-color" style={{ backgroundColor: '#D97706' }} />
            <div className="swatch-details">
              <span className="swatch-name">Amber (Warning / Watch)</span>
              <span className="swatch-code font-mono">#D97706</span>
              <span className="swatch-desc">Delay risk, sterilization watch</span>
            </div>
          </div>

          <div className="swatch-card ot-card">
            <div className="swatch-color" style={{ backgroundColor: '#DC2626' }} />
            <div className="swatch-details">
              <span className="swatch-name">Red (Critical Delay)</span>
              <span className="swatch-code font-mono">#DC2626</span>
              <span className="swatch-desc">Critical alerts, blocked flows</span>
            </div>
          </div>

          <div className="swatch-card ot-card">
            <div className="swatch-color" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }} />
            <div className="swatch-details">
              <span className="swatch-name">Soft Gray Canvas</span>
              <span className="swatch-code font-mono">#F8FAFC</span>
              <span className="swatch-desc">Application background</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Reusable Buttons & Form Inputs */}
      <section className="showcase-block">
        <div className="block-header">
          <h2 className="block-title">2. Form Controls & Buttons</h2>
          <p className="block-sub">Standardized enterprise input fields, dropdowns, switches, and action buttons.</p>
        </div>

        <div className="controls-grid">
          {/* Button Variants Card */}
          <Card title="Button Primitives" subtitle="Sizes: xs, sm, md, lg with icon and loading support">
            <div className="controls-stack">
              <div className="button-row">
                <Button variant="primary">Primary (Cool Blue)</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="teal">Teal (Positive)</Button>
                <Button variant="danger">Danger (Red)</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>

              <div className="button-row">
                <Button size="xs" variant="primary" icon={Plus}>Add Case (xs)</Button>
                <Button size="sm" variant="secondary" icon={Filter}>Filter (sm)</Button>
                <Button size="md" variant="teal" icon={CheckCircle2}>Verify Sterile (md)</Button>
                <Button size="lg" variant="primary" iconRight={ArrowRight}>Start Surgery (lg)</Button>
                <Button size="sm" variant="primary" isLoading>Processing</Button>
              </div>
            </div>
          </Card>

          {/* Form Inputs Card */}
          <Card title="Input & Selection Controls" subtitle="Labels, helper text, error states, and toggles">
            <div className="form-controls-grid">
              <Input
                label="Patient MRN / ID"
                placeholder="e.g. MRN-94812"
                helperText="Format: MRN followed by 5 digits"
              />

              <Input
                label="Operating Theatre Suite"
                placeholder="e.g. Suite #03"
                error="Suite #03 is currently undergoing sanitation"
              />

              <Select
                label="Surgical Specialty"
                options={[
                  { value: 'ortho', label: 'Orthopedics & Joint Replacement' },
                  { value: 'cardiac', label: 'Cardiovascular Surgery' },
                  { value: 'neuro', label: 'Neurosurgery & Spine' },
                  { value: 'general', label: 'General & Laparoscopic' }
                ]}
              />

              <div className="toggles-column">
                <Toggle
                  label="Automated AI Delay Escalation"
                  description="Auto-dispatch notification when cycle lag > 15m"
                  checked={toggleState}
                  onChange={setToggleState}
                />
                <Checkbox
                  label="Require dual-verification on sterile instrument trays"
                  checked={checkboxState}
                  onChange={setCheckboxState}
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Telemetry Metric Cards */}
      <section className="showcase-block">
        <div className="block-header">
          <h2 className="block-title">3. Clinical Metric Telemetry Cards</h2>
          <p className="block-sub">Pillar-themed cards with live trend analytics, sensor statuses, and AI micro-insights.</p>
        </div>

        <div className="metrics-grid">
          <MetricCard
            title="1. Admissions Flow"
            value="18"
            unit="patients"
            pillar="admissions"
            icon={UserCheck}
            trend={{ direction: 'up', value: '+4', label: 'vs morning schedule', isGood: true }}
            aiInsight="Pre-op checklist completion avg: 14 mins"
          />

          <MetricCard
            title="2. Active OT Theatres"
            value="6 / 8"
            unit="suites"
            pillar="ot"
            icon={Activity}
            trend={{ direction: 'neutral', value: '75%', label: 'utilization rate', isGood: true }}
            aiInsight="OT #03 turnover running 8m ahead of schedule"
          />

          <MetricCard
            title="3. CSSD Reprocessing"
            value="42"
            unit="trays"
            pillar="cssd"
            icon={PackageCheck}
            trend={{ direction: 'down', value: '-12m', label: 'turnaround reduction', isGood: true }}
            aiInsight="Autoclave Chamber #2 cycle finished 100% OK"
          />

          <MetricCard
            title="AI Bottleneck Index"
            value="0.14"
            unit="low risk"
            pillar="ai"
            icon={Sparkles}
            trend={{ direction: 'down', value: '-42%', label: 'delay risk reduction', isGood: true }}
            aiInsight="Predicted 34 mins saved across 12 scheduled cases"
          />
        </div>
      </section>

      {/* 5. High Information Density Surgical Table */}
      <section className="showcase-block">
        <div className="block-header">
          <div className="block-header-row">
            <div>
              <h2 className="block-title">4. High-Density Clinical Workflow Table</h2>
              <p className="block-sub">Live surgical pipeline combining Patient, OT, and CSSD tray telemetry with sorting and action controls.</p>
            </div>
            <div className="table-header-btns">
              <SearchInput placeholder="Filter cases..." size="sm" />
              <Button size="sm" variant="secondary" icon={Download}>Export</Button>
              <Button size="sm" variant="primary" icon={Plus}>New Schedule</Button>
            </div>
          </div>
        </div>

        <Table
          columns={tableColumns}
          data={surgicalTableData}
          sortColumn={sortCol}
          sortDirection={sortDir}
          onSort={(col) => {
            if (sortCol === col) {
              setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
            } else {
              setSortCol(col);
              setSortDir('asc');
            }
          }}
        />
      </section>

      {/* 6. Delay Alerts & Action Banners */}
      <section className="showcase-block">
        <div className="block-header">
          <h2 className="block-title">5. Delay Alerts & Action Banners</h2>
          <p className="block-sub">Contextual alert banners with clear severity hierarchy and quick execution triggers.</p>
        </div>

        <div className="alerts-stack">
          {!activeDismissed && (
            <AlertBanner
              title="CSSD Sterilizer Delay Impacting OT #03"
              message="AI forecasted a 22-minute start delay for Case #1050 (ACL Reconstruction) due to Autoclave #2 pack cooldown. Recommended: Expedite fast-track Tray #99-B from Reserve CSSD."
              severity="critical"
              pillar="cssd"
              timestamp="2 mins ago"
              actionLabel="Reroute Sterile Tray"
              onAction={() => alert('Action: Rerouting Sterile Tray #99-B to OT #03')}
              onDismiss={() => setActiveDismissed(true)}
            />
          )}

          <AlertBanner
            title="Admissions Pre-Op Clearance Pending"
            message="Patient Elena Rostova (OT Suite #04 - 09:15 AM) coagulation lab results pending for 45 mins. Anesthesia clearance waiting."
            severity="warning"
            pillar="admissions"
            timestamp="8 mins ago"
            actionLabel="Notify Lab"
            onAction={() => alert('Action: Automated priority lab notification dispatched')}
          />

          <AlertBanner
            title="Optimal Turnover Achieved in OT #05"
            message="Room sanitation and instrument verification completed in 18 minutes (benchmark: 25 mins). Next surgical team prepped."
            severity="success"
            pillar="ot"
            timestamp="15 mins ago"
          />
        </div>
      </section>

      {/* 7. Clinical Telemetry Charts */}
      <section className="showcase-block">
        <div className="block-header">
          <h2 className="block-title">6. Clinical Telemetry Visualizations</h2>
          <p className="block-sub">Lightweight timeline bars, cycle progress trackers, and risk histograms.</p>
        </div>

        <div className="charts-grid">
          <Card title="OT Suite #02 Schedule Timeline" subtitle="Real-time room occupancy and case turnover distribution">
            <TimelineBar
              title="Today's Operational Schedule"
              subtitle="08:00 - 18:00 (10 hrs)"
              segments={[
                { label: 'Case #1048 (Hip)', width: '35%', color: 'blue', time: '08:00 - 10:30' },
                { label: 'Turnover & Clean', width: '10%', color: 'teal', time: '10:30 - 11:00' },
                { label: 'Case #1052 (Knee)', width: '30%', color: 'indigo', time: '11:00 - 13:30' },
                { label: 'Sterile Delay Lag', width: '12%', color: 'amber', time: '13:30 - 14:15' },
                { label: 'Available', width: '13%', color: 'slate', time: '14:15 - 18:00' }
              ]}
            />
          </Card>

          <Card title="CSSD Reprocessing Chamber #02" subtitle="Active 4-stage steam sterilization telemetry">
            <CycleProgressBar
              stages={[
                { name: 'Wash & Decon', status: 'completed' },
                { name: 'Steam Sterilize (134°C)', status: 'in-progress', progress: '72%' },
                { name: 'Aeration & Dry', status: 'pending' },
                { name: 'RFID Release', status: 'pending' }
              ]}
            />
          </Card>

          <Card title="Predicted Delay Risk Index" subtitle="Hourly surgical bottleneck distribution">
            <RiskSparkline
              bars={[8, 14, 10, 22, 48, 16, 9, 26, 12, 6]}
              highlightIndex={4}
              label="Delay Risk Forecast (Next 10 Hours)"
            />
          </Card>
        </div>
      </section>

      {/* 8. Telemetry Badges & Status Indicators */}
      <section className="showcase-block">
        <div className="block-header">
          <h2 className="block-title">7. Badges, Triads & Status Pulses</h2>
        </div>

        <div className="badges-showcase-grid">
          <Card title="Triad Readiness Atoms" subtitle="Core 3-way telemetry atom">
            <div className="triad-examples-stack">
              <div className="triad-item-row">
                <span className="triad-case-caption">Optimal Flow:</span>
                <ReadinessPill patientStatus="ready" otStatus="ready" cssdStatus="ready" overallRisk="low" />
              </div>
              <div className="triad-item-row">
                <span className="triad-case-caption">CSSD Lag:</span>
                <ReadinessPill patientStatus="ready" otStatus="ready" cssdStatus="pending" overallRisk="medium" />
              </div>
              <div className="triad-item-row">
                <span className="triad-case-caption">Critical Bottleneck:</span>
                <ReadinessPill patientStatus="delayed" otStatus="ready" cssdStatus="delayed" overallRisk="high" />
              </div>
            </div>
          </Card>

          <Card title="Pillar & Status Badges" subtitle="Standardized pastel backgrounds with high-contrast text">
            <div className="badges-stack">
              <div className="badge-row">
                <Badge variant="blue">Admissions</Badge>
                <Badge variant="indigo">OT Hub</Badge>
                <Badge variant="teal">CSSD Supply</Badge>
                <Badge variant="purple" icon={Sparkles}>AI Engine</Badge>
              </div>
              <div className="badge-row">
                <Badge variant="teal" dot>Ready / Optimal</Badge>
                <Badge variant="amber" dot>Watch Status</Badge>
                <Badge variant="red" dot>Delay Risk</Badge>
                <Badge variant="slate">Standby</Badge>
              </div>
            </div>
          </Card>

          <Card title="Live Sensor Pulses" subtitle="Subtle live stream telemetry pings">
            <div className="pulses-stack">
              <PulseIndicator status="teal" label="IoT Stream Connected" />
              <PulseIndicator status="amber" label="RFID Reader Sync Lag" />
              <PulseIndicator status="red" label="Autoclave Sensor Lost" />
              <PulseIndicator status="purple" label="AI Inference: 38ms" />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
