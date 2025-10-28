/**
 * Emergency Contact Generator
 * Generates 1-3 emergency contacts per tenant
 */

import { faker } from '@faker-js/faker';

/**
 * Generate emergency contact records for tenants
 * @param {Array} tenants - Array of tenant records with tenant_id
 * @returns {Array} Array of emergency contact objects
 */
export function generateEmergencyContacts(tenants) {
  const contacts = [];

  const relationships = [
    'Mother',
    'Father',
    'Sibling',
    'Spouse',
    'Partner',
    'Friend',
    'Case Manager',
    'Counselor',
    'Social Worker',
    'Adult Child'
  ];

  tenants.forEach(tenant => {
    // Generate 1-3 contacts per tenant (weighted toward 2)
    const numContacts = faker.helpers.weightedArrayElement([
      { value: 1, weight: 0.2 },
      { value: 2, weight: 0.6 },
      { value: 3, weight: 0.2 }
    ]);

    // Ensure we don't use the same relationship twice
    const usedRelationships = [];

    for (let i = 0; i < numContacts; i++) {
      // Pick a unique relationship
      let relationship;
      do {
        relationship = faker.helpers.arrayElement(relationships);
      } while (usedRelationships.includes(relationship) && usedRelationships.length < relationships.length);
      usedRelationships.push(relationship);

      const gender = faker.helpers.arrayElement(['male', 'female']);

      // Determine last name (family members more likely to share tenant's last name)
      const shouldShareLastName = relationship.match(/Mother|Father|Sibling/)
        ? faker.datatype.boolean({ probability: 0.8 })
        : faker.datatype.boolean({ probability: 0.2 });

      const lastName = shouldShareLastName
        ? (tenant.full_name?.split(' ')[1] || faker.person.lastName())
        : faker.person.lastName();

      contacts.push({
        tenant_id: tenant.tenant_id,
        first_name: faker.person.firstName(gender),
        last_name: lastName,
        phone: faker.phone.number({ style: 'national' }),
        relationship: relationship,
        email: faker.helpers.maybe(() => faker.internet.email(), { probability: 0.6 }),
        address: faker.helpers.maybe(() => faker.location.streetAddress({ useFullAddress: true }), { probability: 0.4 }),
        additional_info: faker.helpers.maybe(() =>
          faker.helpers.arrayElement([
            'Available 24/7',
            'Call after 5pm',
            'Work hours only',
            'Primary decision maker',
            null
          ]),
          { probability: 0.3 }
        ),
        is_primary: i === 0 // First contact is primary
      });
    }
  });

  return contacts;
}
