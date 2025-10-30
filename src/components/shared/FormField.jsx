import React from 'react';

/**
 * Reusable Form Field Component
 *
 * Features:
 * - Support for text, number, select, and textarea inputs
 * - Label with optional required indicator
 * - Error message display
 * - Consistent styling across all form inputs
 * - Full accessibility support
 *
 * @param {string} label - Field label text
 * @param {string} type - Input type: 'text', 'number', 'select', 'textarea'
 * @param {string|number} value - Current field value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message to display
 * @param {boolean} required - Shows required indicator (*)
 * @param {string} placeholder - Placeholder text
 * @param {Array} options - Options for select input [{value, label}, ...]
 * @param {number} rows - Number of rows for textarea (default: 3)
 * @param {number} min - Min value for number input
 * @param {number} max - Max value for number input
 * @param {number} step - Step value for number input
 * @param {string} className - Additional CSS classes for the field container
 */
export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  options = [],
  rows = 3,
  min,
  max,
  step,
  className = '',
}) {
  // Common input classes
  const inputBaseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  const inputClasses = error
    ? `${inputBaseClasses} border-red-300 focus:border-red-500 focus:ring-red-500`
    : `${inputBaseClasses} border-gray-300 focus:border-blue-500`;

  // Generate unique ID for accessibility
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`form-field ${className}`}>
      {/* Label */}
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      {type === 'textarea' ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        />
      ) : type === 'select' ? (
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'number' ? (
        <input
          id={fieldId}
          type="number"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        />
      )}

      {/* Error Message */}
      {error && (
        <p id={`${fieldId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
