/**
 * House Generator
 * Generates realistic Seattle halfway house addresses
 */

import { faker } from '@faker-js/faker';

/**
 * Generate house records
 * @param {number} count - Number of houses to generate (default: 5)
 * @returns {Array} Array of house objects
 */
export function generateHouses(count = 5) {
  // Use realistic Seattle addresses (based on prototype data + one additional)
  const seattleAddresses = [
    '1234 Pine Street, Seattle, WA 98101',
    '5678 Broadway Ave E, Seattle, WA 98102',
    '910 Madison St, Seattle, WA 98104',
    '2345 Summit Ave E, Seattle, WA 98122',
    '3456 Eastlake Ave E, Seattle, WA 98102'
  ];

  const houses = [];

  for (let i = 0; i < Math.min(count, seattleAddresses.length); i++) {
    houses.push({
      address: seattleAddresses[i],
      county: 'King County',
      total_beds: faker.number.int({ min: 8, max: 12 }), // 8-12 beds per house
      notes: faker.helpers.maybe(() =>
        faker.helpers.arrayElement([
          'Recently renovated',
          'Wheelchair accessible',
          'Near public transportation',
          'Quiet residential area',
          null
        ]),
        { probability: 0.3 } // 30% chance of having notes
      )
    });
  }

  return houses;
}
