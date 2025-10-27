# Product Specification Document

## Halfway Housing Dashboard

**Last Updated**: October 27, 2025
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

**Description**: Implement comprehensive payment tracking infrastructure with transaction ledger, manual payment recording, automated billing cycles, and reporting capabilities. This epic establishes the foundation for financial record-keeping and enables future online payment integration.

**User Stories**:

**Story 3.3.1: Payment Ledger Schema Implementation**

As a developer, I need to create a payment ledger table in the database so that all financial transactions are recorded with full audit history.

Acceptance Criteria:
- `payment_ledger` table created with fields:
  - `payment_id` (PK, UUID)
  - `tenant_id` (FK to tenants)
  - `amount` (NUMERIC(8,2))
  - `payment_date` (DATE)
  - `payment_method` (VARCHAR: 'Cash', 'Check', 'Money Order', 'Square', 'Bank Transfer')
  - `transaction_id` (VARCHAR, for Square/online payments)
  - `billing_month` (DATE, tracks which month this payment is for)
  - `recorded_by` (FK to users, who entered this payment)
  - `notes` (TEXT, optional)
  - `created_at` (TIMESTAMP)
- Foreign keys properly reference tenants and users tables
- Indexes added on `tenant_id`, `billing_month`, `payment_date`
- Migration script is reversible (has rollback)

**Story 3.3.2: Manual Payment Recording**

As a housing manager, I need to record rent payments that I receive in cash, check, or money order so that tenant accounts reflect their current payment status.

Acceptance Criteria:
- Payment recording form accessible from tenant detail page
- Form fields: amount, payment date, payment method, billing month, notes
- Shows tenant's current rent amount and outstanding balance before recording
- Shows recent payment history (last 3 months) to prevent duplicate entries
- Confirmation dialog: "Record $[amount] payment for [tenant] for [month]?"
- Success message displays after recording
- Payment immediately appears in tenant's payment history
- API endpoint: `POST /api/payments` with validation

**Story 3.3.3: Payment History View**

As a housing manager, I want to view a tenant's complete payment history so I can verify past payments and resolve disputes.

Acceptance Criteria:
- Payment history table on tenant detail page
- Columns: Date, Amount, Method, Billing Month, Recorded By, Notes
- Sortable by date (newest first by default)
- Filterable by billing month and payment method
- Shows running balance calculation
- Export to CSV button for individual tenant
- Pagination if more than 50 payments

**Story 3.3.4: Monthly Billing Cycle Automation**

As a developer, I need to implement an automated monthly job that resets rent payment status so that the system accurately reflects the new billing cycle.

Acceptance Criteria:
- Scheduled function runs on 1st of each month at 12:01 AM
- For each active tenant:
  - Calculate outstanding balance from payment ledger
  - Handle pro-rated rent for mid-month move-ins (if move-in date > 15th of month)
- Job logs execution results (success/failure, tenants processed)
- Manual trigger endpoint for testing: `POST /api/admin/billing-cycle/reset`
- Email notification to admin if job fails
- Idempotent (safe to run multiple times)

**Story 3.3.5: Dashboard Payment Status Indicators**

As a housing manager, I need to see at-a-glance which tenants have paid rent this month so that I can follow up on unpaid accounts.

Acceptance Criteria:
- Dashboard shows payment status summary card:
  - "X of Y tenants paid this month"
  - Total collected this month: $X,XXX
  - Outstanding: $X,XXX
- Tenant list has payment status column with visual indicators:
  - Green "Paid" badge
  - Yellow "Partial" badge (if payment < rent due)
  - Red "Unpaid" badge
  - Red "Late" badge (if unpaid after 5th of month)
- Click badge to view payment details
- Filter tenant list by payment status

**Story 3.3.6: Payment Export & Reporting**

As a housing manager, I need to export payment data to Excel/CSV so that I can reconcile accounts with my bookkeeper and Square reports.

Acceptance Criteria:
- "Export Payments" button on payments page
- Export options:
  - Date range selector
  - Filter by property/house
  - Filter by payment method
  - Filter by tenant
- CSV includes: Payment Date, Tenant Name, Property, Amount, Method, Billing Month, Transaction ID, Notes
- Filename format: `payments_YYYY-MM-DD_to_YYYY-MM-DD.csv`
- Export completes in <5 seconds for 1000 records

**Overall Epic Acceptance Criteria**:

- `payment_ledger` table operational with proper relationships
- Managers can manually record all payment types
- Payment history viewable per tenant with full transaction details
- Automated monthly billing cycle with pro-rating support
- Dashboard displays current month payment status
- Payment data exportable to CSV for accounting reconciliation
- All payments recorded with audit trail (who, when, why)

---

#### Epic 3.4: Online Payment Integration (Square) (Post-MVP)

**Description**: Integrate Square payment processing to allow tenants to pay rent online via credit/debit card. Provide secure payment forms, webhook handling for automatic payment recording, receipt generation, and refund processing.

**Dependencies**:
- Requires Epic 3.3 (Payment Ledger) to be complete
- Requires client's Square developer credentials and business account setup

**User Stories**:

**Story 3.4.1: Square SDK Integration**

As a developer, I need to integrate Square's payment SDK into the application so that we can securely process online payments.

Acceptance Criteria:
- Square Node.js SDK installed and configured
- Square Web Payments SDK integrated in React frontend
- Environment variables for Square credentials (Application ID, Access Token, Location ID)
- Sandbox environment configured for testing
- Payment tokenization implemented (never store card details)

**Story 3.4.2: Tenant Payment Portal UI**

As a tenant, I want to pay my rent online using a credit or debit card so that I don't need to use cash or checks.

