# Product Specification Document

## Halfway Housing Dashboard

**Last Updated**: October 17, 2025
**Project Lead**: Michael Munro
**Status**: Requirements Gathering / Pre-Development

---

## 1. Executive Summary

The Halfway Housing Dashboard replaces chaotic Excel-based workflows with a unified, secure web application. The system enables housing managers to track properties, beds, and tenants while reducing manual data entry through self-service intake forms and automated reporting.

**Target Launch**: MVP by Q1 2026

---

## 2. User Personas

### Primary Persona: Property Manager Patricia

**Background**:

- Manages a network of halfway houses with diverse programs
- Low technical proficiency (struggles with Excel formulas)
- Currently tracks everything in multi-tabbed Excel files

**Current Pain Points**:

- **Surprise arrivals**: No warning when DOC releases tenants to properties
- **Data chaos**: Misuses Excel fields for comments, leading to inconsistent data
- **Manual reporting**: Spends hours searching Excel to write reports
- **Physical intake**: Must visit each property to collect tenant information
- **No visibility**: Can't easily see available beds or upcoming voucher expirations
- **Difficult rental history**: Hard to track payment history across tenants

**Goals**:

- View all properties and tenants at a glance
- Generate reports with one click
- Let tenants fill out their own intake forms
- Get automatic alerts for new arrivals and voucher expirations
- Eventually: Use AI to draft grant proposals and audit documents from data

**Success Metrics**:

- Reduce report generation time from hours to minutes
- Zero surprise tenant arrivals
- 80%+ of intakes completed by tenants (not manager)

---

### Secondary Persona: Released Resident Randy

**Background**:

- Recently released from DOC facility
- Variable tech skills (assume mobile-first smartphone user)
- Assigned to halfway house as transition housing

**Current Pain Points**:

- Manager has to track them down for intake paperwork
- No self-service option to provide information
- Delays in getting settled

**Goals**:

- Submit intake information quickly and easily
- Complete forms from mobile device
- Avoid delays in move-in process

**Success Metrics**:

- Complete intake in under 10 minutes
- 90%+ successful mobile form submissions

---

### Stretch Persona: Department Officer Dana (DOC Stakeholder)

**Background**:

- Works for Washington Department of Corrections
- Medium technical proficiency (government systems user)
- Needs to place released individuals in halfway houses

**Current Pain Points**:

- No visibility into available beds across properties
- Reactive placement (waits for manager to notify)

**Goals**:

- View real-time bed availability
- Receive monthly reports on capacity
- Plan placements proactively

**Success Metrics**:

- Access bed availability data within 1 business day
- Reduce placement coordination time by 50%

---

## 3. Problem Statement

Managing a network of halfway houses creates complex data challenges:

- **Current state**: Multi-tabbed Excel files with inconsistent formats, manual entry, limited reporting
- **Impact**: Slows intake, reduces visibility into occupancy, increases errors, prevents data-driven decisions
- **Root cause**: No centralized system designed for halfway housing management workflows

---

## 4. Product Themes & Epics

### Theme 1: Core Data Management

_Foundation for tracking properties, beds, and tenants_

#### Epic 1.1: Property & Bed Management

**Description**: Enable managers to track houses and individual bed availability

**User Stories**:

- As a manager, I want to add new properties so I can expand my tracking as I acquire houses
- As a manager, I want to view all properties at a glance so I can see my entire portfolio
- As a manager, I want to update bed counts and room numbers so the system reflects reality
- As a manager, I want to mark beds as Available/Occupied/Pending/Hold so I can manage assignments
- As a manager, I want to add notes to properties and beds so I can track maintenance or special conditions

**Acceptance Criteria**:

- CRUD operations for houses (create, read, update, delete)
- CRUD operations for beds
- Bed status tracking with 4 states
- Each bed linked to a specific house

---

#### Epic 1.2: Tenant Management

**Description**: Enable managers to track current and past residents

**User Stories**:

