# Database Schema Updates

**Date**: October 17, 2025 (Post-Prototype Feedback)
**Status**: To Be Implemented

---

## Summary of Changes

Based on user feedback, the following fields need to be added to support:
1. Multi-county operations
2. Dynamic tenant intake (DOC, TeleCare, Private)
3. Rent tracking (base vs actual)
4. ERD (Estimated Release Date) for pending inmates
5. Configurable voucher rates

---

## houses Table - ADD

```sql
county VARCHAR(64) NOT NULL DEFAULT 'King County'
```

**Purpose**: Support multi-county expansion and county-based filtering

**Example Values**: "King County", "Pierce County", "Snohomish County"

---

## beds Table - ADD

```sql
base_rent NUMERIC(8,2) NOT NULL DEFAULT 0.00
```

**Purpose**: Track what each bed is "worth" per month (standard rate)

**Notes**:
- This is the bed's value regardless of occupant
- Actual rent collected may differ (e.g., voucher at $700 for an $800 bed)
- Used for revenue potential calculations

---

## tenants Table - ADD

```sql
-- Tenant Type Classification
tenant_types TEXT[] DEFAULT ARRAY[]::TEXT[]
-- Possible values in array: 'DOC', 'TeleCare', 'Private'
-- Tenants can have multiple types (e.g., ['DOC', 'TeleCare'])

-- TeleCare Info
telecare_id VARCHAR(64) NULL

-- CCO Info
cco_name VARCHAR(255) NULL
cco_phone VARCHAR(32) NULL

-- ERD (Estimated Release Date) for pending inmates
is_erd BOOLEAN DEFAULT FALSE
erd_date DATE NULL

-- Gender (optional - for compliance)
gender VARCHAR(32) NULL
-- Values: 'Male', 'Female', 'Non-binary', 'Prefer not to say', NULL

-- Actual Rent (may differ from bed base_rent)
actual_rent NUMERIC(8,2) NULL
-- For vouchers: often $700 regardless of bed's base_rent
-- For private pay: usually equals bed's base_rent
```

**Purpose**:
- `tenant_types`: Support multi-program tenants (DOC + TeleCare, etc.)
- `telecare_id`: Track TeleCare program enrollment
- `cco_name/cco_phone`: Community Corrections Officer contact info
- `is_erd/erd_date`: Track inmates pending release
- `gender`: Enable house compliance rules (e.g., women-only houses)
- `actual_rent`: Track rent variance (actual vs potential)

**Notes on Payment Types**:
Update `payment_type` enum to include:
- "Private Pay"
- "Voucher"
- "TeleCare"
- "Section 8"
- "ERD"
- "Family Support"

---

## system_settings Table - NEW

**Purpose**: Store configurable system-wide settings

```sql
CREATE TABLE system_settings (
    setting_key VARCHAR(64) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(32) NOT NULL, -- 'number', 'string', 'boolean'
    description TEXT,
    last_updated TIMESTAMP DEFAULT NOW(),
    updated_by VARCHAR(255)
);

-- Initial data
INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
VALUES
    ('voucher_rate', '700.00', 'number', 'Standard monthly voucher payment amount'),
    ('telecare_rate', '750.00', 'number', 'Standard TeleCare monthly payment'),
    ('section8_rate', '800.00', 'number', 'Standard Section 8 voucher rate');
```

**Purpose**:
- Store configurable rates that manager can update via dashboard
- Avoid hard-coding payment rates in application code
- Track when rates change and who changed them

---

## Updated Schema Diagrams

### houses
```
house_id (PK)
address
county          ← NEW
total_beds
notes
```

### beds
```
bed_id (PK)
house_id (FK)
room_number
base_rent       ← NEW
status
tenant_id (FK)
notes
```

### tenants
```
tenant_id (PK)
full_name
dob
phone
gender          ← NEW

tenant_types    ← NEW (array)
telecare_id     ← NEW

entry_date
exit_date
is_erd          ← NEW
erd_date        ← NEW

doc_number
cco_name        ← NEW
cco_phone       ← NEW

payment_type
actual_rent     ← NEW (may differ from bed base_rent)
voucher_start
voucher_end
rent_due
rent_paid

notes
bed_id (FK)
```

---

## Migration Strategy

### Phase 1: Add Columns (Non-Breaking)
```sql
-- Add new columns with NULLable/DEFAULT values
ALTER TABLE houses ADD COLUMN county VARCHAR(64) DEFAULT 'King County';
ALTER TABLE beds ADD COLUMN base_rent NUMERIC(8,2) DEFAULT 0.00;

ALTER TABLE tenants ADD COLUMN tenant_types TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE tenants ADD COLUMN telecare_id VARCHAR(64);
ALTER TABLE tenants ADD COLUMN cco_name VARCHAR(255);
ALTER TABLE tenants ADD COLUMN cco_phone VARCHAR(32);
ALTER TABLE tenants ADD COLUMN is_erd BOOLEAN DEFAULT FALSE;
ALTER TABLE tenants ADD COLUMN erd_date DATE;
ALTER TABLE tenants ADD COLUMN gender VARCHAR(32);
ALTER TABLE tenants ADD COLUMN actual_rent NUMERIC(8,2);
```