Acceptance Criteria:
- Secure payment form accessible from tenant portal
- Shows current rent due and billing month
- Square payment form component (handles card input securely)
- Payment confirmation screen with transaction ID
- Mobile-responsive design
- "Pay Rent" button disabled after successful payment (prevent duplicates)

**Story 3.4.3: Payment Webhook Handling**

As a developer, I need to handle Square payment webhooks so that successful payments are automatically recorded in the payment ledger.

Acceptance Criteria:
- Webhook endpoint: `POST /api/webhooks/square`
- Webhook signature verification (security)
- Automatic payment ledger entry on successful payment
- Tenant notification email sent on success
- Manager notification email sent on success
- Failed webhook attempts logged for debugging

**Story 3.4.4: Receipt Generation & Email**

As a tenant, I want to receive a receipt after paying rent online so that I have proof of payment.

Acceptance Criteria:
- PDF receipt generated with:
  - Payment date, amount, method
  - Tenant name, property address
  - Transaction ID
  - "Paid in full" or remaining balance
- Email sent to tenant with PDF attachment
- Receipt also accessible in tenant payment history
- Receipts stored in Supabase Storage

**Story 3.4.5: Payment Failure Handling**

As a housing manager, I need to be notified when online payments fail so that I can follow up with tenants.

Acceptance Criteria:
- Failed payments logged in database
- Tenant sees user-friendly error message (not technical details)
- Manager receives email notification of failed payment
- Tenant can retry payment immediately
- Common failure reasons displayed (insufficient funds, card declined, etc.)

**Story 3.4.6: Refund Processing**

As a housing manager, I need to process refunds for overpayments or tenant disputes so that I can maintain accurate accounting.

Acceptance Criteria:
- Refund button on payment detail page (manager only)
- Refund confirmation dialog with reason field
- Square refund API integration
- Negative payment entry in ledger (audit trail)
- Email sent to tenant confirming refund
- Manager notes field for documenting refund reason

**Overall Epic Acceptance Criteria**:

- Tenants can pay rent online securely via Square
- Payments automatically recorded in payment ledger
- Receipts generated and emailed to tenants
- Manager notified of all payment activity
- Refunds processable by manager
- All transactions logged with full audit trail
- Integration uses client's existing Square account

**Technical Notes**:
- Client already uses Square for business operations (account setup complete)
- Square transaction fees: ~2.9% + $0.30 per transaction
- PCI compliance handled by Square (we never store card numbers)
- Webhook security critical (verify all webhook signatures)

**Open Questions for Client**:
- Do you want to enable ACH/bank transfer payments in addition to cards?
- Should tenants be able to set up recurring/automatic payments?
- What should the payment deadline be each month (5th? 10th?)

---

### Theme 4: Forms & Documentation

_Enable self-service forms for tenants and admin documentation workflows_

#### Epic 4.1: Resident Intake Form (MVP Phase 1)

**Description**: Comprehensive intake form with 10 policy agreement sections, e-signatures, and PDF export for compliance. Tenants complete this form upon move-in to acknowledge house rules and policies.

**User Stories**:

- As a tenant, I want to read and agree to house policies electronically so I can complete intake quickly
- As a tenant, I want to provide my e-signature for each policy section so I don't need to print and scan documents
- As a housing manager, I want all policy acknowledgments stored securely so I have compliance records
- As a housing manager, I want to export signed intake forms to PDF so I can archive them in Google Drive
- As a housing manager, I want to prevent form submission unless all policies are acknowledged so I ensure compliance

**Acceptance Criteria**:

- 10 policy sections rendered with full text:
  1. Substance Use Rules
  2. Recovery Rules
  3. Guest Rules
  4. Behavioral Rules
  5. House Rules
  6. Safety and Inspection Rules
  7. Statement of Resident Rights
  8. Medication Policy
  9. Good Neighbor Policy
  10. Payment Policy
- Each section has checkbox: "I agree to [Policy Name]"
- Each section has e-signature canvas for initials/signature
- **Frontend validation**: All 10 checkboxes must be checked before "Submit" button activates
- **Backend validation**: Reject submission if any `agreed = false`
- **Error message**: "You must agree to and sign all policy sections before submitting."
- Creates `form_submission` record with `form_type = 'Intake'`
- Creates 10 `policy_agreements` records (one per section)
- Signature data stored as base64 PNG
- PDF generation with:
  - Client logo and mission statement (header)
  - All policy text with ☑ checkboxes
  - Embedded signature images
  - Printed name and date
- PDF uploaded to Google Drive folder: "Housing Dashboard - Signed Agreements"
- PDF URL stored in `form_submissions.pdf_url`
- Mobile-responsive (tenants use phones/tablets)
- Dashboard notification when intake submitted

**Dependencies**:
- Epic 4.3 (E-Signature Component) must be complete first

**Technical Notes**:
- Use `react-signature-canvas` for signature capture
- Use `pdfkit` or `jspdf` for PDF generation
- Google Drive API for PDF upload (same service account as Sheets)
- Form cannot be submitted with empty signatures

---

#### Epic 4.2: Application Form - DOC & Private (MVP Phase 1)

**Description**: Comprehensive application form for housing admission, filled out by DOC counselors for inmates or by walk-in applicants. Creates tenant record, extended profile, and emergency contacts.

**User Stories**:

- As a DOC counselor, I want to submit housing applications for inmates electronically so I don't need to fax/email paperwork
- As a walk-in applicant, I want to fill out a housing application online so I can apply quickly
- As a housing manager, I want to review applications in a queue so I can approve/deny/waitlist candidates
- As a housing manager, I want to see applicant details (recovery, legal, employment) so I can make informed decisions
- As a housing manager, I want to assign approved applicants to available beds so I can manage move-ins
- As a housing manager, I want to waitlist approved applicants when no beds are available so I don't lose qualified candidates

