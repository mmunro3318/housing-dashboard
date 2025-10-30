import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import { useAddProperty } from '../../hooks/usePropertyMutations';
import { validatePropertyForm } from '../../utils/validation';

/**
 * Add Property Modal
 *
 * Modal form for creating a new property with auto-generated beds.
 *
 * Features:
 * - Creates property (house) and N beds in one operation
 * - Sequential room numbering (1, 2, 3...)
 * - County normalization (removes "county" suffix, capitalizes)
 * - Inline success message before closing
 * - Form validation with real-time error display
 */
export default function AddPropertyModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    address: '',
    county: '',
    total_beds: '',
    default_base_rent: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const addPropertyMutation = useAddProperty();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validatePropertyForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await addPropertyMutation.mutateAsync({
        ...formData,
        total_beds: parseInt(formData.total_beds),
        default_base_rent: formData.default_base_rent
          ? parseFloat(formData.default_base_rent)
          : 0,
      });

      // Success! Show success message briefly, then close
      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create property' });
    }
  };

  const handleClose = () => {
    // Reset form and state
    setFormData({
      address: '',
      county: '',
      total_beds: '',
      default_base_rent: '',
      notes: '',
    });
    setErrors({});
    setShowSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Property" size="lg">
      {showSuccess ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Created!</h3>
          <p className="text-sm text-gray-600">
            {formData.total_beds} beds have been added to the property.
          </p>
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

          {/* Number of Beds */}
          <FormField
            label="Number of Beds"
            type="number"
            value={formData.total_beds}
            onChange={(e) => handleChange('total_beds', e.target.value)}
            error={errors.total_beds}
            required
            min="1"
            max="50"
            placeholder="5"
          />
          <p className="text-xs text-gray-500 -mt-2">
            Beds will be auto-created with room numbers 1, 2, 3, etc.
          </p>

          {/* Default Base Rent */}
          <FormField
            label="Default Rent per Bed (optional)"
            type="number"
            value={formData.default_base_rent}
            onChange={(e) => handleChange('default_base_rent', e.target.value)}
            error={errors.default_base_rent}
            min="0"
            step="0.01"
            placeholder="700.00"
          />
          <p className="text-xs text-gray-500 -mt-2">
            All beds will start with this rent amount. You can edit individual beds later.
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
            <Button variant="primary" type="submit" loading={addPropertyMutation.isPending}>
              Create Property & Beds
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
