/**
 * Form Submission Generator
 * Generates Application and Intake form submissions with JSONB data
 */

import { faker } from '@faker-js/faker';

/**
 * Generate form submission records
 * @param {Array} tenants - Array of tenant records with tenant_id
 * @param {Array} profiles - Array of tenant profile records
 * @param {Array} emergencyContacts - Array of emergency contact records
 * @returns {Array} Array of form submission objects
 */
export function generateFormSubmissions(tenants, profiles, emergencyContacts) {
  const submissions = [];

  // Helper to generate signature placeholder (Base64-like string)
  function generateSignaturePlaceholder() {
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
  }

  tenants.forEach(tenant => {
    const profile = profiles.find(p => p.tenant_id === tenant.tenant_id);
    const contacts = emergencyContacts.filter(c => c.tenant_id === tenant.tenant_id);

    // Generate Application form for ALL tenants
    const applicationFormData = {
      personal: {
        first_name: tenant.full_name.split(' ')[0],
        last_name: tenant.full_name.split(' ').slice(1).join(' '),
        dob: tenant.dob,
        phone: tenant.phone,
        email: tenant.email,
        gender: tenant.gender,
        address: tenant.address
      },
      recovery: profile?.is_in_recovery ? {
        is_in_recovery: profile.is_in_recovery,
        drug_of_choice: profile.drug_of_choice,
        substances_previously_used: profile.substances_previously_used,
        recovery_program: profile.recovery_program,
        sober_date: profile.sober_date
      } : {
        is_in_recovery: false
      },
      legal: {
        criminal_history: profile?.criminal_history || 'None disclosed',
        is_on_probation: profile?.is_on_probation || false,
        is_on_parole: profile?.is_on_parole || false,
        probation_parole_officer_name: profile?.probation_parole_officer_name,
        probation_parole_officer_phone: profile?.probation_parole_officer_phone,
        probation_parole_completion_date: profile?.probation_parole_completion_date,
        is_registered_sex_offender: profile?.is_registered_sex_offender || false,
        sex_offense_details: profile?.sex_offense_details
      },
      emergency_contacts: contacts.map(c => ({
        first_name: c.first_name,
        last_name: c.last_name,
        phone: c.phone,
        relationship: c.relationship,
        email: c.email,
        is_primary: c.is_primary
      })),
      veteran_status: {
        is_veteran: profile?.is_veteran || false
      },
      signature: {
        signature_data: generateSignaturePlaceholder(),
        signed_date: faker.date.between({
          from: new Date('2023-01-01'),
          to: new Date(tenant.entry_date || '2024-10-27')
        }).toISOString()
      }
    };

    submissions.push({
      tenant_id: tenant.tenant_id,
      form_type: 'Application',
      form_data: applicationFormData,
      status: tenant.application_status === 'Waitlist' ? 'Pending' : 'Approved',
      pdf_url: null,
      submitted_at: faker.date.between({
        from: new Date('2023-01-01'),
        to: new Date(tenant.entry_date || '2024-10-27')
      }).toISOString(),
      reviewed_at: tenant.application_status !== 'Waitlist'
        ? faker.date.between({
          from: new Date('2023-01-01'),
          to: new Date(tenant.entry_date || '2024-10-27')
        }).toISOString()
        : null,
      reviewed_by: tenant.application_status !== 'Waitlist' ? 'Manager' : null
    });

    // Generate Intake form for occupied/approved tenants (~60% of total)
    if (tenant.application_status === 'Approved' && tenant.bed_id) {
      const intakeFormData = {
        tenant_info: {
          full_name: tenant.full_name,
          dob: tenant.dob,
          phone: tenant.phone,
          email: tenant.email
        },
        housing_assignment: {
          entry_date: tenant.entry_date,
          bed_id: tenant.bed_id,
          payment_type: tenant.payment_type,
          actual_rent: tenant.actual_rent,
          voucher_start: tenant.voucher_start,
          voucher_end: tenant.voucher_end
        },
        program_info: {
          doc_number: profile?.doc_number,
          telecare_id: profile?.telecare_id,
          is_erd: profile?.is_erd || false,
          erd_date: profile?.erd_date
        },
        employment: {
          employment_status: profile?.employment_status,
          employment_details: profile?.employment_details
        },
        additional_info: {
          food_allergies: profile?.food_allergies || 'None',
          notes: tenant.notes
        },
        acknowledgment: {
          agrees_to_all_policies: true,
          signature_data: generateSignaturePlaceholder(),
          signed_date: new Date(tenant.entry_date).toISOString()
        }
      };

      submissions.push({
        tenant_id: tenant.tenant_id,
        form_type: 'Intake',
        form_data: intakeFormData,
        status: 'Approved',
        pdf_url: null,
        submitted_at: new Date(tenant.entry_date).toISOString(),
        reviewed_at: new Date(tenant.entry_date).toISOString(),
        reviewed_by: 'Manager'
      });
    }
  });

  return submissions;
}