**Acceptance Criteria**:

**Form Sections**:

1. **General Information**:
   - First Name (required), Last Name (required)
   - Phone (optional), Email (optional)
   - Date of Birth (required)
   - Most Recent Address (dropdown with WA state prisons + "Other")
   - Food Allergies (optional)
   - Employment Status (optional), Employment Details (optional)
   - Profile Picture Upload (optional)

2. **Recovery Information** (conditional):
   - Checkbox: "Are you in recovery?" (if NO → hide recovery fields)
   - Drug of Choice
   - Substances Previously Used
   - Recovery Program (dropdown: 12-Step, SMART Recovery, Faith-Based, etc.)
   - Sober Date

3. **Legal History** (required):
   - Checkbox: "Are you on probation?" (if YES → show officer fields)
   - Checkbox: "Are you on parole?" (if YES → show officer fields)
   - Probation/Parole Officer Name
   - Probation/Parole Officer Phone
   - Completion Date
   - Criminal History (last 5 years) - text area, required (can be "None")
   - Checkbox: "Are you a Registered Sex Offender?" (required)
   - If YES → Sex Offense Details (required)

4. **Emergency Contacts** (at least 1 required):
   - First Name (required), Last Name (required)
   - Phone (required), Email (optional)
   - Relationship (required - dropdown: Parent, Sibling, Spouse, Friend, etc.)
   - Address (optional)
   - Additional Info (optional)
   - Checkbox: "Primary Contact"
   - "+ Add Another Contact" button (support up to 3 contacts)

5. **Veteran Status**:
   - Checkbox: "Are you a veteran?"

6. **Certification & Signature**:
   - Text: "I certify that all information provided is true and accurate to the best of my knowledge."
   - E-Signature canvas
   - Printed Name
   - Date (auto-filled)

**Form Behavior**:
- WA Prison dropdown includes addresses for all WA state prisons (client will provide list)
- Profile picture upload → Supabase Storage bucket `tenant-profile-pictures`
- Image resize to 300x300px before upload
- All signatures validated before submission
- Creates records in tables: `tenants`, `tenant_profiles`, `emergency_contacts` (1+), `form_submissions`
- Tenant `application_status` = 'Pending'

**Manager Review Workflow**:
- Dashboard shows notification: "New Application: [Name]"
- Manager clicks to view application details
- Manager actions:
  - **Approve** → If bed available: Assign bed → Status = 'Active'
  - **Waitlist** → No bed available but approved → Status = 'Waitlist'
  - **Deny** → Status = 'Denied', add reason in notes
  - **Request More Info** → form_submission.status = 'Needs Info', send email/SMS to applicant
- Waitlist tab shows all waitlisted applicants
- When bed becomes available → Notification: "Bed Available - Check Waitlist"

**Dual Application + Intake Form** (convenience feature):
- For in-person admissions, frontend can render both Application + Intake forms together
- Backend creates two separate `form_submissions` (Application + Intake)
- Links both to same `tenant_id`

**Dependencies**:
- Epic 4.3 (E-Signature Component)
- Supabase Storage setup for profile pictures

---

#### Epic 4.3: E-Signature Component (MVP Phase 1)

**Description**: Reusable React component for capturing electronic signatures and initials using touchscreen or mouse.

**User Stories**:

- As a tenant, I want to sign forms with my finger on a touchscreen so I don't need paper
- As a tenant, I want to clear and redo my signature if I make a mistake so I can get it right
- As a developer, I want a reusable signature component so I can use it across multiple forms

**Acceptance Criteria**:

- Install `react-signature-canvas` library
- Create wrapper component `<SignatureCanvas />`:
  - Props: `onSave(signatureBase64)`, `label`, `required`, `width`, `height`
  - Signature pad with drawing canvas
  - "Clear" button to reset canvas
  - "Save" button to capture signature
  - Signature saved as base64 PNG string
  - Visual indication when signature is captured (green checkmark)
- Component validates:
  - Required signatures cannot be empty
  - Error message: "Signature is required"
- Signature display component `<SignatureDisplay />`:
  - Props: `signatureBase64`, `label`
  - Renders base64 PNG image
  - Used in admin views to show saved signatures
- Mobile-responsive (works on phone/tablet screens)
- Accessible (keyboard navigation, screen reader support)

**Technical Notes**:
- Library: `react-signature-canvas` (wrapper for signature_pad.js)
- Output format: Base64 PNG
- Typical base64 signature size: 5-10 KB
- Store in database as TEXT field

**Component Usage Example**:
```jsx
<SignatureCanvas
  label="Substance Use Rules - Signature"
  required={true}
  onSave={(base64) => setSubstanceSignature(base64)}
/>
```

---

#### Epic 4.4: Maintenance, Grievance & Overnight Forms (Post-MVP)

**Description**: Additional self-service forms for tenant requests and manager workflow automation.

**User Stories**:

**Maintenance Requests**:
- As a tenant, I want to submit maintenance requests online so issues get addressed quickly
- As a housing manager, I want maintenance requests to create work orders so I can track resolution
- As a housing manager, I want to mark work orders as "In Progress" or "Resolved" so I manage tasks efficiently

**Grievance Forms**:
- As a tenant, I want to file formal grievances electronically so I can document concerns
- As a housing manager, I want to review grievances and add resolution notes so I maintain records

