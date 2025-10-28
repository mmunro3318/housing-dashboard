/**
 * Tenant Generator
 * Generates realistic tenant records with payment types, dates, and assignments
 */

import { faker } from '@faker-js/faker';

/**
 * Generate tenant records
 * @param {Array} beds - Array of bed records with bed_id and status
 * @param {Object} systemSettings - System settings (voucher rates, etc.)
 * @param {number} count - Number of tenants to generate (default: 32)
 * @returns {Array} Array of tenant objects
 */
export function generateTenants(beds, systemSettings, count = 32) {
  const tenants = [];
  const occupiedBeds = beds.filter(b => b.status === 'Occupied');
  const pendingBeds = beds.filter(b => b.status === 'Pending');

  // Payment type distribution
  const paymentTypes = [
    { type: 'Voucher', weight: 0.40, rate: parseFloat(systemSettings.voucher_rate) },
    { type: 'ERD', weight: 0.30, rate: 0 },
    { type: 'Private Pay', weight: 0.20, rate: faker.number.float({ min: 650, max: 750, fractionDigits: 2 }) },
    { type: 'Family Support', weight: 0.10, rate: 700 }
  ];

  // Tenant types for classification
  const tenantTypeOptions = [
    ['DOC', 'In Recovery'],
    ['DOC', 'Probation'],
    ['DOC', 'Parole'],
    ['TeleCare', 'Mental Health'],
    ['Voucher Recipient'],
    ['Private Resident']
  ];

  // Calculate how many tenants for each status
  const numOccupied = occupiedBeds.length;
  const numPending = pendingBeds.length;
  const numExited = Math.floor(count * 0.20); // 20% exited
  const numWaitlist = count - numOccupied - numPending - numExited;

  let tenantIndex = 0;

  // Helper to calculate rent
  function calculateRent(entryDate, actualRent, paymentType) {
    if (paymentType === 'ERD' || paymentType === 'Voucher') {
      return { rent_due: 0, rent_paid: 0 };
    }

    const monthsOccupied = Math.max(1, Math.floor(
      (new Date() - new Date(entryDate)) / (1000 * 60 * 60 * 24 * 30)
    ));

    const rent_due = actualRent * monthsOccupied;

    // 70% are fully paid, 30% behind on rent
    const isBehind = faker.datatype.boolean({ probability: 0.3 });
    const rent_paid = isBehind
      ? rent_due - faker.number.float({ min: 50, max: 300, fractionDigits: 2 })
      : rent_due;

    return { rent_due, rent_paid };
  }

  // Helper to generate voucher dates
  function generateVoucherDates(entryDate) {
    const voucherStart = faker.date.between({
      from: new Date(entryDate),
      to: new Date(new Date(entryDate).getTime() + 30 * 24 * 60 * 60 * 1000) // Within 30 days of entry
    });

    const voucherEnd = faker.date.between({
      from: new Date(voucherStart.getTime() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months later
      to: new Date(voucherStart.getTime() + 12 * 30 * 24 * 60 * 60 * 1000) // 12 months later
    });

    return {
      voucher_start: voucherStart.toISOString().split('T')[0],
      voucher_end: voucherEnd.toISOString().split('T')[0]
    };
  }

  // Generate occupied tenants (assigned to occupied beds)
  for (let i = 0; i < numOccupied && tenantIndex < count; i++, tenantIndex++) {
    const bed = occupiedBeds[i];
    const paymentType = faker.helpers.weightedArrayElement(
      paymentTypes.map(p => ({ value: p, weight: p.weight }))
    );

    const entryDate = faker.date.between({
      from: new Date('2023-01-01'),
      to: new Date('2024-10-15')
    }).toISOString().split('T')[0];

    const actualRent = paymentType.type === 'Private Pay'
      ? faker.number.float({ min: 650, max: 750, fractionDigits: 2 })
      : paymentType.rate;

    const { rent_due, rent_paid } = calculateRent(entryDate, actualRent, paymentType.type);

    const voucherDates = paymentType.type === 'Voucher'
      ? generateVoucherDates(entryDate)
      : { voucher_start: null, voucher_end: null };

    const gender = faker.helpers.arrayElement(['Male', 'Female', 'Non-binary', 'Prefer not to say']);

    tenants.push({
      full_name: faker.person.fullName({ sex: gender.toLowerCase() === 'male' ? 'male' : 'female' }),
      dob: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }).toISOString().split('T')[0],
      phone: faker.phone.number({ style: 'national' }),
      email: faker.helpers.maybe(() => faker.internet.email(), { probability: 0.5 }),
      address: faker.helpers.maybe(() => faker.location.streetAddress({ useFullAddress: true }), { probability: 0.3 }),
      gender: gender,
      profile_picture_url: null,
      tenant_types: faker.helpers.arrayElement(tenantTypeOptions),
      entry_date: entryDate,
      exit_date: null,
      payment_type: paymentType.type,
      actual_rent: actualRent,
      voucher_start: voucherDates.voucher_start,
      voucher_end: voucherDates.voucher_end,
      rent_due: rent_due,
      rent_paid: rent_paid,
      application_status: 'Approved',
      bed_id: bed.bed_id,
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 })
    });
  }

  // Generate pending tenants (assigned to pending beds)
  for (let i = 0; i < numPending && tenantIndex < count; i++, tenantIndex++) {
    const bed = pendingBeds[i];
    const paymentType = faker.helpers.weightedArrayElement(
      paymentTypes.map(p => ({ value: p, weight: p.weight }))
    );

    const entryDate = faker.date.soon({ days: 30 }).toISOString().split('T')[0]; // Future entry date

    const actualRent = paymentType.type === 'Private Pay'
      ? faker.number.float({ min: 650, max: 750, fractionDigits: 2 })
      : paymentType.rate;

    const voucherDates = paymentType.type === 'Voucher'
      ? generateVoucherDates(entryDate)
      : { voucher_start: null, voucher_end: null };

    const gender = faker.helpers.arrayElement(['Male', 'Female', 'Non-binary', 'Prefer not to say']);

    tenants.push({
      full_name: faker.person.fullName({ sex: gender.toLowerCase() === 'male' ? 'male' : 'female' }),
      dob: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }).toISOString().split('T')[0],
      phone: faker.phone.number({ style: 'national' }),
      email: faker.helpers.maybe(() => faker.internet.email(), { probability: 0.5 }),
      address: faker.helpers.maybe(() => faker.location.streetAddress({ useFullAddress: true }), { probability: 0.3 }),
      gender: gender,
      profile_picture_url: null,
      tenant_types: faker.helpers.arrayElement(tenantTypeOptions),
      entry_date: entryDate,
      exit_date: null,
      payment_type: paymentType.type,
      actual_rent: actualRent,
      voucher_start: voucherDates.voucher_start,
      voucher_end: voucherDates.voucher_end,
      rent_due: 0,
      rent_paid: 0,
      application_status: 'Approved',
      bed_id: bed.bed_id,
      notes: 'Pending move-in'
    });
  }

  // Generate exited tenants (no bed assignment)
  for (let i = 0; i < numExited && tenantIndex < count; i++, tenantIndex++) {
    const paymentType = faker.helpers.weightedArrayElement(
      paymentTypes.map(p => ({ value: p, weight: p.weight }))
    );

    const entryDate = faker.date.between({
      from: new Date('2023-01-01'),
      to: new Date('2024-06-01')
    }).toISOString().split('T')[0];

    const exitDate = faker.date.between({
      from: new Date(entryDate),
      to: new Date('2024-10-27')
    }).toISOString().split('T')[0];

    const actualRent = paymentType.type === 'Private Pay'
      ? faker.number.float({ min: 650, max: 750, fractionDigits: 2 })
      : paymentType.rate;

    const { rent_due, rent_paid } = calculateRent(entryDate, actualRent, paymentType.type);

    const gender = faker.helpers.arrayElement(['Male', 'Female', 'Non-binary', 'Prefer not to say']);

    tenants.push({
      full_name: faker.person.fullName({ sex: gender.toLowerCase() === 'male' ? 'male' : 'female' }),
      dob: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }).toISOString().split('T')[0],
      phone: faker.phone.number({ style: 'national' }),
      email: faker.helpers.maybe(() => faker.internet.email(), { probability: 0.5 }),
      address: faker.helpers.maybe(() => faker.location.streetAddress({ useFullAddress: true }), { probability: 0.3 }),
      gender: gender,
      profile_picture_url: null,
      tenant_types: faker.helpers.arrayElement(tenantTypeOptions),
      entry_date: entryDate,
      exit_date: exitDate,
      payment_type: paymentType.type,
      actual_rent: actualRent,
      voucher_start: null,
      voucher_end: null,
      rent_due: rent_due,
      rent_paid: rent_paid,
      application_status: 'Approved',
      bed_id: null,
      notes: 'Exited program'
    });
  }

  // Generate waitlist tenants (no bed assignment, pending application)
  for (let i = 0; i < numWaitlist && tenantIndex < count; i++, tenantIndex++) {
    const gender = faker.helpers.arrayElement(['Male', 'Female', 'Non-binary', 'Prefer not to say']);

    tenants.push({
      full_name: faker.person.fullName({ sex: gender.toLowerCase() === 'male' ? 'male' : 'female' }),
      dob: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }).toISOString().split('T')[0],
      phone: faker.phone.number({ style: 'national' }),
      email: faker.helpers.maybe(() => faker.internet.email(), { probability: 0.5 }),
      address: faker.helpers.maybe(() => faker.location.streetAddress({ useFullAddress: true }), { probability: 0.3 }),
      gender: gender,
      profile_picture_url: null,
      tenant_types: [],
      entry_date: null,
      exit_date: null,
      payment_type: null,
      actual_rent: null,
      voucher_start: null,
      voucher_end: null,
      rent_due: 0,
      rent_paid: 0,
      application_status: 'Waitlist',
      bed_id: null,
      notes: 'Awaiting bed availability'
    });
  }

  return tenants;
}