- As a manager, I want to add new tenants so I can track who's living in my properties
- As a manager, I want to assign tenants to specific beds so I know occupancy
- As a manager, I want to track entry and exit dates so I know tenure
- As a manager, I want to record DOC numbers so I can reference agency records
- As a manager, I want to update tenant information so data stays current
- As a manager, I want to archive past tenants so I maintain historical records

**Acceptance Criteria**:

- CRUD operations for tenants
- Tenant-to-bed assignment with validation (no double-booking)
- Entry/exit date tracking
- Tenant status (Current, Exited, Pending)
- Historical tenant data preserved

---

#### Epic 1.3: Tenant Operations (MVP Phase 2)

**Description**: Enable managers to relocate and manage tenant assignments efficiently

**User Stories**:

- As a manager, I want to move a tenant to a different bed in the same property so I can manage room changes
- As a manager, I want to transfer a tenant to a different property so I can accommodate special circumstances
- As a manager, I want to see a tenant's relocation history so I can track moves
- As a manager, I want to reassign beds without losing tenant data so moves are seamless

**Acceptance Criteria**:

- Tenant relocation UI (select new bed/property)
- Validation to prevent double-booking
- Automatic bed status updates (old bed → Available, new bed → Occupied)
- Relocation history tracking (audit log)

---

### Theme 2: Self-Service & Automation

_Reduce manual work for the manager_

#### Epic 2.1: Tenant Intake Form with Dynamic Fields

**Description**: Allow new tenants to submit their own information via web form with conditional fields based on tenant type

**User Stories**:

- As a new tenant, I want to fill out my intake form online so I don't delay move-in
- As a new tenant, I want to use my phone to submit information so I don't need a computer
- As a new tenant, I want to see only relevant fields for my situation so I'm not confused by irrelevant questions
- As a manager, I want to review submitted intake forms so I can approve new tenants
- As a manager, I want intake forms to auto-populate tenant records so I avoid re-entering data
- As a manager, I want to track different tenant types (DOC, TeleCare, Private) so I know program affiliations

**Acceptance Criteria**:

- Mobile-responsive intake form
- Conditional field sections:
  - Tenant type selection (checkboxes: DOC, TeleCare, Private Citizen - can be multiple)
  - If DOC selected → Show DOC#, CCO name/phone, voucher checkbox
  - If TeleCare selected → Show TeleCare ID/program info
  - If ERD (pending release) → Show estimated release date field
- Payment type dropdown (Voucher, TeleCare, Section 8, Private Pay, ERD, Family Support)
- Required field validation
- Submission confirmation
- Manager review queue
- One-click approval to create tenant record

---

#### Epic 2.2: Alerts & Notifications

**Description**: Automatically notify manager of important events

**User Stories**:

- As a manager, I want to be notified when a new tenant submits an intake form so I can respond quickly
- As a manager, I want alerts when vouchers are expiring soon so I can follow up with tenants
- As a manager, I want to know when beds become available so I can fill vacancies
- As a manager, I want to be warned about upcoming move-in dates so I can prepare properties

**Acceptance Criteria**:

- Email notifications for new intake submissions
- Voucher expiration warnings (display as months: "1 month", "2 months", "Expired", "Nov 2025")
- Bed availability notifications
- Upcoming arrival notifications (7 days prior)
- ERD (release date) reminders for pending inmates

---

### Theme 3: Financial Tracking

_Track payments, vouchers, and rental history_

#### Epic 3.1: Payment & Voucher Management (Moved to MVP Phase 1)

**Description**: Track rent payments, voucher details, and property revenue for each tenant and bed

**User Stories**:

- As a manager, I want to set a base rent for each bed so I know its revenue value
- As a manager, I want to record actual rent collected per tenant so I can track payment variance
- As a manager, I want to see when actual rent differs from base rent (e.g., voucher at $700 vs $800 bed) so I understand revenue loss
- As a manager, I want to track payment types (Private Pay, Voucher, TeleCare, Section 8, ERD, Family Support) so I know funding sources
- As a manager, I want to record voucher start/end dates so I know coverage periods
- As a manager, I want to see overdue payments so I can follow up
- As a manager, I want to mark tenants as "paid" each month so I can track late/delinquent payments
- As a manager, I want to configure voucher rates (currently $700/month) so I can update when rates change

