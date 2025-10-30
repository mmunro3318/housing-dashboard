import React from 'react';

/**
 * Reusable Button Component
 *
 * Features:
 * - Multiple variants (primary, secondary, danger, ghost)
 * - Loading state with spinner
 * - Disabled state
 * - Consistent sizing and styling
 * - Full accessibility support
 *
 * @param {string} variant - Button style: 'primary', 'secondary', 'danger', 'ghost'
 * @param {boolean} loading - Shows spinner and disables button
 * @param {boolean} disabled - Disables button
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} children - Button content
 * @param {string} type - HTML button type: 'button', 'submit', 'reset'
 * @param {string} className - Additional CSS classes
 */
export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  children,
  type = 'button',
  className = '',
}) {
  // Base styles shared by all variants
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';

  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
  };

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-busy={loading}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