**Overnight Requests**:
- As a tenant, I want to request overnight passes online so I don't have to track down the manager
- As a housing manager, I want to approve/deny overnight requests so I enforce house rules
- As a housing manager, I want tenants notified by email/SMS of approval/denial so they know the decision

**Acceptance Criteria**:

**Maintenance Form**:
- Fields: First Name, Last Name, House (dropdown), Issue Type (dropdown with subtypes), Location, Description, Previously Submitted (yes/no)
- Creates `form_submission` with `form_type = 'Maintenance'`
- Dashboard tab: "Work Orders" with counts (New, In Progress, Resolved)
- Manager can add notes and update status
- Notification badge when new maintenance requests submitted

**Grievance Form**:
- Fields: First Name, Last Name, DOB, Date/Time of Issue, Relates To (dropdown), Details, Proposed Solutions
- Creates `form_submission` with `form_type = 'Grievance'`
- Manager reviews, adds notes, marks "Resolved"
- Simple workflow (no complex approval process)

**Overnight Request Form**:
- Fields: First Name, Last Name, DOB, Leaving Date/Time, Return Date/Time, Reason, Location, Who You're Seeing
- Certification: "I certify this request is honest and accurate" + e-signature
- Creates `form_submission` with `form_type = 'Overnight'`, `status = 'Pending'`
- Must be submitted at least 1 week in advance (validation)
- Manager actions: Approve, Deny, Request More Info
- Email/SMS notification to tenant with decision

**Dependencies**:
- Epic 4.3 (E-Signature Component) for overnight requests

---

### Theme 5: Reporting & Insights

_Generate reports and enable data-driven decisions_

#### Epic 5.1: Dashboard & Visualization

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

#### Epic 5.2: Report Generation

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

#### Epic 5.3: AI-Assisted Document Generation (Stretch Goal)

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

### Theme 6: Admin Settings & Configuration

_Enable managers to configure system settings and business rules_

#### Epic 6.1: Voucher Rate Management (MVP Phase 1 - HIGH PRIORITY)

**Description**: Admin panel for managing ERD and GRE voucher rates, allowing managers to update amounts as DOC rates change.

**User Stories**:

- As a housing manager, I want to update ERD voucher rates so the system reflects current DOC rates
- As a housing manager, I want to update GRE voucher rates so the system reflects current DOC rates
- As a housing manager, I want to see the current active rates so I know what amounts are being used
- As a housing manager, I want to see rate history so I can audit when rates changed

**Acceptance Criteria**:

- Admin Settings page accessible from main navigation (manager role only)
- Section: "Voucher Rates"
- Display current active rates:
  - ERD: $XXX.XX per month (Last updated: MM/DD/YYYY)
  - GRE: $XXX.XX per month (Last updated: MM/DD/YYYY)
- "Update Rate" button for each voucher type
- Update modal:
  - Input: New Amount (numeric, 2 decimal places)
  - Input: Notes (optional - e.g., "Updated per DOC directive")
  - Confirmation: "Update [ERD/GRE] rate from $XXX to $XXX?"
- Backend workflow:
  - Set old rate `is_active = false`
  - Insert new rate with `amount = [new amount]`, `effective_date = CURRENT_DATE`, `is_active = true`
  - Historical rates preserved (audit trail)
- Success message: "Voucher rate updated successfully"
- Rate history view showing all past rates with effective dates
- Query for active rates: `SELECT * FROM voucher_rates WHERE is_active = true AND voucher_type = 'ERD'`

**Seed Data on Database Setup**:
```sql
INSERT INTO voucher_rates (voucher_type, amount, is_active, notes) VALUES
  ('ERD', 700.00, true, 'Estimated Release Date - 6 month voucher'),
  ('GRE', 700.00, true, 'Graduated Re-Entry (Work Release) - 6 month voucher - AMOUNT TBD');
```

**Open Questions for Client**:
- What is the current GRE voucher amount? (defaulted to $700 for now)
- How often do voucher rates change?
- Who should have permission to update rates? (all managers or owner only?)

**Priority Note**: This epic is HIGH PRIORITY for MVP Phase 1 because voucher rates directly affect financial calculations and must be configurable by the client.

---

### Theme 7: Advanced Operations (Post-MVP)

_Complex operational features for edge cases_

#### Epic 7.1: Advanced Bed Management ("Batter's Box")

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

#### Epic 7.2: Compliance & House Rules

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

### Theme 8: Access Control & Security

_Ensure proper authentication and data protection_

#### Epic 8.1: Authentication & Authorization

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

**Target**: Extended timeline (Nov-Dec 2025) to accommodate new form system

**Core Data & Operations**:
- Epic 1.1: Property & Bed Management (with county field) ⭐
- Epic 1.2: Tenant Management ⭐
- Epic 8.1: Authentication & Authorization (basic) ⭐

**Forms & Intake**:
- Epic 4.1: Resident Intake Form (10 policy sections + e-signatures) ⭐
- Epic 4.2: Application Form - DOC & Private (extended profile, emergency contacts) ⭐
- Epic 4.3: E-Signature Component (react-signature-canvas) ⭐

**Financial & Configuration**:
- Epic 3.1: Payment & Voucher Management (rent tracking) ⭐
- Epic 6.1: Voucher Rate Management (ERD/GRE admin settings) ⭐ **HIGH PRIORITY**

**Dashboard & Visualization**:
- Epic 5.1: Dashboard & Visualization (basic + county filter, property search) ⭐

**Success Criteria**:

- Manager can perform all CRUD operations
- Tenants can submit Application form (extended profile, recovery, legal, emergency contacts)
- Tenants can submit Intake form (10 policy sections with e-signatures, PDF export)
- Manager can review/approve/deny/waitlist applications
- Manager sees dashboard with key metrics and county filtering
- Rent tracking shows base vs actual per bed/tenant
- Manager can configure ERD/GRE voucher rates via Admin Settings
- Profile pictures supported via Supabase Storage
- Google Sheets sync (basic export)

