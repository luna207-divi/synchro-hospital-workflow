import React from 'react';

/**
 * Official SYNCHRO Hospital Workflow Logo Component
 * Single Source of Truth for branding across the application.
 * Renders the official supplied 3D cyan/blue interconnected X-flower mark with high-contrast title & tagline.
 */
export const SynchroLogo = ({ 
  size = 'md', // 'sm' | 'md' | 'lg'
  showTagline = true,
  variant = 'dark', // 'dark' (dark navy text for light canvas) | 'light' (white text for dark canvas)
  className = '',
  onClick
}) => {
  const getIconDimensions = () => {
    switch (size) {
      case 'sm': return { width: 36, height: 36 };
      case 'lg': return { width: 52, height: 52 };
      case 'md':
      default: return { width: 44, height: 44 };
    }
  };

  const { width, height } = getIconDimensions();

  // High contrast title and tagline colors
  const titleColor = variant === 'dark' ? '#0a1628' : '#ffffff';
  const taglineColor = variant === 'dark' ? '#64748b' : 'rgba(255, 255, 255, 0.85)';

  return (
    <div 
      className={`synchro-official-logo size-${size} ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '10px' : size === 'lg' ? '14px' : '12px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* Official Supplied SYNCHRO 3D Logo Mark (Clean 100% Transparent PNG) */}
      <img 
        src="/assets/images/synchro_logo_mark.png" 
        alt="SYNCHRO Official Logo" 
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 8px rgba(0, 212, 255, 0.25))'
        }}
      />

      {/* Typography Block */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span 
          style={{ 
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)', 
            fontWeight: 800, 
            fontSize: size === 'sm' ? '17px' : size === 'lg' ? '24px' : '20px', 
            letterSpacing: '0.04em',
            color: titleColor,
            margin: 0,
            whiteSpace: 'nowrap'
          }}
        >
          SYNCHRO
        </span>
        {showTagline && (
          <span 
            style={{ 
              fontFamily: 'var(--font-sans, "Inter", sans-serif)', 
              fontWeight: 700, 
              fontSize: size === 'sm' ? '9px' : size === 'lg' ? '12px' : '10px', 
              letterSpacing: '0.06em',
              color: taglineColor,
              marginTop: '2px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}
          >
            HOSPITAL WORKFLOW • IN SYNC
          </span>
        )}
      </div>
    </div>
  );
};
