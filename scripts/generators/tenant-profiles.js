/**
 * Tenant Profile Generator
 * Generates extended profile information (recovery, legal, employment, program IDs)
 */

import { faker } from '@faker-js/faker';

/**
 * Generate tenant profile records (1:1 with tenants)
 * @param {Array} tenants - Array of tenant records with tenant_id
 * @returns {Array} Array of tenant profile objects
 */
export function generateTenantProfiles(tenants) {
  const profiles = [];

  const drugsOfChoice = ['Opioids', 'Methamphetamine', 'Alcohol', 'Cocaine', 'Heroin', 'Marijuana'];
  const recoveryPrograms = [
    '12-Step (AA/NA)',
    'SMART Recovery',
    'Faith-Based Recovery',
    'Outpatient Treatment',
    'Intensive Outpatient (IOP)',
    'Medication-Assisted Treatment (MAT)'
  ];

  const employmentStatuses = ['Employed Full-Time', 'Employed Part-Time', 'Unemployed', 'Seeking Employment', 'Disabled'];

  tenants.forEach(tenant => {
    // Determine if tenant is in recovery (60-70%)
    const isInRecovery = faker.datatype.boolean({ probability: 0.65 });

    // Determine legal status
    const isOnProbation = faker.datatype.boolean({ probability: 0.30 });
    const isOnParole = faker.datatype.boolean({ probability: 0.40 });

    // Small chance of being registered sex offender (~5%)
    const isSexOffender = faker.datatype.boolean({ probability: 0.05 });

    // Veteran status (~15%)
    const isVeteran = faker.datatype.boolean({ probability: 0.15 });

    // Check if TeleCare tenant (from tenant_types)
    const isTeleCare = tenant.tenant_types && tenant.tenant_types.includes('TeleCare');

    // Generate DOC number (all tenants have this - DOC program clientele)
    const docNumber = `DOC${faker.string.numeric({ length: 6 })}`;

    // Generate TeleCare ID if applicable
    const telecareId = isTeleCare ? `TC${faker.string.numeric({ length: 5 })}` : null;

    // Recovery dates (if in recovery)
    const soberDate = isInRecovery
      ? faker.date.between({
        from: new Date(new Date(tenant.entry_date || '2023-01-01').getTime() - 24 * 30 * 24 * 60 * 60 * 1000), // Up to 24 months before entry
        to: new Date(tenant.entry_date || '2024-01-01')
      }).toISOString().split('T')[0]
      : null;

    // Probation/Parole completion date (if applicable)
    const probationParoleDate = (isOnProbation || isOnParole)
      ? faker.date.future({ years: 2 }).toISOString().split('T')[0]
      : null;

    profiles.push({
      tenant_id: tenant.tenant_id,

      // Program-Specific IDs
      doc_number: docNumber,
      telecare_id: telecareId,

      // DOC-Specific: Community Corrections Officer (if on probation/parole)
      cco_name: (isOnProbation || isOnParole) ? faker.person.fullName() : null,
      cco_phone: (isOnProbation || isOnParole) ? faker.phone.number({ style: 'national' }) : null,

      // DOC-Specific: Estimated Release Date (for pending inmates)
      is_erd: tenant.payment_type === 'ERD',
      erd_date: tenant.payment_type === 'ERD'
        ? faker.date.future({ years: 1 }).toISOString().split('T')[0]
        : null,

      // Employment
      employment_status: faker.helpers.arrayElement(employmentStatuses),
      employment_details: faker.helpers.maybe(() =>
        faker.helpers.arrayElement([
          'Works at local grocery store',
          'Construction laborer',
          'Warehouse worker',
          'Food service industry',
          'Seeking work through WorkSource',
          null
        ]),
        { probability: 0.5 }
      ),
      food_allergies: faker.helpers.maybe(() =>
        faker.helpers.arrayElement(['None', 'Dairy', 'Gluten', 'Nuts', 'Shellfish']),
        { probability: 0.3 }
      ),

      // Recovery Information
      is_in_recovery: isInRecovery,
      drug_of_choice: isInRecovery ? faker.helpers.arrayElement(drugsOfChoice) : null,
      substances_previously_used: isInRecovery
        ? faker.helpers.arrayElements(drugsOfChoice, { min: 1, max: 3 }).join(', ')
        : null,
      recovery_program: isInRecovery ? faker.helpers.arrayElement(recoveryPrograms) : null,
      sober_date: soberDate,

      // Legal/Probation/Parole
      is_on_probation: isOnProbation,
      is_on_parole: isOnParole,
      probation_parole_officer_name: (isOnProbation || isOnParole) ? faker.person.fullName() : null,
      probation_parole_officer_phone: (isOnProbation || isOnParole) ? faker.phone.number({ style: 'national' }) : null,
      probation_parole_completion_date: probationParoleDate,
      criminal_history: faker.helpers.maybe(() =>
        faker.helpers.arrayElement([
          'Drug possession (2020)',
          'Assault (2018)',
          'Theft (2019)',
          'DUI (2021)',
          'Burglary (2017)',
          'Domestic violence (2019)',
          'Multiple drug-related offenses'
        ]),
        { probability: 0.8 } // 80% have documented criminal history
      ),

      // Sex Offender Status
      is_registered_sex_offender: isSexOffender,
      sex_offense_details: isSexOffender
        ? 'Level II sex offender - registered with county'
        : null,

      // Veteran Status
      is_veteran: isVeteran
    });
  });

  return profiles;
}
