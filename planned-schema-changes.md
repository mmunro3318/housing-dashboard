# Planned Schema Changes

This document tracks database schema modifications identified during development that should be implemented in future phases.

---

## Priority: High

### 1. County Restrictions for DOC Tenants

**Context:** DOC release restrictions are legal requirements. Tenants may be restricted to specific counties and cannot be housed elsewhere.

**Changes needed:**
```sql
ALTER TABLE tenants
ADD COLUMN release_county VARCHAR(64),
ADD COLUMN county_restricted BOOLEAN DEFAULT false;
```

**Impact:**
- Add validation when assigning DOC tenants to beds
- Show blocking alert if county mismatch
- Update tenant intake forms to capture this data
- Seed data: Only DOC tenants have restrictions

**Implementation notes:**
- Check `county_restricted = true` before assignment
- Compare `tenant.release_county` with `house.county`
- Prevent assignment if mismatch (not just warning)

---

## Priority: Medium

### 2. Form Submissions Review Tracking

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

### 3. Application Status Taxonomy Refinement

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

## Priority: Low (Tech Debt)

### 4. County Name Normalization

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

### 5. Bed Assignment Status Tracking

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
