/**
 * Policy Agreement Generator
 * Generates 10 policy agreements for each Intake form submission
 */

import { faker } from '@faker-js/faker';

/**
 * Generate policy agreement records for Intake forms
 * @param {Array} formSubmissions - Array of form submission records with submission_id
 * @returns {Array} Array of policy agreement objects
 */
export function generatePolicyAgreements(formSubmissions) {
  const agreements = [];

  // 10 required policy sections for Intake form
  const policySections = [
    'Substance Use',
    'Recovery',
    'Guest',
    'Behavioral',
    'House',
    'Safety',
    'Rights',
    'Medications',
    'Neighbors',
    'Payments'
  ];

  // Helper to generate signature placeholder (Base64-like string)
  function generateSignaturePlaceholder() {
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
  }

  // Only generate agreements for Intake forms
  const intakeForms = formSubmissions.filter(f => f.form_type === 'Intake');

  intakeForms.forEach(form => {
    policySections.forEach(section => {
      agreements.push({
        tenant_id: form.tenant_id,
        form_submission_id: form.submission_id,
        policy_section: section,
        agreed: true, // All policies agreed for approved tenants
        signature_data: generateSignaturePlaceholder(),
        signed_at: form.submitted_at // Same date as Intake form submission
      });
    });
  });

  return agreements;
}