---

### MVP Phase 2 (Priorities 3 & 4)

**Target**: 2-4 weeks post-MVP Phase 1

- Epic 1.3: Tenant Operations (relocation/transfer) ⭐
- Epic 2.2: Alerts & Notifications (month-based voucher display) ⭐
- Epic 3.2: Property Financial Dashboard (revenue tracking) ⭐
- Epic 5.2: Report Generation ⭐
- Google Sheets advanced sync & export (monthly/property reports)

**Success Criteria**:

- Manager can relocate tenants between beds/properties
- Automated alerts for expirations and arrivals (displayed as months)
- Property financial performance visible (max vs current revenue)
- One-click reports
- Advanced Google Sheets integration

---

### Post-MVP (Future Enhancements)

**Target**: TBD based on feedback and funding

- Epic 3.3: Rental History & Ledger (payment tracking infrastructure)
- Epic 3.4: Online Payment Integration (Square)
- Epic 4.4: Maintenance, Grievance & Overnight Forms (work orders, approvals)
- Epic 5.3: AI-Assisted Document Generation
- Epic 7.1: Advanced Bed Management ("Batter's Box")
- Epic 7.2: Compliance & House Rules (gender restrictions)
- DOC Stakeholder portal (Epic 8.1 expansion)
- Advanced reporting and analytics

---

## 6. Data Schema (User-Friendly Version)

### Core Tables

#### Table: houses

**Purpose**: Tracks halfway house properties and locations

**Fields**:
- **house_id** (UUID, Primary Key): Unique identifier
- **address** (VARCHAR 255): Full street address
- **county** (VARCHAR 64): County location (King, Pierce, etc.)
- **total_beds** (INT): Total number of beds in this property
- **notes** (TEXT): Optional manager notes about the property
- **created_at** (TIMESTAMP): Record creation timestamp
- **updated_at** (TIMESTAMP): Last modification timestamp

---

#### Table: beds

**Purpose**: Tracks individual bed availability and assignments

**Fields**:
- **bed_id** (UUID, Primary Key): Unique identifier
- **house_id** (UUID, Foreign Key → houses): Which property this bed belongs to
- **room_number** (VARCHAR 32): Room identifier (e.g., "Room 2A", "Bed 3")
- **status** (VARCHAR 16): Current status - CHECK constraint: 'Available', 'Occupied', 'Pending', 'Hold'
- **rent_amount** (NUMERIC 8,2): Monthly rent for this bed (e.g., 850.00)
- **tenant_id** (UUID, Foreign Key → tenants, NULLABLE): Currently assigned tenant
- **notes** (TEXT): Optional notes about this specific bed
- **created_at** (TIMESTAMP): Record creation timestamp
- **updated_at** (TIMESTAMP): Last modification timestamp

**Indexes**:
- `idx_beds_house` on `house_id`
- `idx_beds_status` on `status`
- `idx_beds_tenant` on `tenant_id`

**Why rent lives in beds table**: Rent is a property of the bed/room, not the tenant. Different beds in the same house may have different rates. Voucher tenants may pay less than the bed's full rent value, which is tracked separately in the tenant record.

---

#### Table: tenants

**Purpose**: Stores resident information and housing assignments

**Fields**:

**Core Identity**:
- **tenant_id** (UUID, Primary Key): Unique identifier
- **full_name** (VARCHAR 255, REQUIRED): Tenant's full name
- **dob** (DATE, REQUIRED): Date of birth
- **phone** (VARCHAR 32, NULLABLE): Phone number (optional - inmates may not have phones initially)
- **email** (VARCHAR 255, NULLABLE): Email address (optional)
- **address** (VARCHAR 255, NULLABLE): Most recent address
- **profile_picture_url** (TEXT, NULLABLE): URL to profile picture in Supabase Storage
- **application_status** (VARCHAR 32): Application pipeline status
  - CHECK constraint: 'Pending', 'Approved', 'Waitlist', 'Denied', 'Active', 'Exited'
  - **Pending**: Application submitted, awaiting manager review
  - **Approved**: Approved with bed available, ready to move in
  - **Waitlist**: Approved but no bed available (backlog for future placement)
  - **Denied**: Application rejected
  - **Active**: Currently residing in a bed
  - **Exited**: Former resident, moved out

**Housing Assignment**:
- **bed_id** (UUID, Foreign Key → beds, NULLABLE): Currently assigned bed
- **entry_date** (DATE): Move-in date
- **exit_date** (DATE, NULLABLE): Move-out date

**Agency/Program Information**:
- **doc_number** (VARCHAR 64): DOC/agency reference number
- **tenant_type** (VARCHAR 64): Program affiliation (e.g., 'DOC', 'TeleCare', 'Private')
- **voucher_type** (VARCHAR 8, NULLABLE): Voucher program type ('ERD', 'GRE', or NULL)

**Payment/Financial**:
- **payment_type** (VARCHAR 32): Payment source (e.g., 'Private', 'Voucher', 'TeleCare')
- **voucher_start** (DATE, NULLABLE): Voucher coverage start date
- **voucher_end** (DATE, NULLABLE): Voucher coverage end date
- **rent_paid** (BOOLEAN): Has rent been paid this month?

**Metadata**:
- **notes** (TEXT): Manager notes about this tenant
- **created_at** (TIMESTAMP): Record creation timestamp
- **updated_at** (TIMESTAMP): Last modification timestamp

