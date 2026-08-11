import React, { useState } from 'react';
import { TrendingUp, Target, Calendar } from 'lucide-react';
import './UtilizationTrendChart.css';

/**
 * 7-Day OT Utilization Trend Chart Component
 */
export const UtilizationTrendChart = () => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const trendData = [
    { day: 'Mon', date: 'Aug 04', rate: 78.4, cases: 26, peakHour: '10 AM (88%)' },
    { day: 'Tue', date: 'Aug 05', rate: 82.1, cases: 29, peakHour: '11 AM (92%)' },
    { day: 'Wed', date: 'Aug 06', rate: 89.5, cases: 32, peakHour: '09 AM (96%)' },
    { day: 'Thu', date: 'Aug 07', rate: 84.0, cases: 28, peakHour: '10 AM (90%)' },
    { day: 'Fri', date: 'Aug 08', rate: 86.8, cases: 31, peakHour: '08 AM (94%)' },
    { day: 'Sat', date: 'Aug 09', rate: 72.5, cases: 14, peakHour: '11 AM (78%)' },
    { day: 'Sun', date: 'Aug 10', rate: 84.2, cases: 28, peakHour: '10 AM (91%)', isToday: true }
  ];

  const targetRate = 80.0;
  const avgRate = (trendData.reduce((acc, d) => acc + d.rate, 0) / trendData.length).toFixed(1);

  // SVG Chart Dimensions
  const chartWidth = 560;
  const chartHeight = 140;
  const minRate = 60;
  const maxRate = 100;

  const getY = (val) => {
    return chartHeight - ((val - minRate) / (maxRate - minRate)) * (chartHeight - 20) - 10;
  };

  const getX = (idx) => {
    return 40 + idx * ((chartWidth - 60) / (trendData.length - 1));
  };

  // Generate SVG path for line and area fill
  const points = trendData.map((d, i) => `${getX(i)},${getY(d.rate)}`).join(' ');
  const areaPath = `M ${getX(0)},${chartHeight} L ${points.split(' ').join(' L ')} L ${getX(trendData.length - 1)},${chartHeight} Z`;
  const targetY = getY(targetRate);

  return (
    <div className="ot-trend-card ot-card">
      <div className="trend-card-header">
        <div className="trend-title-group">
          <div className="trend-title-row">
            <h3 className="trend-heading font-display">OT Utilization Trend</h3>
            <span className="trend-period-pill font-mono">7-DAY HISTORICAL</span>
          </div>
          <span className="trend-subhead">Daily operating theatre runtime vs 80.0% operational benchmark</span>
        </div>

        <div className="trend-summary-stats">
          <div className="summary-stat-box">
            <span className="stat-label">7-Day Avg</span>
            <span className="stat-value font-display">{avgRate}%</span>
          </div>
          <div className="summary-stat-box">
            <span className="stat-label">Target</span>
            <span className="stat-value font-display text-teal">80.0%</span>
          </div>
        </div>
      </div>

      <div className="trend-chart-wrapper">
        <svg 
          className="trend-svg"
          viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1="30" y1={getY(100)} x2={chartWidth} y2={getY(100)} className="grid-line" />
          <line x1="30" y1={getY(80)} x2={chartWidth} y2={getY(80)} className="grid-line" />
          <line x1="30" y1={getY(60)} x2={chartWidth} y2={getY(60)} className="grid-line" />

          {/* Target 80% line */}
          <line
            x1="30"
            y1={targetY}
            x2={chartWidth}
            y2={targetY}
            className="target-benchmark-line"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Line Path */}
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data Points */}
          {trendData.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.rate);
            const isHovered = hoveredDay === i;
            return (
              <g key={i} className="point-group">
                <circle
                  cx={cx}
                  cy={cy}
                  r={d.isToday || isHovered ? 5 : 3.5}
                  className={`trend-circle ${d.isToday ? 'is-today' : ''}`}
                  onMouseEnter={() => setHoveredDay(i)}
                  onMouseLeave={() => setHoveredDay(null)}
                />
                {/* Value text above point */}
                <text
                  x={cx}
                  y={cy - 8}
                  className={`point-text font-mono ${d.isToday ? 'text-bold' : ''}`}
                >
                  {d.rate}%
                </text>
                {/* Day label on X axis */}
                <text
                  x={cx}
                  y={chartHeight + 14}
                  className={`axis-x-label font-mono ${d.isToday ? 'label-today' : ''}`}
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend / Hover Details */}
        <div className="trend-footer-legend">
          <div className="legend-items-left">
            <span className="legend-item">
              <span className="legend-line line-blue" /> Utilization Rate
            </span>
            <span className="legend-item">
              <span className="legend-line line-dashed" /> Target Benchmark (80%)
            </span>
          </div>

          <div className="legend-note-right font-mono">
            {hoveredDay !== null ? (
              <span>
                {trendData[hoveredDay].day} ({trendData[hoveredDay].date}): <strong>{trendData[hoveredDay].rate}%</strong> • {trendData[hoveredDay].cases} cases • Peak: {trendData[hoveredDay].peakHour}
              </span>
            ) : (
              <span>Today (Sun): <strong>84.2%</strong> • 28 cases running on schedule</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
