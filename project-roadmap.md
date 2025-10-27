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

---

# Detailed Phase Tracking & Sprint Planning

**Last Updated**: October 20, 2025
**Current Phase**: Post-Demo Refinement

## Phase 1: Requirements Gathering & Sunday Demo ✅ COMPLETE

### Objectives
- Validate product assumptions with housing manager
- Create clickable prototype to demonstrate future workflow
- Gather feedback to refine requirements before development

### Completed Tasks

#### Documentation ✅
- [x] Create user personas (Manager, Tenant, DOC Stakeholder)
- [x] Define themes and epics structure
- [x] Write PRODUCT_SPEC.md
- [x] Create phase tracking documentation
- [x] Create manager-friendly schema documentation

#### Data Analysis & Preparation ✅
- [x] Analyze Excel file structure (read-only, no sensitive data committed)
- [x] Document data patterns and field mappings
- [x] Generate fake/filler data matching real patterns (JSON format)
- [x] Create sample dataset for prototype (3-4 houses, 10-15 beds, 8-12 tenants)

#### Sunday Demo Prototype ✅
- [x] Design wireframes for key screens
- [x] Build clickable HTML prototype using Tailwind CSS
- [x] Populate prototype with fake data
- [x] Test mobile responsiveness for intake form
- [x] Prepare demo talking points and feedback questions

---

## Phase 2: Post-Demo Refinement (October 21-27, 2025) - IN PROGRESS

### Objectives
- Incorporate manager feedback into requirements
- Finalize MVP scope and priorities
- Break epics into detailed user stories
- Set up development environment and project board

### Tasks

#### Requirements Refinement
- [ ] Conduct feedback session with manager
- [ ] Answer open questions from PRODUCT_SPEC.md (see Section 10)
- [ ] Update PRODUCT_SPEC.md with feedback
- [ ] Finalize MVP Phase 1 scope
- [ ] Identify any scope creep or descoped items

#### Agile Backlog Creation
- [ ] Break MVP Phase 1 epics into detailed user stories
- [ ] Write acceptance criteria for each user story
- [ ] Estimate user stories (story points or t-shirt sizes)
- [ ] Prioritize backlog using MoSCoW method
- [ ] Define Definition of Done for user stories
- [ ] Plan first 2-3 sprints (2-week sprints recommended)

#### Project Setup
- [x] Set up GitLab repository for CI/CD and class requirements
- [x] Set up GitHub repository for portfolio visibility
- [ ] Set up GitLab Project board (Kanban or Scrum template)
- [ ] Create sprint milestones
- [ ] Add user stories as issues to GitLab
- [ ] Set up labels (Epic, Story, Task, Bug, etc.)
- [ ] Deploy to Vercel for continuous client feedback (see `docs/deployment/vercel-setup.md`)
  - [ ] Create Vercel account and link GitHub
  - [ ] Configure environment variables (Supabase, Google Sheets)
  - [ ] Enable preview deployments for all branches
  - [ ] Share production and preview URLs with client

#### Technical Planning
- [ ] Set up Supabase project and database
- [ ] Create database tables (houses, beds, tenants)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Plan API endpoint structure
- [ ] Choose frontend framework approach (Vite + React recommended)
- [ ] Set up CI/CD pipeline (GitLab CI)

#### Deliverables
- [ ] Refined PRODUCT_SPEC.md with manager feedback
- [ ] Prioritized backlog with 20-30 user stories
- [ ] Sprint 1 & 2 plans
- [ ] GitLab Project board configured
- [ ] Supabase database schema created
- [ ] Development environment setup guide

---

## Phase 3: Development Start - Sprint 1 (October 28 - November 10, 2025)

### Objectives
- Migrate Excel data to Supabase
- Set up backend API
- Begin frontend development
- Deploy MVP Phase 1 foundation

### Sprint 1 Focus: Milestone 1 + 2 (Data Migration & Backend Setup)

#### Data Migration (Epic 1.1, 1.2 - backend portion)
- [ ] Write ETL script (Python or Node.js)
- [ ] Extract data from Excel file
- [ ] Transform data (normalize, generate IDs, clean)
- [ ] Load data into Supabase tables (houses, beds, tenants)
- [ ] Validate data integrity and relationships
- [ ] Document migration process
- [ ] Create backup of original Excel data

#### Backend Setup
- [ ] Initialize Node.js/Express project
- [ ] Configure Supabase client connection
- [ ] Implement authentication middleware (Supabase Auth)
- [ ] Create REST API endpoints (see detailed list below)
- [ ] Implement request validation (Zod or Joi)
- [ ] Add error handling and logging
- [ ] Write API documentation (OpenAPI/Swagger)
- [ ] Write unit tests for API endpoints