**Indexes**:
- `idx_tenants_application_status` on `application_status`
- `idx_tenants_full_name` on `full_name`
- `idx_tenants_bed` on `bed_id`

---

#### Table: tenant_profiles

**Purpose**: Extended tenant information from Application form (1:1 relationship with tenants)

**Fields**:
- **profile_id** (UUID, Primary Key): Unique identifier
- **tenant_id** (UUID, Foreign Key → tenants, UNIQUE): Link to tenant record

**Employment**:
- **food_allergies** (TEXT, NULLABLE): Food allergy information
- **employment_status** (VARCHAR 32, NULLABLE): Employment status ('Employed', 'Unemployed', 'Student', 'Seeking')
- **employment_details** (TEXT, NULLABLE): Employment details (employer, position, etc.)

**Recovery Information** (conditional - only if `is_in_recovery = true`):
- **is_in_recovery** (BOOLEAN, DEFAULT false): Is tenant in recovery program?
- **drug_of_choice** (VARCHAR 64, NULLABLE): Primary substance
- **substances_previously_used** (TEXT, NULLABLE): History of substance use
- **recovery_program** (VARCHAR 64, NULLABLE): Program type (12-Step, SMART Recovery, etc.)
- **sober_date** (DATE, NULLABLE): Sobriety start date

**Legal Information** (conditional - only if probation/parole = true):
- **is_on_probation** (BOOLEAN, DEFAULT false): Currently on probation?
- **is_on_parole** (BOOLEAN, DEFAULT false): Currently on parole?
- **probation_parole_officer_name** (VARCHAR 128, NULLABLE): Officer name
- **probation_parole_officer_phone** (VARCHAR 32, NULLABLE): Officer contact number
- **probation_parole_completion_date** (DATE, NULLABLE): Supervision end date
- **criminal_history** (TEXT, NULLABLE): Description of criminal history (last 5 years)
- **is_registered_sex_offender** (BOOLEAN, DEFAULT false): Sex offender registry status
- **sex_offense_details** (TEXT, NULLABLE): Required if `is_registered_sex_offender = true`

**Veteran Status**:
- **is_veteran** (BOOLEAN, DEFAULT false): Military veteran status

**Metadata**:
- **created_at** (TIMESTAMP): Record creation timestamp
- **updated_at** (TIMESTAMP): Last modification timestamp

**Index**:
- `idx_tenant_profiles_tenant` on `tenant_id` (UNIQUE)

**Frontend Logic**: Conditional fields only appear in Application form if boolean is true:
- If `is_in_recovery = true` → Show recovery-related fields
- If `is_on_probation = true` OR `is_on_parole = true` → Show legal/officer fields
- If `is_registered_sex_offender = true` → Require `sex_offense_details`

---

#### Table: emergency_contacts

**Purpose**: Emergency contact information for tenants (at least 1 required per tenant)

**Fields**:
- **contact_id** (UUID, Primary Key): Unique identifier
- **tenant_id** (UUID, Foreign Key → tenants): Which tenant this contact belongs to
- **first_name** (VARCHAR 64, REQUIRED): Contact's first name
- **last_name** (VARCHAR 64, REQUIRED): Contact's last name
- **phone** (VARCHAR 32, REQUIRED): Contact phone number
- **email** (VARCHAR 255, NULLABLE): Contact email (optional)
- **relationship** (VARCHAR 64, REQUIRED): Relationship to tenant (Parent, Sibling, Friend, Spouse, etc.)
- **address** (VARCHAR 255, NULLABLE): Contact's address
- **additional_info** (TEXT, NULLABLE): Additional notes about this contact
- **is_primary** (BOOLEAN, DEFAULT false): Is this the primary emergency contact?
- **created_at** (TIMESTAMP): Record creation timestamp
- **updated_at** (TIMESTAMP): Last modification timestamp

**Index**:
- `idx_emergency_contacts_tenant` on `tenant_id`

**Business Rule**: At least 1 emergency contact is required per tenant (enforced at application layer)

---

#### Table: form_submissions

**Purpose**: Stores all form submissions (Application, Intake, Maintenance, Grievance, Overnight) as JSONB for flexibility

**Fields**:
- **submission_id** (UUID, Primary Key): Unique identifier
- **tenant_id** (UUID, Foreign Key → tenants): Which tenant submitted this form
- **form_type** (VARCHAR 32, REQUIRED): Type of form - CHECK constraint: 'Application', 'Intake', 'Maintenance', 'Grievance', 'Overnight'
- **form_data** (JSONB, REQUIRED): Complete form contents stored as JSON
- **status** (VARCHAR 32, DEFAULT 'Pending'): Processing status - CHECK constraint: 'Pending', 'Approved', 'Denied', 'Resolved', 'Needs Info', 'Waitlist'
- **pdf_url** (TEXT, NULLABLE): URL to exported PDF (for Intake forms with signatures, stored in Google Drive)
- **submitted_at** (TIMESTAMP, DEFAULT NOW()): When form was submitted
- **submitted_by** (UUID, Foreign Key → users, NULLABLE): Who submitted (NULL for tenant self-submissions)
- **reviewed_by** (UUID, Foreign Key → users, NULLABLE): Which manager reviewed this submission
- **reviewed_at** (TIMESTAMP, NULLABLE): When review occurred
- **review_notes** (TEXT, NULLABLE): Manager notes about review/decision
- **created_at** (TIMESTAMP): Record creation timestamp
- **updated_at** (TIMESTAMP): Last modification timestamp

**Indexes**:
- `idx_form_submissions_tenant` on `tenant_id`
- `idx_form_submissions_type_status` on `form_type, status`
- Partial index: `idx_form_submissions_pending` on `status, submitted_at DESC` WHERE `status IN ('Pending', 'Needs Info')`

