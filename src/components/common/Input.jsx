import React from 'react';
import { Search, ChevronDown, AlertCircle } from 'lucide-react';
import './Input.css';

/**
 * Standard Form Input with Label, Helper Text, Error state
 */
export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  size = 'md',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`ot-input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ot-label">
          {label}
        </label>
      )}
      <div className={`ot-input-wrapper ot-input-${size}`}>
        {Icon && <Icon size={14} className="ot-input-icon" />}
        <input
          id={inputId}
          className={`ot-input ${Icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
      {error ? (
        <div className="ot-input-error-msg">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <span className="ot-input-helper">{helperText}</span>
      ) : null}
    </div>
  );
};

/**
 * Search Input with Shortcut Badge (e.g. ⌘K)
 */
export const SearchInput = ({
  placeholder = 'Search...',
  shortcut = '⌘K',
  value,
  onChange,
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <div className={`ot-search-input-wrapper ot-search-${size} ${className}`}>
      <Search size={14} className="ot-search-icon" />
      <input
        type="text"
        className="ot-search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {shortcut && <kbd className="ot-search-kbd font-mono">{shortcut}</kbd>}
    </div>
  );
};

/**
 * Select Dropdown
 */
export const Select = ({
  label,
  options = [],
  value,
  onChange,
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <div className={`ot-select-group ${className}`}>
      {label && <label className="ot-label">{label}</label>}
      <div className={`ot-select-wrapper ot-select-${size}`}>
        <select
          className="ot-select"
          value={value}
          onChange={onChange}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="ot-select-chevron" />
      </div>
    </div>
  );
};

/**
 * Toggle Switch
 */
export const Toggle = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`ot-toggle-container ${disabled ? 'is-disabled' : ''} ${className}`}>
      <div className="ot-toggle-text-wrap">
        {label && <span className="ot-toggle-label">{label}</span>}
        {description && <span className="ot-toggle-desc">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`ot-toggle-switch ${checked ? 'is-checked' : ''}`}
        onClick={() => !disabled && onChange && onChange(!checked)}
      >
        <span className="ot-toggle-thumb" />
      </button>
    </label>
  );
};

/**
 * Checkbox
 */
export const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`ot-checkbox-wrapper ${disabled ? 'is-disabled' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
        className="ot-checkbox-input"
      />
      <span className="ot-checkbox-custom" />
      {label && <span className="ot-checkbox-label">{label}</span>}
    </label>
  );
};
