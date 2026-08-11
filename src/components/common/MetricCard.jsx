import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import './MetricCard.css';

/**
 * Enterprise Metric Card Component
 * Pillars: 'admissions' | 'ot' | 'cssd' | 'ai' | 'neutral'
 */
export const MetricCard = ({
  title,
  value,
  unit = '',
  trend = null, // { direction: 'up' | 'down' | 'neutral', value: '+14%', label: 'vs last shift', isGood: true }
  pillar = 'neutral',
  icon: Icon,
  subtitle,
  aiInsight = null,
  className = ''
}) => {
  return (
    <div className={`ot-metric-card pillar-${pillar} ${className}`}>
      {/* Top Header */}
      <div className="metric-card-top">
        <span className="metric-card-title">{title}</span>
        {Icon && (
          <div className="metric-icon-box">
            <Icon size={16} />
          </div>
        )}
      </div>

      {/* Primary Value Display */}
      <div className="metric-value-row">
        <span className="metric-number">{value}</span>
        {unit && <span className="metric-unit-text font-mono">{unit}</span>}
      </div>

      {/* Trend / Subtitle */}
      <div className="metric-card-bottom">
        {trend && (
          <div className={`metric-delta delta-${trend.isGood ? 'positive' : 'negative'}`}>
            {trend.direction === 'up' && <TrendingUp size={12} />}
            {trend.direction === 'down' && <TrendingDown size={12} />}
            {trend.direction === 'neutral' && <Minus size={12} />}
            <span className="delta-value font-mono">{trend.value}</span>
            {trend.label && <span className="delta-label">{trend.label}</span>}
          </div>
        )}
        {subtitle && !trend && <span className="metric-sub-info">{subtitle}</span>}
      </div>

      {/* AI Micro-Insight Box */}
      {aiInsight && (
        <div className="metric-ai-banner">
          <Sparkles size={11} className="ai-icon" />
          <span>{aiInsight}</span>
        </div>
      )}
    </div>
  );
};
