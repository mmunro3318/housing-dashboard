/**
 * Form Validation Utilities
 *
 * Provides validation functions for property and bed forms.
 * Returns an object with field names as keys and error messages as values.
 * Empty object = no errors (form is valid).
 */

/**
 * Validate Add/Edit Property Form
 *
 * Required fields:
 * - address: string, min 5 characters
 * - total_beds: number, min 1, max 50
 *
 * Optional fields:
 * - county: string (will be normalized)
 * - default_base_rent: number, min 0
 * - notes: text
 *
 * @param {Object} data - Form data to validate
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validatePropertyForm = (data) => {
  const errors = {};

  // Address validation
  if (!data.address || data.address.trim().length === 0) {
    errors.address = 'Address is required';
  } else if (data.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters';
  }

  // Total beds validation
  if (!data.total_beds) {
    errors.total_beds = 'Number of beds is required';
  } else {
    const beds = parseInt(data.total_beds);
    if (isNaN(beds) || beds < 1) {
      errors.total_beds = 'Must have at least 1 bed';
    } else if (beds > 50) {
      errors.total_beds = 'Maximum 50 beds per property';
    }
  }

  // Default base rent validation (optional, but must be valid if provided)
  if (data.default_base_rent !== '' && data.default_base_rent !== null && data.default_base_rent !== undefined) {
    const rent = parseFloat(data.default_base_rent);
    if (isNaN(rent) || rent < 0) {
      errors.default_base_rent = 'Rent cannot be negative';
    }
  }

  return errors;
};

/**
 * Validate Add/Edit Bed Form
 *
 * Required fields:
 * - room_number: string, min 1 character
 * - base_rent: number, min 0
 * - status: enum ['Available', 'Occupied', 'Pending', 'Hold']
 *
 * Optional fields:
 * - notes: text
 *
 * @param {Object} data - Form data to validate
 * @param {Array} existingBeds - Array of existing beds in same house (for duplicate check)
 * @param {string} currentBedId - ID of current bed being edited (to exclude from duplicate check)
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateBedForm = (data, existingBeds = [], currentBedId = null) => {
  const errors = {};

  // Room number validation
  if (!data.room_number || data.room_number.trim().length === 0) {
    errors.room_number = 'Room number is required';
  } else {
    // Check for duplicate room numbers in same house
    const duplicate = existingBeds.find(
      (bed) =>
        bed.room_number === data.room_number.trim() &&
        bed.bed_id !== currentBedId
    );
    if (duplicate) {
      errors.room_number = 'Room number already exists in this property';
    }
  }

  // Base rent validation
  if (data.base_rent === '' || data.base_rent === null || data.base_rent === undefined) {
    errors.base_rent = 'Base rent is required';
  } else {
    const rent = parseFloat(data.base_rent);
    if (isNaN(rent) || rent < 0) {
      errors.base_rent = 'Rent cannot be negative';
    }
  }

  // Status validation
  const validStatuses = ['Available', 'Occupied', 'Pending', 'Hold'];
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.status = 'Invalid status';
  }

  return errors;
};
