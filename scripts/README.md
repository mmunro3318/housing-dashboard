# Database Seed Scripts

This directory contains scripts for populating the Supabase database with realistic test data.

## Overview

The seed script generates test data for all 8 database tables:
- **houses** (5 Seattle properties)
- **beds** (40-45 beds across houses)
- **tenants** (32 tenants with various statuses)
- **tenant_profiles** (extended info: recovery, legal, employment)
- **emergency_contacts** (1-3 contacts per tenant)
- **form_submissions** (Application + Intake forms)
- **policy_agreements** (10 policy signatures per Intake form)
- **system_settings** (already seeded in migration, not modified)

## Prerequisites

1. **Supabase project created** with tables from `docs/schemas/supabase-migration.sql`
2. **Environment variables set** in `.env` file:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. **Dependencies installed**:
   ```bash
   npm install
   ```

## Usage

### Seed the Database

Run the seed script from the project root:

```bash
node scripts/seed-database.js
```

### Expected Output

```
🌱 Starting database seed...

📋 Fetching system settings...
✓ System settings loaded: voucher_rate, telecare_rate, section8_rate

🏠 Generating houses...
Generated 5 houses
✓ Inserted 5 houses

🛏️  Generating beds...
Generated 42 beds
✓ Inserted 42 beds

👤 Generating tenants...
Generated 32 tenants
✓ Inserted 32 tenants

🔗 Updating circular foreign keys (beds ↔ tenants)...
✓ Updated 27 occupied beds with tenant_id

📝 Generating tenant profiles...
Generated 32 tenant profiles
✓ Inserted 32 tenant profiles

📞 Generating emergency contacts...
Generated 58 emergency contacts
✓ Inserted 58 emergency contacts

📄 Generating form submissions...
Generated 38 form submissions
✓ Inserted 38 form submissions

✅ Generating policy agreements...
Generated 150 policy agreements
✓ Inserted 150 policy agreements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Database seeded successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   • 5 houses
   • 42 beds (27 occupied)
   • 32 tenants
   • 32 tenant profiles
   • 58 emergency contacts
   • 38 form submissions
   • 150 policy agreements
```

## Reset Database

To wipe all data and re-seed:

1. **Run in Supabase SQL Editor**:
   ```sql
   TRUNCATE houses, beds, tenants, tenant_profiles, emergency_contacts,
            form_submissions, policy_agreements RESTART IDENTITY CASCADE;
   ```

2. **Re-run seed script**:
   ```bash
   node scripts/seed-database.js
   ```

**Note:** `system_settings` is NOT truncated (preserves voucher rates).

## Test Data Scenarios

The seed script generates realistic test scenarios:

### Bed Statuses
- **65% Occupied** - Bed has a tenant assigned
- **30% Available** - Bed is open for new tenant
- **4% Pending** - Bed has tentative assignment (future move-in)
- **1% Hold** - Bed is temporarily unavailable

### Tenant Statuses
- **~60% Occupied** - Currently living in a bed
- **~5% Pending** - Approved but not yet moved in
- **~20% Exited** - Previously occupied, now exited (no bed, exit_date set)
- **~15% Waitlist** - Application submitted, awaiting approval (no bed)

### Payment Types
- **40% Voucher** - Government voucher (e.g., Section 8, TeleCare)
- **30% ERD** - Estimated Release Date program (DOC inmates, $0 rent)
- **20% Private Pay** - Self-paying ($650-750/month)
- **10% Family Support** - Family pays rent (~$700/month)

### Recovery & Legal
- **65% In Recovery** - Has recovery program info (drug of choice, sober date)
- **30% On Probation** - Has probation officer info
- **40% On Parole** - Has parole officer info
- **5% Sex Offender** - Registered sex offender status
- **15% Veteran** - Military veteran status

### Forms
- **Application** - Generated for ALL tenants (100%)
- **Intake** - Generated for occupied tenants only (~60%)
- **Policy Agreements** - 10 signatures for each Intake form

## File Structure

```
scripts/
├── seed-database.js              # Main orchestrator
├── generators/
│   ├── houses.js                 # 5 Seattle houses
│   ├── beds.js                   # Beds for each house
│   ├── tenants.js                # Tenants with payment types
│   ├── tenant-profiles.js        # Extended profiles
│   ├── emergency-contacts.js     # 1-3 contacts per tenant
│   ├── form-submissions.js       # Application/Intake forms (JSONB)
│   └── policy-agreements.js      # 10 policies per Intake
└── README.md                     # This file
```

## Circular Foreign Key Handling

The `beds` and `tenants` tables have a circular relationship:
- `beds.tenant_id` references `tenants.tenant_id`
- `tenants.bed_id` references `beds.bed_id`

**Solution**:
1. Insert beds with `tenant_id = NULL`
2. Insert tenants with `bed_id` set
3. UPDATE beds to set `tenant_id` for occupied beds

## Troubleshooting

### Error: "Missing environment variables"
- Ensure `.env` file exists in project root
- Verify `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Check for typos in variable names

### Error: "relation does not exist"
- Run migration script first: `docs/schemas/supabase-migration.sql`
- Ensure all 8 tables are created in Supabase

### Error: "violates foreign key constraint"
- Check insertion order (houses → beds → tenants → profiles → contacts → forms → policies)
- Verify circular FK update logic is working

### Error: "violates unique constraint"
- Ensure `houses.address` values are unique
- Ensure `beds(house_id, room_number)` combinations are unique
- Reset database and re-seed if data is corrupted

## Notes

- **Service Role Key Required**: The seed script uses the service role key to bypass Row Level Security (RLS) policies. Never expose this key in client-side code.
- **Deterministic UUIDs**: UUIDs are randomly generated, so data will be different each run.
- **Realistic Data**: Uses `@faker-js/faker` for realistic names, addresses, dates, etc.
- **Test Data Only**: This data is for development/testing purposes only. Do NOT use in production.

## Next Steps

After seeding:
1. Verify data in Supabase dashboard (Table Editor)
2. Test frontend connection (`npm run dev`)
3. Build frontend components to display seeded data
