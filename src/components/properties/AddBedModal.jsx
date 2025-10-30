import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import { useAddBed } from '../../hooks/useBedMutations';
import { validateBedForm } from '../../utils/validation';

/**
 * Add Bed Modal
 *
 * Modal form for adding a new bed to an existing property.
 *
 * Features:
 * - Adds single bed to specified property
 * - Auto-increments house.total_beds
 * - Validates room number uniqueness
 * - Status dropdown (Available, Occupied, Pending, Hold)
 * - Inline success message before closing
 * - Form validation with real-time error display
 */
export default function AddBedModal({ isOpen, onClose, houseId, houseAddress, existingBeds = [] }) {
  const [formData, setFormData] = useState({
    room_number: '',
    base_rent: '',
    status: 'Available',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const addBedMutation = useAddBed();

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
    const validationErrors = validateBedForm(formData, existingBeds, null);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await addBedMutation.mutateAsync({
        house_id: houseId,
        room_number: formData.room_number,
        base_rent: parseFloat(formData.base_rent) || 0,
        status: formData.status,
        notes: formData.notes,
      });

      // Success! Show success message briefly, then close
      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to add bed' });
    }
  };

  const handleClose = () => {
    // Reset form and state
    setFormData({
      room_number: '',
      base_rent: '',
      status: 'Available',
      notes: '',
    });
    setErrors({});
    setShowSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Add Bed to ${houseAddress}`} size="md">
      {showSuccess ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bed Added!</h3>
          <p className="text-sm text-gray-600">The bed has been added to the property.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Number */}
          <FormField
            label="Room Number"
            type="text"
            value={formData.room_number}
            onChange={(e) => handleChange('room_number', e.target.value)}
            error={errors.room_number}
            required
            placeholder="101 or A1"
          />
          <p className="text-xs text-gray-500 -mt-2">
            Must be unique within this property
          </p>

          {/* Base Rent */}
          <FormField
            label="Base Rent"
            type="number"
            value={formData.base_rent}
            onChange={(e) => handleChange('base_rent', e.target.value)}
            error={errors.base_rent}
            required
            min="0"
            step="0.01"
            placeholder="700.00"
          />

          {/* Status */}
          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            error={errors.status}
            required
            options={[
              { value: 'Available', label: 'Available' },
              { value: 'Occupied', label: 'Occupied' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Hold', label: 'Hold' },
            ]}
          />

          {/* Notes */}
          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            placeholder="Bed condition, special features, etc."
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
            <Button variant="primary" type="submit" loading={addBedMutation.isPending}>
              Add Bed
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