**API Endpoints:**
- [ ] GET /api/houses (list all properties)
- [ ] GET /api/houses/:id (single property with beds)
- [ ] POST /api/houses (create property) - Manager only
- [ ] PUT /api/houses/:id (update property) - Manager only
- [ ] DELETE /api/houses/:id (delete property) - Manager only
- [ ] GET /api/beds (list all beds, filterable by status/house)
- [ ] POST /api/beds (create bed) - Manager only
- [ ] PUT /api/beds/:id (update bed status/assignment) - Manager only
- [ ] GET /api/tenants (list tenants, searchable)
- [ ] GET /api/tenants/:id (single tenant)
- [ ] POST /api/tenants (create tenant) - Manager only
- [ ] PUT /api/tenants/:id (update tenant) - Manager only
- [ ] POST /api/intake (tenant self-service form submission)

#### Frontend Setup (Partial - Sprint 1)
- [ ] Initialize React project (Vite + JavaScript - NO TypeScript)
- [ ] Set up routing (React Router)
- [ ] Configure Tailwind CSS
- [ ] Set up RTK Query for data fetching
- [ ] Implement authentication flow (login, logout, protected routes)
- [ ] Create layout components (header, sidebar, main)
- [ ] Build basic dashboard page (shell only, data integration in Sprint 2)

#### DevOps
- [ ] Deploy backend to hosting service (Render, Railway, or Vercel Functions)
- [ ] Deploy frontend to Vercel
- [ ] Set up environment variables
- [ ] Configure CORS for frontend-backend communication
- [ ] Set up monitoring and error tracking (Sentry optional)

#### Sprint 1 Deliverables
- [ ] Working API with all CRUD endpoints
- [ ] Excel data migrated to Supabase
- [ ] Authentication working (manager login)
- [ ] Basic frontend shell deployed
- [ ] API documentation
- [ ] Sprint 1 retrospective notes

---

## Sprint 2 Focus (November 11-24, 2025): Frontend CRUD & Dashboard

- [ ] Build property management UI (list, create, edit, delete)
- [ ] Build bed management UI
- [ ] Build tenant management UI
- [ ] Implement dashboard with metrics (occupancy, available beds)
- [ ] Add search and filter functionality
- [ ] Tenant detail pages
- [ ] Property detail pages

---

## Sprint 3 Focus (November 25 - December 8, 2025): Tenant Intake Form

- [ ] Design and build intake form UI
- [ ] Mobile responsiveness testing
- [ ] Form validation
- [ ] Manager review queue
- [ ] One-click approval flow
- [ ] Email notifications for new submissions

---

## MVP Phase 1 Completion Target: December 15, 2025

---

## Future Sprints (MVP Phase 2)

### Sprint 4-5: Payment Tracking & Alerts
- [ ] Add payment fields to tenant records
- [ ] Build payment tracking UI
- [ ] Implement voucher expiration alerts
- [ ] Implement new arrival notifications
- [ ] Available bed notifications

### Sprint 6: Reporting
- [ ] Build occupancy report generator
- [ ] Build tenant roster export
- [ ] CSV export functionality
- [ ] Google Sheets integration (stretch)

---

## Post-MVP Backlog

### Future Enhancements (Prioritize after MVP feedback)
- [ ] Epic 3.3: Rental History & Ledger (payment tracking infrastructure)
- [ ] Epic 3.4: Online Payment Integration (Square)
- [ ] Transaction tracking
- [ ] Advanced reporting and analytics
- [ ] DOC stakeholder portal
- [ ] AI-assisted document generation (grant proposals, audits)
- [ ] Multi-manager support
- [ ] Maintenance request tracking
- [ ] Document storage (leases, etc.)
- [ ] Mobile native apps

---

## Success Criteria for MVP Phase 1

- [ ] Manager can log in and perform all CRUD operations
- [ ] All Excel data successfully migrated to database
- [ ] Tenants can submit intake forms from mobile devices
- [ ] Manager sees dashboard with real-time occupancy metrics
- [ ] Manager can search/filter tenants and beds
- [ ] Zero data loss from migration
- [ ] 90%+ manager satisfaction with UX
- [ ] <2 second page load times
- [ ] Mobile intake form >90% completion rate

---

## Key Assumptions
- Manager has stable internet access
- Tenants have access to smartphones for intake forms
- DOC does not require integration with their systems (manual notification acceptable for MVP)

## Known Risks
- Manager communication challenges → Mitigation: Sunday demo for early feedback
- Data migration quality issues → Mitigation: Manual review and cleanup after ETL
- Tenant adoption of intake form → Mitigation: Provide manager fallback to enter data
- Scope creep → Mitigation: Strict MVP definition, parking lot for post-MVP features

## Dependencies
- Supabase availability and reliability
- Manager availability for feedback and testing
- Real data access for migration (post-demo)

---

## Tech Stack Resources
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
