# Planned Schema Changes

This document tracks database schema modifications identified during development that should be implemented in future phases.

---

## Priority: High

### 1. County Restrictions for DOC Tenants

**Context:** DOC release restrictions are legal requirements. Most felons have county restrictions while "on DOC" (community custody/probation/parole) and cannot be housed outside their assigned county without CCO (Community Corrections Officer) approval.

**Terminology Note:**
- WA State term: "Community Custody" (managed by CCO = Community Corrections Officer)
- Common informal terms: "probation", "parole", "on DOC" (used interchangeably)
- We use `on_doc` as the field name for clarity

**Real-world scenarios:**
1. **Standard case**: Tenant on DOC with county restriction (King County) - cannot be assigned to Pierce County house
2. **Override case**: Tenant gets CCO approval to move counties - Manager overrides restriction, updates `release_county`
3. **Off DOC**: Tenant completes probation - `on_doc = false`, `release_county = NULL` (no restrictions)
4. **Transfer case**: Tenant mid-custody can move if approved - restriction county changes

**Changes needed:**
```sql
ALTER TABLE tenants
ADD COLUMN on_doc BOOLEAN DEFAULT false,
ADD COLUMN release_county VARCHAR(64),
ADD COLUMN county_restriction_notes TEXT;
```

**Impact:**
- Add validation when assigning DOC tenants to beds
- Show **warning alert** if county mismatch (not blocking - allow override)
- Manager can override with confirmation: "County restriction override requires DOC/CCO approval. Confirm tenant has authorization to move to [New County]?"
- If Manager overrides → Update `release_county` to new county + log in `county_restriction_notes`
- Update tenant intake forms to capture DOC status and release county

**Implementation notes:**
- Check `on_doc = true` before assignment validation
- If `on_doc = true` AND `release_county != house.county`:
  - Show warning modal with override option
  - If override → Set `release_county = house.county` and append note: "Override approved [date] - Assigned to [county]"
- When tenant goes "off DOC" → Set `on_doc = false`, `release_county = NULL`
- Display county restrictions in tenant profile with clear visual indicator

**UI Workflow:**
```
Manager assigns DOC tenant (King County) to Pierce County house
  ↓
⚠️ Warning Modal:
  "County Restriction Mismatch
   Tenant: John Doe (King County restriction)
   Property: 123 Main St, Pierce County

   ⚠️ Override requires DOC/CCO approval

   [Cancel] [Override & Update County]"
  ↓
If Override → Update release_county, log change
```

---

### 2. Voucher Rate History & Program Management

**Context:** Need to track rate changes over time for financial reporting, audit compliance, and support 4 voucher programs (ERD, GRE, Section 8, TeleCare) with different rules and durations.

**Current State:**
- `system_settings` table stores current rates only:
  - `voucher_rate` → $700 (used for ERD currently)
  - `telecare_rate` → $750
  - `section8_rate` → $800
