/**
 * Date Helper Utilities
 * Provides consistent date handling for voucher expiration calculations
 */

/**
 * Calculate the number of days until a future date
 * @param {string|Date} futureDate - The future date to calculate days until
 * @returns {number} Number of days until the date (negative if past)
 */
export const getDaysUntil = (futureDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const future = new Date(futureDate);
  future.setHours(0, 0, 0, 0); // Normalize to start of day

  const diffTime = future - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Check if a date falls within a specified number of days from today
 * @param {string|Date} date - The date to check
 * @param {number} days - Number of days to check within
 * @returns {boolean} True if date is within the specified days
 */
export const isWithinDays = (date, days) => {
  const daysUntil = getDaysUntil(date);
  return daysUntil >= 0 && daysUntil <= days;
};

/**
 * Format a date string to a readable format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date (e.g., "Jan 15, 2025")
 */
export const formatDate = (date) => {
  if (!date) return '';

  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get urgency level based on days until expiration
 * @param {number} daysUntil - Number of days until expiration
 * @returns {string} Urgency level: 'critical', 'warning', or 'normal'
 */
export const getUrgencyLevel = (daysUntil) => {
  if (daysUntil <= 7) return 'critical';
  if (daysUntil <= 30) return 'warning';
  return 'normal';
};