### Phase 2: Backfill Data
```sql
-- Set default county for existing properties
UPDATE houses SET county = 'King County' WHERE county IS NULL;

-- Set base_rent equal to current rent_due for existing beds
-- (can be manually adjusted later by manager)
UPDATE beds b
SET base_rent = COALESCE(
    (SELECT t.rent_due FROM tenants t WHERE t.bed_id = b.bed_id LIMIT 1),
    700.00
);

-- Set actual_rent for existing tenants
UPDATE tenants
SET actual_rent = rent_due
WHERE actual_rent IS NULL;

-- Classify existing tenants based on doc_number
UPDATE tenants
SET tenant_types = ARRAY['DOC']
WHERE doc_number IS NOT NULL AND doc_number != '';

UPDATE tenants
SET tenant_types = ARRAY['Private']
WHERE doc_number IS NULL OR doc_number = '';
```

### Phase 3: Add Constraints (Optional)
```sql
-- Make county NOT NULL after backfill
ALTER TABLE houses ALTER COLUMN county SET NOT NULL;

-- Make base_rent NOT NULL after backfill
ALTER TABLE beds ALTER COLUMN base_rent SET NOT NULL;
```

---

## Application Logic Changes

### Rent Calculation
```javascript
// Display rent variance
if (tenant.actual_rent < bed.base_rent) {
    // Show blue box (actual) vs gray box (potential)
    const variance = bed.base_rent - tenant.actual_rent;
    // Lost revenue = $variance per month
}
```

### Voucher Rate Lookup
```javascript
// Get current voucher rate from system_settings
const voucherRate = await getSystemSetting('voucher_rate'); // Returns 700.00

// When tenant selects "Voucher" payment type:
tenant.actual_rent = voucherRate; // Auto-set to current rate
```

### County Filtering
```sql
-- Filter properties by county
SELECT * FROM houses WHERE county = 'King County';

-- Get metrics by county
SELECT
    county,
    COUNT(*) as total_properties,
    SUM(total_beds) as total_beds
FROM houses
GROUP BY county;
```

### Tenant Type Queries
```sql
-- Find all DOC tenants
SELECT * FROM tenants WHERE 'DOC' = ANY(tenant_types);

-- Find tenants with multiple programs
SELECT * FROM tenants WHERE array_length(tenant_types, 1) > 1;

-- Find ERD (pending releases)
SELECT * FROM tenants WHERE is_erd = TRUE AND erd_date IS NOT NULL;
```

---

## UI Changes Required

### Properties Page
- Add county column to table
- Add county filter dropdown

### Beds Display
- Show base_rent on bed cards
- Show rent variance indicator when occupied

### Tenant Intake Form
- Add checkboxes for tenant type (DOC, TeleCare, Private)
- Conditional fields:
  - If DOC → show DOC#, CCO fields
  - If TeleCare → show TeleCare ID
  - If ERD → show release date
- Update payment type dropdown with all options

### Dashboard
- Show revenue metrics (potential vs actual)
- Month-based voucher expiration display ("1 month", "Nov 2025")
- County filter

### Settings Page (New)
- Allow manager to update voucher rates
- Show current rates
- Track change history

---

## Testing Checklist

- [ ] Multi-county filtering works correctly
- [ ] Rent variance displays properly (blue vs gray boxes)
- [ ] Voucher rate updates apply to new tenants
- [ ] Tenant type checkboxes support multiple selections
- [ ] Conditional fields show/hide correctly on intake form
- [ ] ERD tenants show on pending releases report
- [ ] CCO search/filter works
- [ ] Revenue calculations accurate (max vs current)
- [ ] Gender field is optional and handles NULL gracefully
- [ ] Migration scripts run without errors on test data

---

## Rollback Plan

If issues arise, columns can be safely removed:

```sql
ALTER TABLE houses DROP COLUMN county;
ALTER TABLE beds DROP COLUMN base_rent;
ALTER TABLE tenants DROP COLUMN tenant_types;
ALTER TABLE tenants DROP COLUMN telecare_id;
-- etc.
```

**Note**: Back up database before migration!

---

## Next Steps

1. Review this schema with client on Sunday
2. Get approval for new fields
3. Implement in Sprint 1 (backend + database)
4. Update frontend in Sprint 2
5. Test with fake data before real data migration