**JSON Schema Examples**:

**Application form_data**:
```json
{
  "personal": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "206-555-0100",
    "email": "john.doe@example.com",
    "dob": "1990-05-15",
    "most_recent_address": "Washington State Penitentiary - 1313 N 13th Ave, Walla Walla, WA 99362",
    "food_allergies": "Peanuts, shellfish"
  },
  "recovery": {
    "is_in_recovery": true,
    "drug_of_choice": "Opioids",
    "recovery_program": "12-Step (AA/NA)",
    "sober_date": "2023-06-01"
  },
  "legal": {
    "is_on_probation": false,
    "is_on_parole": true,
    "officer_name": "Jane Smith",
    "officer_phone": "360-555-0200",
    "completion_date": "2026-12-31",
    "criminal_history": "Drug possession (2020), Burglary (2018)",
    "is_registered_sex_offender": false
  },
  "veteran_status": false
}
```

**Intake form_data**:
```json
{
  "resident_info": {
    "first_name": "John",
    "last_name": "Doe",
    "dob": "1990-05-15"
  },
  "policies_acknowledged": true,
  "all_signatures_collected": true
}
```

**Maintenance form_data**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "house_address": "123 Main St",
  "issue_type": "Plumbing",
  "issue_subtype": "Leaky faucet",
  "location": "Kitchen, sink area",
  "description": "Kitchen faucet dripping constantly, wasting water",
  "previously_submitted": false
}
```

---

#### Table: policy_agreements

**Purpose**: Tracks Intake form policy section acknowledgments and e-signatures

**Fields**:
- **agreement_id** (UUID, Primary Key): Unique identifier
- **tenant_id** (UUID, Foreign Key → tenants): Which tenant agreed to this policy
- **form_submission_id** (UUID, Foreign Key → form_submissions): Link to Intake form submission
- **policy_section** (VARCHAR 32, REQUIRED): Which policy section - CHECK constraint: 'Substance Use', 'Recovery', 'Guest', 'Behavioral', 'House', 'Safety', 'Rights', 'Medications', 'Neighbors', 'Payments'
- **agreed** (BOOLEAN, REQUIRED): Did tenant check the agreement box? (Must be TRUE to submit form)
- **signature_data** (TEXT, NULLABLE): Base64-encoded signature/initials image (PNG)
- **signed_at** (TIMESTAMP, DEFAULT NOW()): When signature was captured
- **created_at** (TIMESTAMP): Record creation timestamp

**Index**:
- `idx_policy_agreements_submission` on `form_submission_id`

**Business Rule**: All 10 policy sections must have `agreed = TRUE` before Intake form can be submitted (enforced at frontend AND backend)

**E-Signature Format**: Stored as base64-encoded PNG image generated by react-signature-canvas library

---

#### Table: voucher_rates

**Purpose**: Admin-configurable voucher rates for ERD and GRE programs

**Fields**:
- **rate_id** (UUID, Primary Key): Unique identifier
- **voucher_type** (VARCHAR 8, REQUIRED): Voucher program type - CHECK constraint: 'ERD', 'GRE'
- **amount** (NUMERIC 8,2, REQUIRED): Monthly voucher amount (e.g., 700.00)
- **effective_date** (DATE, DEFAULT CURRENT_DATE): When this rate became effective
- **is_active** (BOOLEAN, DEFAULT true): Is this the current active rate?
- **notes** (TEXT, NULLABLE): Notes about this rate (e.g., "Updated per DOC directive")
- **created_at** (TIMESTAMP): Record creation timestamp
- **updated_at** (TIMESTAMP): Last modification timestamp

**Indexes**:
- `idx_voucher_rates_active` on `voucher_type, is_active` WHERE `is_active = true`

**Seed Data**:
```sql
INSERT INTO voucher_rates (voucher_type, amount, is_active, notes) VALUES
  ('ERD', 700.00, true, 'Estimated Release Date - 6 month voucher'),
  ('GRE', 700.00, true, 'Graduated Re-Entry (Work Release) - 6 month voucher - AMOUNT TBD');
