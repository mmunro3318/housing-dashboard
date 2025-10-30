import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormField from '../shared/FormField';
import { useUpdateBed } from '../../hooks/useBedMutations';
import { validateBedForm } from '../../utils/validation';

/**
 * Edit Bed Modal
 *
 * Modal form for editing an existing bed's details.
 *
 * Features:
 * - Pre-populates form with current bed data
 * - Shows current tenant (read-only) if occupied
 * - Validates room number uniqueness
 * - Status dropdown (Available, Occupied, Pending, Hold)
 * - Inline success message before closing
 * - Form validation with real-time error display
 */
export default function EditBedModal({ isOpen, onClose, bed, houseAddress, existingBeds = [], tenantMap = {} }) {
  const [formData, setFormData] = useState({
    room_number: '',
    base_rent: '',
    status: 'Available',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const updateBedMutation = useUpdateBed();

  // Pre-populate form when bed changes
  useEffect(() => {
    if (bed) {
      setFormData({
        room_number: bed.room_number || '',
        base_rent: bed.base_rent || '',
        status: bed.status || 'Available',
        notes: bed.notes || '',
      });
    }
  }, [bed]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bed) return;

    // Validate form (exclude current bed from duplicate check)
    const validationErrors = validateBedForm(formData, existingBeds, bed.bed_id);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateBedMutation.mutateAsync({
        bedId: bed.bed_id,
        updates: {
          room_number: formData.room_number,
          base_rent: parseFloat(formData.base_rent) || 0,
          status: formData.status,
          notes: formData.notes,
        },
      });

      // Success! Show success message briefly, then close
      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to update bed' });
    }
  };

  const handleClose = () => {
    // Reset state
    setErrors({});
    setShowSuccess(false);
    onClose();
  };

  // Get current tenant if bed is occupied
  const currentTenant = bed?.tenant_id ? tenantMap[bed.tenant_id] : null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Edit Bed - Room ${bed?.room_number || ''}`} size="md">
      {showSuccess ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bed Updated!</h3>
          <p className="text-sm text-gray-600">Your changes have been saved.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Address (read-only) */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Property</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{houseAddress}</p>
          </div>

          {/* Current Tenant (if occupied) */}
          {currentTenant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Current Tenant</p>
              <p className="text-sm font-medium text-blue-900 mt-1">{currentTenant.full_name}</p>
              {currentTenant.actual_rent > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  Paying ${currentTenant.actual_rent.toFixed(0)}/mo
                </p>
              )}
            </div>
          )}

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
            <Button variant="primary" type="submit" loading={updateBedMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
