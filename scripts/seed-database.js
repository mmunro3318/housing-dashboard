/**
 * Database Seed Script
 * Populates Supabase database with realistic test data
 *
 * Usage: node scripts/seed-database.js
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Import generators
import { generateHouses } from './generators/houses.js';
import { generateBeds } from './generators/beds.js';
import { generateTenants } from './generators/tenants.js';
import { generateTenantProfiles } from './generators/tenant-profiles.js';
import { generateEmergencyContacts } from './generators/emergency-contacts.js';
import { generateFormSubmissions } from './generators/form-submissions.js';
import { generatePolicyAgreements } from './generators/policy-agreements.js';

// Initialize Supabase client with service_role key (bypasses RLS)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Main seed function
 */
async function seedDatabase() {
  console.log('\n🌱 Starting database seed...\n');

  try {
    // ==============================
    // 1. Fetch system settings
    // ==============================
    console.log('📋 Fetching system settings...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('*');

    if (settingsError) throw settingsError;

    const systemSettings = {};
    settingsData.forEach(setting => {
      systemSettings[setting.setting_key] = setting.setting_value;
    });

    console.log('✓ System settings loaded:', Object.keys(systemSettings).join(', '));

    // ==============================
    // 2. Insert houses
    // ==============================
    console.log('\n🏠 Generating houses...');
    const housesData = generateHouses(5);
    console.log(`Generated ${housesData.length} houses`);

    const { data: houses, error: housesError } = await supabase
      .from('houses')
      .insert(housesData)
      .select();

    if (housesError) throw housesError;
    console.log(`✓ Inserted ${houses.length} houses`);

    // ==============================
    // 3. Insert beds (tenant_id = NULL initially)
    // ==============================
    console.log('\n🛏️  Generating beds...');
    const bedsData = generateBeds(houses);
    console.log(`Generated ${bedsData.length} beds`);

    const { data: beds, error: bedsError } = await supabase
      .from('beds')
      .insert(bedsData)
      .select();

    if (bedsError) throw bedsError;
    console.log(`✓ Inserted ${beds.length} beds`);

    // ==============================
    // 4. Insert tenants (with bed_id set)
    // ==============================
    console.log('\n👤 Generating tenants...');
    const tenantsData = generateTenants(beds, systemSettings, 32);
    console.log(`Generated ${tenantsData.length} tenants`);

    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .insert(tenantsData)
      .select();

    if (tenantsError) throw tenantsError;
    console.log(`✓ Inserted ${tenants.length} tenants`);

    // ==============================
    // 5. Update beds.tenant_id (resolve circular FK)
    // ==============================
    console.log('\n🔗 Updating circular foreign keys (beds ↔ tenants)...');

    const occupiedTenants = tenants.filter(t => t.bed_id !== null);
    let updatedBeds = 0;

    for (const tenant of occupiedTenants) {
      const { error: updateError } = await supabase
        .from('beds')
        .update({ tenant_id: tenant.tenant_id })
        .eq('bed_id', tenant.bed_id);

      if (updateError) throw updateError;
      updatedBeds++;
    }

    console.log(`✓ Updated ${updatedBeds} occupied beds with tenant_id`);

    // ==============================
    // 6. Insert tenant profiles
    // ==============================
    console.log('\n📝 Generating tenant profiles...');
    const profilesData = generateTenantProfiles(tenants);
    console.log(`Generated ${profilesData.length} tenant profiles`);

    const { data: profiles, error: profilesError } = await supabase
      .from('tenant_profiles')
      .insert(profilesData)
      .select();

    if (profilesError) throw profilesError;
    console.log(`✓ Inserted ${profiles.length} tenant profiles`);

    // ==============================
    // 7. Insert emergency contacts
    // ==============================
    console.log('\n📞 Generating emergency contacts...');
    const contactsData = generateEmergencyContacts(tenants);
    console.log(`Generated ${contactsData.length} emergency contacts`);

    const { data: contacts, error: contactsError } = await supabase
      .from('emergency_contacts')
      .insert(contactsData)
      .select();

    if (contactsError) throw contactsError;
    console.log(`✓ Inserted ${contacts.length} emergency contacts`);

    // ==============================
    // 8. Insert form submissions
    // ==============================
    console.log('\n📄 Generating form submissions...');
    const submissionsData = generateFormSubmissions(tenants, profiles, contacts);
    console.log(`Generated ${submissionsData.length} form submissions`);

    const { data: submissions, error: submissionsError } = await supabase
      .from('form_submissions')
      .insert(submissionsData)
      .select();

    if (submissionsError) throw submissionsError;
    console.log(`✓ Inserted ${submissions.length} form submissions`);

    // ==============================
    // 9. Insert policy agreements
    // ==============================
    console.log('\n✅ Generating policy agreements...');
    const agreementsData = generatePolicyAgreements(submissions);
    console.log(`Generated ${agreementsData.length} policy agreements`);

    const { data: agreements, error: agreementsError } = await supabase
      .from('policy_agreements')
      .insert(agreementsData)
      .select();

    if (agreementsError) throw agreementsError;
    console.log(`✓ Inserted ${agreements.length} policy agreements`);

    // ==============================
    // Success summary
    // ==============================
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`
📊 Summary:
   • ${houses.length} houses
   • ${beds.length} beds (${updatedBeds} occupied)
   • ${tenants.length} tenants
   • ${profiles.length} tenant profiles
   • ${contacts.length} emergency contacts
   • ${submissions.length} form submissions
   • ${agreements.length} policy agreements
`);

  } catch (error) {
    console.error('\n❌ Seeding failed:');
    console.error(error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  }
}

// Run seed script
seedDatabase();