```

**Admin Update Workflow**:
1. Manager updates voucher rate in Admin Settings page
2. Backend sets old rate `is_active = false`
3. Backend inserts new rate with new `amount` and `effective_date = CURRENT_DATE`, `is_active = true`
4. Historical rates preserved for audit trail

**Voucher Types**:
- **ERD** (Estimated Release Date): For inmates releasing directly from prison with 6-month housing voucher
- **GRE** (Graduated Re-Entry / Work Release): For inmates in early release work programs with 6-month housing voucher

**Note**: Client currently uses $700/month for ERD. GRE amount is TBD - currently defaulted to $700 but needs client confirmation.

---

### Payment Tracking Schema (Post-MVP - Epic 3.3)

#### Table: payment_ledger

This table maintains a complete transaction history for all rent payments. It serves as the single source of truth for financial records and enables auditing, reporting, and accounting reconciliation.

**Fields**:

- **payment_id** (UUID, Primary Key): Unique identifier for each payment transaction
- **tenant_id** (UUID, Foreign Key → tenants): Which tenant made this payment
- **amount** (NUMERIC(8,2)): Payment amount in dollars (e.g., 850.00)
- **payment_date** (DATE): When the payment was received
- **billing_month** (DATE): Which month this payment is for (e.g., '2025-10-01' for October rent)
- **payment_method** (VARCHAR(32)): How payment was made
  - Options: 'Cash', 'Check', 'Money Order', 'Square', 'Bank Transfer'
- **transaction_id** (VARCHAR(255)): External transaction reference (Square transaction ID, check number, etc.)
- **recorded_by** (UUID, Foreign Key → users): Which manager/user recorded this payment
- **notes** (TEXT): Optional notes about this payment (e.g., "Partial payment - rest due by 10th")
- **created_at** (TIMESTAMP): When this record was created (audit trail)
- **updated_at** (TIMESTAMP): When this record was last modified

**Indexes for Performance**:
- `tenant_id, billing_month` (most common query: "Show me all payments for tenant X in month Y")
- `payment_date DESC` (for recent payment lists)
- `billing_month` (for monthly reports)

**Key Design Decisions**:
- Each row represents ONE payment transaction
- Multiple payments per tenant per month are supported (partial payments)
- `billing_month` allows for early/late payments (tenant might pay October rent on Sept 28th)
- Negative amounts represent refunds (for audit trail)
- Never delete payments - mark as refunded instead

---

#### Pro-Rating Logic (Epic 3.3.4)

**Billing Cycle**: All tenants are normalized to the 1st of the month billing cycle

**Pro-Rating Rule**: If a tenant moves in after the 15th of the month, their first month rent is automatically pro-rated

**Calculation**:
```
prorated_rent = (bed.rent_amount / days_in_month) * days_remaining
```

**Example**:
- Bed rent: $850/month
- Move-in date: October 20th (12 days remaining in October)
- October has 31 days
- Pro-rated rent: ($850 / 31) × 12 = $329.03

**Implementation Notes**:
- Pro-rating calculated automatically by monthly billing cycle job
- First payment due date set based on move-in date
- Subsequent months always due on 1st
- Manager can override pro-rated amount if needed (manual adjustment)

---

#### Voucher Payment Handling (TBD - Pending Client Input)

**Current Understanding**:
- Vouchers are paid on the tenant's behalf (not paid directly by tenant)
- May be paid by housing authority, DOC, or TeleCare program
- Amount may differ from bed's base rent (e.g., voucher pays $700 but bed is worth $850)

**Questions for Client** (to be answered during Epic 3.3 implementation):
1. How do you receive voucher payments? (Direct deposit, check, etc.)
2. What documentation do you need for voucher tracking?
3. Are vouchers always the same amount ($700), or does it vary by program?
4. Who records voucher payments in the system? (Manager or automatic?)
5. How do you handle the gap when voucher < bed rent? (Tenant pays difference? Accepted loss?)

**Proposed Schema** (subject to change based on client feedback):
- Track voucher payments same as other payments in `payment_ledger`
- `payment_method` = 'Voucher' (or 'Housing Authority', 'DOC', 'TeleCare')
- `notes` field documents voucher program and any special handling
- `actual_rent` field on tenant (already in Epic 3.1) shows what's actually collected
- Gap between `bed.rent_amount` and `tenant.actual_rent` shows revenue variance

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

**General Operations**:

1. How many properties do you currently manage? (determines scale)
2. What counties are your properties in? Do you plan to expand to other counties?
3. What percentage of tenants are DOC vs TeleCare vs Private?
4. What reports do you generate most frequently? (prioritize for Epic 5.2)
5. How do you currently receive notice of new tenant assignments from DOC?
6. How often do you need to relocate tenants between properties?
7. Do any of your houses have gender restrictions or other special rules?
8. How far in advance do you know about ERD releases?
9. Do you need to track multiple contact types (emergency contacts, case managers, etc.)?

**Form System & Application Workflow** (for Epic 4.1, 4.2 implementation):

10. Can you provide a complete list of WA state prison addresses for the "Most Recent Address" dropdown?
11. What is the current GRE (Graduated Re-Entry) voucher amount? (ERD is confirmed as $700/month)
12. How often do voucher rates change? (determines update frequency expectations)
13. Who should have permission to update voucher rates? (all managers or owner only?)
14. Are there any specific requirements for profile pictures? (resolution, file format, background?)
15. For the Intake Form v1 vs v2 - are there any meaningful differences we should preserve, or should we use v1 as the canonical version?
16. Do you want to store logo and mission statement in the database, or hard-code them into the application?
17. Should the system auto-calculate voucher end dates based on move-in date (6 months), or manual entry?

**Payment & Financial Questions** (for Epic 3.3 & 3.4 implementation):

18. How do you receive voucher payments? (Direct deposit, check, housing authority portal?)
19. What documentation do you need to track for voucher payments? (invoices, receipts, etc.)
20. Are vouchers always the same amount per program type, or does it vary by tenant?
21. Who should record voucher payments in the system? (Manager manually, or automatic?)
22. When voucher amount < bed rent, how do you handle the gap? (Tenant pays difference? Revenue loss?)
23. Do you currently use Square for rent collection, or only for other business payments?
24. What are your Square account credentials? (Application ID, Location ID, Access Token for integration)
25. Do you want tenants to be able to pay online via credit/debit card?
26. Should tenants be able to set up recurring/automatic monthly payments?
27. What should the payment deadline be each month? (5th? 10th? 15th?)
28. Do you want to enable ACH/bank transfer payments in addition to credit cards?
29. How do you want to be notified when payments are received? (Email? SMS? Dashboard only?)

**Form Workflows** (for Epic 4.4 - Post-MVP):

30. Do you have regular contractors for maintenance, or do you handle repairs yourself?
31. For overnight requests: How far in advance must they be submitted? (assuming 1 week per house rules)
32. For overnight requests: Should tenants be notified by email, SMS, or both?
33. How long should old form submissions be retained? (grievances, maintenance, overnight requests)
34. Should maintenance requests auto-assign to specific contractors, or all go to manager for manual assignment?

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
