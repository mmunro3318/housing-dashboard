import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import { useUpdateProperty } from '../../hooks/usePropertyMutations';
import { validatePropertyForm } from '../../utils/validation';

/**
 * Edit Property Modal
 *
 * Modal form for editing an existing property's details.
 *
 * Features:
 * - Pre-populates form with current property data
 * - Updates only property details (not bed records)
 * - County normalization
 * - Inline success message before closing
 * - Form validation with real-time error display
 *
 * Note: To add/remove beds, use the Add Bed button within the property card.
 */
export default function EditPropertyModal({ isOpen, onClose, property }) {
  const [formData, setFormData] = useState({
    address: '',
    county: '',
    total_beds: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const updatePropertyMutation = useUpdateProperty();

  // Pre-populate form when property changes
  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address || '',
        county: property.county || '',
        total_beds: property.total_beds || '',
        notes: property.notes || '',
      });
    }
  }, [property]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form (reuse property form validation)
    const validationErrors = validatePropertyForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updatePropertyMutation.mutateAsync({
        houseId: property.house_id,
        updates: {
          address: formData.address,
          county: formData.county,
          total_beds: parseInt(formData.total_beds),
          notes: formData.notes,
        },
      });

      // Success! Show success message briefly, then close
      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to update property' });
    }
  };

  const handleClose = () => {
    // Reset state
    setErrors({});
    setShowSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Property" size="lg">
      {showSuccess ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Updated!</h3>
          <p className="text-sm text-gray-600">Your changes have been saved.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address */}
          <FormField
            label="Address"
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            error={errors.address}
            required
            placeholder="123 Main St, Seattle WA 98101"
          />

          {/* County */}
          <FormField
            label="County"
            type="text"
            value={formData.county}
            onChange={(e) => handleChange('county', e.target.value)}
            error={errors.county}
            placeholder="King"
          />

          {/* Total Beds */}
          <FormField
            label="Total Beds (for tracking)"
            type="number"
            value={formData.total_beds}
            onChange={(e) => handleChange('total_beds', e.target.value)}
            error={errors.total_beds}
            required
            min="1"
            max="50"
          />
          <p className="text-xs text-gray-500 -mt-2">
            Note: This updates the bed count for tracking. To add/remove actual beds, use the bed
            management buttons.
          </p>

          {/* Notes */}
          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            placeholder="Property manager contact, maintenance info, etc."
          />

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={updatePropertyMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