- No GRE rate (currently assumed same as ERD)
- No rate history (can't answer "What was the ERD rate on Jan 15, 2025?")
- No support for pending rate changes with future effective dates
- No duration tracking per program

**Requirements:**
1. **Rate changes affect ALL tenants** on that program (not just new ones)
2. **Financial reports** must show "voucher rate at time of payment"
3. **Pending rate changes** with future effective dates (e.g., "ERD rate becomes $700 on Feb 1st")
4. **Voucher durations** vary by program:
   - ERD: 6 months (currently, was 3 months years ago, may change)
   - GRE: 6 months
   - Section 8: **No expiration** (until Manager terminates tenant from program)
   - TeleCare: **No expiration** (until Manager terminates tenant from program)
5. **Audit trail**: Track when rates changed, why, and what the old rate was
6. **GRE rate separation**: GRE should have its own rate (currently shares ERD rate)

**Program-Specific Rules:**

| Program | Duration | Expiration Behavior | Rate Changes |
|---------|----------|---------------------|--------------|
| ERD | 6 months (configurable) | After `voucher_end`, tenant pays `bed.base_rent` | Affects all ERD tenants |
| GRE | 6 months (configurable) | After `voucher_end`, tenant pays `bed.base_rent` | Affects all GRE tenants |
| Section 8 | No expiration | Manager must manually terminate program | Affects all S8 tenants |
| TeleCare | No expiration | Manager must manually terminate program | Affects all TC tenants |

**Changes needed:**

**Option A: Simple Extension (Quick UI Implementation)**
```sql
-- Add GRE rate to system_settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
VALUES
  ('gre_rate', '700.00', 'number', 'GRE voucher monthly rate'),
  ('erd_duration_months', '6', 'number', 'ERD voucher duration in months'),
  ('gre_duration_months', '6', 'number', 'GRE voucher duration in months');

-- Rename voucher_rate to erd_rate for clarity
UPDATE system_settings SET setting_key = 'erd_rate' WHERE setting_key = 'voucher_rate';
```

**Pros:** Fast, works with existing Settings UI
**Cons:** No history, no pending changes, no audit trail

---

**Option B: Full Rate History System (Recommended for Production)**

```sql
-- Create voucher_programs table
CREATE TABLE voucher_programs (
    program_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_name VARCHAR(64) NOT NULL UNIQUE,
    program_code VARCHAR(16) NOT NULL UNIQUE,
    default_duration_months INT CHECK (default_duration_months > 0 OR default_duration_months IS NULL),
    has_expiration BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON COLUMN voucher_programs.default_duration_months IS 'Voucher duration in months (NULL = no expiration, e.g., Section 8, TeleCare)';
COMMENT ON COLUMN voucher_programs.has_expiration IS 'If false, voucher continues until Manager terminates';

-- Create voucher_rate_history table
CREATE TABLE voucher_rate_history (
    rate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES voucher_programs(program_id) ON DELETE CASCADE,

    monthly_rate NUMERIC(8,2) NOT NULL CHECK (monthly_rate >= 0),

    effective_date DATE NOT NULL,
    end_date DATE,

    status VARCHAR(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'superseded')),
    change_reason TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(program_id, effective_date)
);

COMMENT ON TABLE voucher_rate_history IS 'Historical and pending voucher rates for all programs';
COMMENT ON COLUMN voucher_rate_history.effective_date IS 'Date when this rate becomes/became active';
COMMENT ON COLUMN voucher_rate_history.end_date IS 'Date when this rate stopped being active (NULL = current or future)';
COMMENT ON COLUMN voucher_rate_history.status IS 'pending = future rate, active = current rate, superseded = historical rate';

-- Update tenants table to reference voucher programs
ALTER TABLE tenants
ADD COLUMN voucher_program_id UUID REFERENCES voucher_programs(program_id) ON DELETE SET NULL;

COMMENT ON COLUMN tenants.voucher_program_id IS 'FK to voucher_programs (NULL if payment_type is not voucher-based)';

-- Seed voucher programs
INSERT INTO voucher_programs (program_name, program_code, default_duration_months, has_expiration, description)
VALUES
    ('ERD (Estimated Release Date)', 'ERD', 6, TRUE, 'Washington State DOC voucher for inmates pending release'),
    ('GRE (Graduate Re-Entry)', 'GRE', 6, TRUE, 'GRE work release voucher program'),
    ('Section 8', 'S8', NULL, FALSE, 'Federal Section 8 Housing Choice Voucher (no expiration)'),
    ('TeleCare', 'TC', NULL, FALSE, 'TeleCare mental health housing subsidy (no expiration)');

-- Migrate existing rates from system_settings to rate_history
INSERT INTO voucher_rate_history (program_id, monthly_rate, effective_date, status, change_reason)
SELECT
    vp.program_id,
    CAST(ss.setting_value AS NUMERIC(8,2)),
    '2024-01-01', -- Historical effective date (adjust as needed)
    'active',
    'Migrated from system_settings table'
FROM voucher_programs vp
CROSS JOIN system_settings ss
WHERE (vp.program_code = 'ERD' AND ss.setting_key = 'voucher_rate')
   OR (vp.program_code = 'TC' AND ss.setting_key = 'telecare_rate')
   OR (vp.program_code = 'S8' AND ss.setting_key = 'section8_rate')
   OR (vp.program_code = 'GRE' AND ss.setting_key = 'voucher_rate'); -- GRE starts with same rate as ERD
```

**Pros:** Complete audit trail, pending changes, historical queries, compliance-ready
**Cons:** More complex schema, requires migration

---

**Recommended Approach: Two-Phase Implementation**

**Phase 1 (Immediate - UI Mockup):**
- Use Option A (simple extension) to build Settings UI quickly
- Show current rates, allow editing, store in `system_settings`
- Get Client feedback on UI/UX

**Phase 2 (Next Session - Production Schema):**
- Implement Option B (full rate history)
- Migrate existing `system_settings` data
- Update Settings UI to show rate history and pending changes
- Add financial reporting with historical rate queries

---

**Impact:**
- Settings page can display and edit rates for all 4 programs
- Manager can set pending rate changes (e.g., "ERD rate becomes $700 on Feb 1st")
- Financial reports show: "Tenant paid $600 in January (ERD rate was $600 at that time)"
- Audit trail for compliance and funding accountability
- Support for no-expiration programs (Section 8, TeleCare)

**Key Query Examples (Option B):**

```sql
-- Get current rate for ERD program
SELECT monthly_rate
FROM voucher_rate_history
WHERE program_id = (SELECT program_id FROM voucher_programs WHERE program_code = 'ERD')
  AND effective_date <= CURRENT_DATE
  AND (end_date IS NULL OR end_date > CURRENT_DATE)
ORDER BY effective_date DESC
LIMIT 1;

-- Get rate on specific date (e.g., Jan 15, 2025)
SELECT monthly_rate
FROM voucher_rate_history
WHERE program_id = 'erd-uuid'
  AND effective_date <= '2025-01-15'
  AND (end_date IS NULL OR end_date > '2025-01-15')
ORDER BY effective_date DESC
LIMIT 1;

-- Calculate tenant rent (handles expiration logic)
SELECT
    CASE
        WHEN t.voucher_program_id IS NULL THEN
            t.actual_rent -- Private pay
        WHEN vp.has_expiration = FALSE THEN
            vrh.monthly_rate -- Section 8 / TeleCare (no expiration)
        WHEN CURRENT_DATE > t.voucher_end THEN
            b.base_rent -- ERD/GRE expired
        ELSE
            vrh.monthly_rate -- Active voucher
    END AS rent_to_charge
FROM tenants t
LEFT JOIN voucher_programs vp ON t.voucher_program_id = vp.program_id
LEFT JOIN beds b ON t.bed_id = b.bed_id
LEFT JOIN voucher_rate_history vrh ON t.voucher_program_id = vrh.program_id
    AND vrh.effective_date <= CURRENT_DATE
    AND (vrh.end_date IS NULL OR vrh.end_date > CURRENT_DATE);
```

**Migration Strategy:**
1. Create new tables (`voucher_programs`, `voucher_rate_history`)
2. Seed programs with current rates
3. Add `voucher_program_id` to `tenants` table
4. Migrate existing tenants: Map `payment_type` strings → `voucher_program_id` FKs
5. Normalize `payment_type` to 'Voucher', 'Private Pay', etc.
6. Mark old `system_settings` rates as deprecated (keep for audit trail)

**Terminology Updates:**
- ERD = **Estimated Release Date** (NOT "Electronic Room and Board")
- GRE = **Graduate Re-Entry** (NOT "General Relief Employment")

---

## Priority: Medium

### 3. Form Submissions Review Tracking

**Context:** Manager needs to track which form submissions have been reviewed/processed vs pending action.

**Changes needed:**
```sql
ALTER TABLE form_submissions
ADD COLUMN reviewed BOOLEAN DEFAULT false,
ADD COLUMN reviewed_at TIMESTAMP,
ADD COLUMN reviewed_by VARCHAR(255);
```

**Impact:**
- Enable "Pending Form Submissions" dashboard widget
- Create action queue for manager
- Audit trail of who reviewed what and when

**Depends on:** Forms implementation (Phase 4 - Admin Portal)

---

### 4. Application Status Taxonomy Refinement

**Context:** Current `application_status` values don't distinguish between "Approved but not moved in" vs "Actively housed."

**Current values:**
- Waitlist
- Approved
- (implicit: Housed = has bed_id)

**Proposed values:**
- Waitlist - Application submitted, awaiting approval
- Approved - Approved but not yet moved in
- Pending - Bed assigned, awaiting move-in confirmation
- Housed - Actively living in property
- Exited - Former tenant (has exit_date)

**Changes needed:**
```sql
-- Update enum/constraint to include new statuses
ALTER TABLE tenants
ADD CONSTRAINT check_application_status
CHECK (application_status IN ('Waitlist', 'Approved', 'Pending', 'Housed', 'Exited'));

-- OR if using CHECK constraint already, modify it
```

**Impact:**
- More granular tracking of tenant lifecycle
- Better reporting on pipeline (Waitlist → Approved → Pending → Housed)
- Clearer distinction for bed assignment workflow

**Migration considerations:**
- Existing "Approved" tenants with `bed_id != null` → "Housed"
- Existing "Approved" tenants with `bed_id = null` → "Approved"

---

### 5. Address Field Breakup (Structured Address)

**Context:** Current `address` field stores full address as a single string (e.g., "123 Main St, Seattle WA 98101"). Breaking into structured fields enables better filtering, validation, and reporting.

**Changes needed:**
```sql
-- Replace single address field with structured fields
ALTER TABLE houses
DROP COLUMN address,
ADD COLUMN address_line1 VARCHAR(255) NOT NULL,
ADD COLUMN address_line2 VARCHAR(100),
ADD COLUMN city VARCHAR(100) NOT NULL,
ADD COLUMN state VARCHAR(2) NOT NULL DEFAULT 'WA',
ADD COLUMN zip VARCHAR(10) NOT NULL;

-- Optional: Add composite index for faster searching
CREATE INDEX idx_houses_location ON houses(city, state, zip);
```

**Benefits:**
- ✅ Better filtering/grouping by city or state
- ✅ Standardized data entry and validation
- ✅ Support for future features (geographic reports, maps)
- ✅ Easier address parsing and formatting
- ✅ State-level compliance reporting (if needed)

**Trade-offs:**
- ❌ Requires database migration and data transformation
- ❌ More complex forms (though could keep single-line entry with auto-parse)
- ❌ Need to parse existing addresses (regex or address parsing library)

**Migration strategy:**
1. Add new columns (nullable initially)
2. Parse existing addresses using regex or address library
3. Manually review/fix parsing errors
4. Make new columns NOT NULL
5. Drop old address column
6. Update all forms and display components

**Parser example:**
```javascript
// Simple regex parser (may need refinement)
const parseAddress = (fullAddress) => {
  const regex = /^(.+),\s*(.+?)\s+([A-Z]{2})\s+(\d{5}(-\d{4})?)$/;
  const match = fullAddress.match(regex);
  if (match) {
    return {
      address_line1: match[1].trim(),
      city: match[2].trim(),
      state: match[3],
      zip: match[4]
    };
  }
  return null; // Manual review needed
};
```

**UI Considerations:**
- Option A: Multiple separate input fields (more explicit)
- Option B: Single input with auto-complete (Google Places API?)
- Option C: Single input that parses on blur (user-friendly but error-prone)

**Recommendation:** Implement as Phase 2 enhancement. Current single-field approach works for MVP, but structured fields provide significant value for reporting and data quality.

---

## Priority: Low (Tech Debt)

### 6. County Name Normalization

**Context:** County field stores full name "King County" but should just store "King" for consistency and easier filtering.

**Changes needed:**
```sql
-- Option 1: Update existing data
UPDATE houses SET county = REPLACE(county, ' County', '') WHERE county LIKE '% County';
UPDATE tenants SET release_county = REPLACE(release_county, ' County', '') WHERE release_county LIKE '% County';

-- Option 2: Add validation constraint
ALTER TABLE houses ADD CONSTRAINT check_county_format CHECK (county NOT LIKE '% County');
```

**Impact:**
- Cleaner data
- Easier filtering/grouping
- Consistent display ("King" vs "King County")

**Migration notes:**
- Update seed data generators
- Update any forms that set county values
- Consider if "County" suffix should be added in display layer

---

### 7. Bed Assignment Status Tracking

**Context:** When a bed is assigned but tenant hasn't moved in yet, we need intermediate status.

**Current approach:**
- Bed status: Available, Occupied, Pending, Hold
- Tenant has `bed_id`

**Potential enhancement:**
```sql
ALTER TABLE beds
ADD COLUMN assigned_date TIMESTAMP,
ADD COLUMN expected_move_in DATE;
```

**Impact:**
- Track when bed was assigned vs when tenant actually moved in
- Better reporting on time-to-occupancy
- Distinguish "Pending arrival" from "Pending paperwork"

**Trade-offs:**
- Adds complexity
- May be redundant with `tenant.entry_date`
- Consider if this data belongs on tenants table instead

---

## Future Considerations

### Financial Tracking Enhancements

When implementing the Financial page (future milestone):

**Potential additions:**
```sql
-- Rent ledger table for transaction history
CREATE TABLE rent_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(tenant_id),
    transaction_date DATE NOT NULL,
    amount NUMERIC(8,2) NOT NULL,
    transaction_type VARCHAR(32) NOT NULL, -- 'Payment', 'Charge', 'Adjustment'
    payment_method VARCHAR(32), -- 'Cash', 'Check', 'Voucher', 'Transfer'
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Property value tracking
ALTER TABLE houses
ADD COLUMN property_value NUMERIC(10,2),
ADD COLUMN purchase_date DATE,
ADD COLUMN monthly_expenses NUMERIC(8,2);
```

**Benefits:**
- Detailed rent payment history
- Property-level financial analysis
- ROI calculations
- Income vs expenses tracking

---

## Review Schedule

- Review this document before implementing Phase 4 (Admin Portal & Forms)
- Revisit after Client feedback on Phase 1-3
- Update priorities based on actual usage patterns
