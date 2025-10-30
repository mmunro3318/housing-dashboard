import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';

/**
 * Delete Confirmation Modal
 *
 * Reusable modal for confirming destructive delete operations.
 * Requires user to type "DELETE" to confirm.
 *
 * Features:
 * - Case-insensitive confirmation text matching
 * - Visual warnings with danger details
 * - Loading state during deletion
 * - Automatic reset on close
 *
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Callback when modal closes
 * @param {function} onConfirm - Callback when user confirms deletion
 * @param {string} title - Modal title (e.g., "Delete Property?")
 * @param {string} itemName - Name/identifier of item being deleted
 * @param {string} warningMessage - Primary warning text
 * @param {Array<string>} dangerDetails - List of consequences (bullet points)
 * @param {boolean} isLoading - Whether deletion is in progress
 * @param {string} confirmationText - Text user must type (default: "DELETE")
 */
export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item?',
  itemName,
  warningMessage = 'This action cannot be undone.',
  dangerDetails = [],
  isLoading = false,
  confirmationText = 'DELETE',
}) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    // Case-insensitive comparison
    if (inputValue.trim().toLowerCase() !== confirmationText.toLowerCase()) {
      setError(`Please type ${confirmationText} to confirm`);
      return;
    }

    onConfirm();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const isConfirmDisabled =
    isLoading || inputValue.trim().toLowerCase() !== confirmationText.toLowerCase();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Item Name */}
        {itemName && (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{itemName}</p>
          </div>
        )}

        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-900 mb-2">{warningMessage}</p>

          {/* Danger Details */}
          {dangerDetails.length > 0 && (
            <ul className="space-y-1 text-sm text-red-800">
              {dangerDetails.map((detail, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirmation Input */}
        <div>
          <label htmlFor="delete-confirm" className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold text-red-600">{confirmationText}</span> to confirm
          </label>
          <input
            id="delete-confirm"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder={confirmationText}
            autoComplete="off"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={isLoading}
            disabled={isConfirmDisabled}
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
}