**Acceptance Criteria**:

- `base_rent` field on beds table (what bed is "worth")
- `actual_rent` field on tenant records (what's actually collected)
- Payment type dropdown (Private Pay, Voucher, TeleCare, Section 8, ERD, Family Support)
- Voucher date tracking
- Visual indicator for overdue payments (rent due > rent paid)
- Visual indicator for rent variance (blue box = actual rent, gray box = base rent)
- System-wide voucher rate setting (configurable by manager)

---

#### Epic 3.2: Property Financial Dashboard (MVP Phase 2)

**Description**: Visualize property revenue potential vs actual collection

**User Stories**:

- As a manager, I want to see each property's maximum monthly revenue (if fully occupied) so I know potential income
- As a manager, I want to see each property's current monthly revenue (actual occupancy) so I know real income
- As a manager, I want to see vacancy cost per property so I understand lost revenue
- As a manager, I want to filter by county to see revenue by region

**Acceptance Criteria**:

- Property cards show max revenue vs current revenue
- Vacancy cost calculation (empty beds × base rent)
- Visual indicator for revenue variance (blue = collecting, gray = potential)
- County-based filtering

---

#### Epic 3.3: Rental History & Ledger (Post-MVP)

**Description**: Maintain detailed transaction history for auditing and reporting

**User Stories**:

- As a manager, I want to view a tenant's complete payment history so I can verify records
- As a manager, I want to export payment histories so I can provide them to auditors
- As a manager, I want to track partial payments so I have accurate ledgers
- As a manager, I want to view a property's entire rental history for financial records and auditing

**Acceptance Criteria**:

- Transaction ledger table (separate from tenants)
- Payment history view per tenant
- Export to CSV
- Running balance calculations

---

### Theme 4: Reporting & Insights

_Generate reports and enable data-driven decisions_

#### Epic 4.1: Dashboard & Visualization

**Description**: Provide manager with real-time overview of operations

**User Stories**:

- As a manager, I want to see total bed count and occupancy rate so I understand capacity
- As a manager, I want to filter available beds by property so I can direct new tenants
- As a manager, I want to filter properties and tenants by county so I can focus on specific regions
- As a manager, I want to search tenants by name or DOC number so I can find records quickly
- As a manager, I want to see upcoming voucher expirations so I can prioritize follow-ups
- As a manager, I want to search tenants by CCO so I can batch housing updates in any communications

**Acceptance Criteria**:

- Dashboard with key metrics (total beds, occupied, available, occupancy %)
- Property list with bed counts
- County filter dropdown (King County, Pierce County, etc.)
- Tenant search with filters
- Sortable/filterable data tables

---

#### Epic 4.2: Report Generation

**Description**: Generate formatted reports with one click

**User Stories**:

- As a manager, I want to export occupancy reports so I can share with stakeholders
- As a manager, I want to export tenant lists so I can provide them to auditors
- As a manager, I want to export payment summaries so I can reconcile finances
- As a manager, I want to export to CSV and Google Sheets so I can work with familiar tools

**Acceptance Criteria**:

- One-click occupancy report (PDF/CSV)
- Tenant roster export (current and historical)
- Payment summary reports by date range
- Google Sheets integration (stretch)

---

#### Epic 4.3: AI-Assisted Document Generation (Stretch Goal)

**Description**: Use LLM to draft grant proposals and audit documents from data

**User Stories**:

- As a manager, I want to generate grant proposal drafts so I can secure funding faster
- As a manager, I want to auto-populate non-profit audit reports so I save time on compliance
- As a manager, I want to review and edit AI-generated documents so I maintain control

**Acceptance Criteria**:

- LLM integration (OpenAI/Anthropic API)
- Template library for common documents
- Data-to-document mapping
- Manager review/edit workflow

---

### Theme 6: Advanced Operations (Post-MVP)

_Complex operational features for edge cases_

#### Epic 6.1: Advanced Bed Management ("Batter's Box")

**Description**: Handle complex bed reservation scenarios where current occupant will vacate before new tenant arrives

**User Stories**:

- As a manager, I want to reserve a bed for a future tenant while it's still occupied so I can plan ahead
- As a manager, I want to see bed timeline (current occupant exit date, next occupant entry date) so I understand transitions
- As a manager, I want to be alerted if timeline conflicts arise (overlap) so I can resolve issues

**Acceptance Criteria**:

- Bed reservation system (future occupancy tracking)
- Timeline view showing current + next tenant
- Validation to prevent overlapping occupancy
- Alert if current tenant's exit date is after next tenant's entry date

---

#### Epic 6.2: Compliance & House Rules

**Description**: Enforce property-specific rules and constraints (e.g., gender-based housing)

**User Stories**:

- As a manager, I want to mark houses as "Women Only" so I can enforce gender restrictions
- As a manager, I want to receive warnings (not hard blocks) when assigning tenants to restricted houses so I maintain flexibility
- As a manager, I want to track house-specific rules so I can document compliance requirements

**Acceptance Criteria**:

- Optional gender field on tenant records
- House rules configuration (gender restrictions, program requirements, etc.)
- Warning system for rule violations (not blocking - manager can override)
- Sensitive handling of transgender/non-binary tenants

---

### Theme 7: Access Control & Security

_Ensure proper authentication and data protection_

#### Epic 5.1: Authentication & Authorization

**Description**: Secure login with role-based access control

**User Stories**:

- As a manager, I want to log in securely so only I can access tenant data
- As a manager, I want to create limited-access accounts for tenants so they can only submit intake forms
- As a DOC stakeholder, I want to register with my .gov email so I can access bed availability (stretch)

**Acceptance Criteria**:

- Supabase Auth integration
- Three roles: Manager (full access), Tenant (intake form only), DOC Stakeholder (read-only bed availability)
- Password reset flow
- Session management

---

## 5. Priority Mapping

### MVP Phase 1 (Priorities 1 & 2)

**Target**: 4-6 week development sprint

- Epic 1.1: Property & Bed Management (with county field) ⭐
- Epic 1.2: Tenant Management ⭐
- Epic 2.1: Tenant Intake Form with Dynamic Fields ⭐
- Epic 3.1: Payment & Voucher Management (rent tracking) ⭐
- Epic 4.1: Dashboard & Visualization (basic + county filter) ⭐
- Epic 5.1: Authentication & Authorization (basic) ⭐

**Success Criteria**:

- Manager can perform all CRUD operations
- Tenants can submit dynamic intake forms (DOC, TeleCare, Private options)
- Manager sees dashboard with key metrics and county filtering
- Rent tracking shows base vs actual per bed/tenant

---

### MVP Phase 2 (Priorities 3 & 4)

**Target**: 2-4 weeks post-MVP Phase 1

- Epic 1.3: Tenant Operations (relocation/transfer) ⭐
- Epic 2.2: Alerts & Notifications (month-based voucher display) ⭐
- Epic 3.2: Property Financial Dashboard (revenue tracking) ⭐
- Epic 4.2: Report Generation ⭐

**Success Criteria**:

- Manager can relocate tenants between beds/properties
- Automated alerts for expirations and arrivals (displayed as months)
- Property financial performance visible (max vs current revenue)
- One-click reports

---

### Post-MVP (Future Enhancements)

**Target**: TBD based on feedback and funding

- Epic 3.3: Rental History & Ledger
- Epic 4.3: AI-Assisted Document Generation
- Epic 6.1: Advanced Bed Management ("Batter's Box")
- Epic 6.2: Compliance & House Rules (gender restrictions)
- DOC Stakeholder portal (Epic 5.1 expansion)
- Advanced reporting and analytics

---

## 6. Data Schema (User-Friendly Version)

### Information We'll Track About Your Properties

- **Property Address**: Full street address of the house
- **County**: Which county the property is in (King, Pierce, etc.)
- **Total Beds**: How many beds are managed at this property
- **Manager Notes**: Any comments or special information about the property

### Information We'll Track About Each Bed

- **Bed/Room Number**: How you identify each bed (e.g., "Room 1A", "Bed 3")
- **Base Rent**: What this bed is "worth" per month (standard rate)
- **Current Status**: Available, Occupied, Pending, or On Hold
- **Current Tenant**: Who's currently assigned (if occupied)
- **Bed Notes**: Any comments about this specific bed

### Information We'll Track About Your Tenants

**Personal Information**:

- Full Name
- Date of Birth
- Phone Number
- Gender (optional - for house compliance)

**Tenant Type** (can be multiple):

- DOC (Department of Corrections)
- TeleCare Program
- Private Citizen

**Housing Information**:

- Move-in Date
- Move-out Date (when they leave)
- Which Bed They're Assigned To
- Is ERD (pending release from prison)
- Estimated Release Date (if ERD)

**Agency Information**:

- DOC Number (if applicable)
- TeleCare ID (if applicable)
- Assigned CCO (Community Corrections Officer) - Name and Number

**Payment Information**:

- Payment Type (Private Pay, Voucher, TeleCare, Section 8, ERD, Family Support)
- Actual Rent Collected (may differ from bed's base rent for vouchers)
- Voucher Start Date
- Voucher End Date
- Monthly Rent Due
- Total Rent Paid
- Outstanding Balance

**Manager Notes**:

- Any comments or special information about the tenant

---

## 7. Technical Constraints & Considerations

- **Mobile-First**: Intake form must work on smartphones (primary use case for tenants)
- **Data Privacy**: Tenant data is sensitive (PII, DOC records) - requires secure authentication
- **No Sensitive Data in Repo**: Use fake/anonymized data for development and demos
- **Low-Tech User**: UI must be extremely simple and intuitive for non-technical manager
- **Offline Tolerance**: Consider what happens if manager loses internet (future consideration)

---

## 8. Out of Scope (for MVP)

- Mobile native apps (web-only for MVP)
- Advanced analytics/BI dashboards
- Multi-manager accounts (single manager for MVP)
- Tenant-facing portal beyond intake form
- Integration with DOC systems
- Automated DOC notification of new arrivals
- Document storage (lease agreements, etc.)
- Maintenance request tracking

---

## 9. Success Metrics

### Business Metrics

- Reduce report generation time by 80%
- Zero surprise tenant arrivals within 30 days of go-live
- 80%+ tenant self-service intake completion rate
- 50% reduction in data entry errors

### Technical Metrics

- 99% uptime
- <2 second page load times
- Mobile intake form completion rate >90%
- Zero data breaches

---

## 10. Open Questions & Risks

**Questions for Manager**:

1. How many properties do you currently manage? (determines scale)
2. What counties are your properties in? Do you plan to expand to other counties?
3. What percentage of tenants are DOC vs TeleCare vs Private?
4. What reports do you generate most frequently? (prioritize for Epic 4.2)
5. How do you currently receive notice of new tenant assignments from DOC?
6. How often do you need to relocate tenants between properties?
7. Do any of your houses have gender restrictions or other special rules?
8. What is the current voucher rate? Does it change frequently?
9. How far in advance do you know about ERD releases?
10. Do you need to track multiple contact types (emergency contacts, case managers, etc.)?

**Risks**:

- Manager communication challenges may lead to scope mismatch
- Low technical proficiency may require extensive training/onboarding
- Data migration from Excel may reveal data quality issues
- Tenant adoption of intake form depends on access to smartphones/internet

---

## 11. Next Steps

1. **Sunday Demo**: Present clickable prototype to validate assumptions
2. **Feedback Session**: Answer open questions, refine priorities
3. **Backlog Refinement**: Break epics into detailed user stories with acceptance criteria
4. **Sprint Planning**: Estimate story points, plan first 2-3 sprints
5. **Development Kickoff**: Begin Milestone 1 (Data Migration & ETL)
