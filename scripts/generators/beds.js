/**
 * Bed Generator
 * Generates bed/room inventory for each house
 */

import { faker } from '@faker-js/faker';

/**
 * Generate bed records for given houses
 * @param {Array} houses - Array of house records with house_id and total_beds
 * @returns {Array} Array of bed objects
 */
export function generateBeds(houses) {
  const beds = [];
  const statusWeights = [
    { status: 'Occupied', weight: 0.65 },    // 65% occupied
    { status: 'Available', weight: 0.30 },   // 30% available
    { status: 'Pending', weight: 0.04 },     // 4% pending
    { status: 'Hold', weight: 0.01 }         // 1% on hold
  ];

  houses.forEach(house => {
    const bedsInHouse = house.total_beds;

    for (let i = 0; i < bedsInHouse; i++) {
      // Generate room number (Room 1A, 1B, 2A, 2B, etc.)
      const roomNum = Math.floor(i / 2) + 1;
      const roomLetter = i % 2 === 0 ? 'A' : 'B';
      const roomNumber = `Room ${roomNum}${roomLetter}`;

      // Select status based on weights
      const status = faker.helpers.weightedArrayElement(statusWeights.map(s => ({
        value: s.status,
        weight: s.weight
      })));

      beds.push({
        house_id: house.house_id,
        room_number: roomNumber,
        base_rent: faker.number.float({ min: 700, max: 800, fractionDigits: 2 }),
        status: status,
        tenant_id: null, // Will be set later (circular FK with tenants)
        notes: faker.helpers.maybe(() =>
          faker.helpers.arrayElement([
            'Window view',
            'Ground floor',
            'Shared bathroom',
            'Private entrance',
            null
          ]),
          { probability: 0.2 } // 20% chance of having notes
        )
      });
    }
  });

  return beds;
}
