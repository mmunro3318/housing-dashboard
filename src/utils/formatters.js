/**
 * Data Formatting Utilities
 *
 * Provides functions to normalize and format user input data.
 */

/**
 * Normalize County Name
 *
 * Rules:
 * 1. Remove "county" suffix (case-insensitive)
 * 2. Capitalize first letter of each word
 * 3. Trim whitespace
 *
 * Examples:
 * - "king county" → "King"
 * - "KING COUNTY" → "King"
 * - "King" → "King"
 * - "pierce" → "Pierce"
 * - "snohomish County" → "Snohomish"
 *
 * @param {string} county - Raw county input from user
 * @returns {string} - Normalized county name
 */
export const normalizeCounty = (county) => {
  if (!county || typeof county !== 'string') {
    return '';
  }

  // Trim whitespace
  let normalized = county.trim();

  // Remove "county" suffix (case-insensitive)
  normalized = normalized.replace(/\s+county\s*$/i, '');

  // Trim again after removing suffix
  normalized = normalized.trim();

  // Capitalize first letter of each word
  normalized = normalized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return normalized;
};

/**
 * Format Currency
 *
 * Formats a number as USD currency string
 *
 * Examples:
 * - 700 → "$700"
 * - 1250.50 → "$1,250.50"
 * - 0 → "$0"
 *
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format Date
 *
 * Formats a date string or Date object to readable format
 *
 * Examples:
 * - "2024-01-15" → "Jan 15, 2024"
 * - Date object → "Jan 15, 2024"
 *
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};
