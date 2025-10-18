# MVP Project Roadmap

## Milestone 1: Data Preparation & Migration

- Analyze and clean Excel data
- Map fields to the three main tables: houses, beds, tenants
- Write ETL script for Excel → Database (Supabase/Postgres)
- Validate data import and relationships

## Milestone 2: Backend Setup

- Initialize Node/Express backend
- Implement Supabase/Postgres connection.
- Scaffold REST API endpoints for CRUD: houses, beds, tenants
- Implement basic authentication (manager vs guest)

## Milestone 3: Frontend MVP

- Create React app (RTK-Query/Redux optional for state management)
- Set up login and dashboard pages
- Display list of houses, beds, and tenants (view-only at first)
- Filter open beds, search tenants
- Deploy frontend to Vercel for testing

## Milestone 4: Admin Portal & Intake Form

- Add protected routes/pages for manager admin functions
- Set up resident intake form for new tenants (restricted access)
- Add ability for manager to add/remove/update beds and tenants

## Milestone 5: QA, Docs, and Roadmap

- Basic automated tests (backend + frontend)
- Write concise documentation (setup, API, migration scripts)
- Hold feedback session with manager and iterate on features

## Roadmap (Post-MVP, Paid Features)

- Add rent/ledger table for payment/transaction history
- Add program/resources table: Manage contacts/contracts/counselor data
- Implement more robust reporting, notifications, and multi-role auth
- Develop advanced exports, audit trails, waitlist logic, bed management automation

---

# Housing Dashboard ETL & SQL Schemas

## ETL Guidelines

**Extract:**

- Parse all Excel sheets, standardize to three primary entities: Tenants, Houses, Beds.
- Normalize field names (e.g. `house_id`, `tenant_id`, `bed_id`) and date formats.
- Map each resident to their current bed and house, extract relevant intake/rent/voucher info.

**Transform:**

- Standardize text (e.g. names, status enums).
- Convert address, house, and bed references to unique IDs.
- Split notes/comments into structured columns where feasible.

**Load:**

- Insert Tenants, Houses, Beds data into respective DB tables.
- Store unmapped fields (e.g. legacy comments) for future manual review or schema updates.

---

## SQL Schemas

### Table: houses

```sql
CREATE TABLE houses (
    house_id VARCHAR(64) PRIMARY KEY, -- Unique identifier (e.g. address or UUID)
    address VARCHAR(255) NOT NULL, -- Full street address
    total_beds INT NOT NULL, -- Total beds managed in house
    notes TEXT -- Optional freeform notes for managers
);
```

### Table: beds

```sql
CREATE TABLE beds (
    bed_id VARCHAR(64) PRIMARY KEY, -- Unique bed ID
    house_id VARCHAR(64) REFERENCES houses(house_id), -- Foreign key to houses
    room_number VARCHAR(32), -- Room or bed location
    status VARCHAR(16) CHECK (status IN ('Available','Occupied','Pending','Hold')), -- Bed status
    tenant_id VARCHAR(64) REFERENCES tenants(tenant_id), -- Current occupant, nullable if open
    notes TEXT -- Optional additional details
);
```

### Table: tenants

```sql
CREATE TABLE tenants (
    tenant_id VARCHAR(64) PRIMARY KEY, -- Unique per resident
    full_name VARCHAR(255) NOT NULL,
    dob DATE,
    phone VARCHAR(32),
    entry_date DATE,
    exit_date DATE,
    doc_number VARCHAR(64), -- DOC/agency reference
    payment_type VARCHAR(32), -- 'Private', 'Voucher', etc.
    voucher_start DATE,
    voucher_end DATE,
    rent_due NUMERIC(8,2),
    rent_paid NUMERIC(8,2),
    notes TEXT, -- Comments/notes for manager
    bed_id VARCHAR(64) REFERENCES beds(bed_id) -- Current bed assignment
);
```

---

## Notes & Roadmap

- Add rent/ledger table for payment history and tracking in future version.
- Add resources/contacts table for program leads, counselors, and contracts.
- Consider normalizing address fields (street/city/state/zip) for reporting.
