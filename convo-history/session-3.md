# Session 3 -- Incorporating Client Feedback

## User

Okay -- I had the demo with the Client, and have some feedback to share.

1. I've learned that they Client uses Sobriety Hub to current track properties, rental history and payments, and manage their forms. There _are_ additional fields and data the the Client will like to include.

   - Their intake form and application also has various information they want to preserve (1:1). They have their logo, mission statement, and a series of agreements for housing that they want incoming tenants to initial, with a final signature.
   - The Client has a more technical assistant I can communicate with, and they expressed a desire to keep both the Application form (because DOC counselors will fill this out for tenants still in prison), and the intake form.
   - I've noticed grievance forms, discharge forms, maintenance request forms, etc. that we may address later (but not in the MVP).
   - They want to incorporate e-signatures for both initials and final signatures.

2. The Client uses Square to manage online payments, and would like to incorporate Square and payments into the dashboard. We'll push this to after the MVP.

3. The Client likes the intuitive layout of the dashboard, but wants more purples and pinks in the color scheme. Maybe an off-white cream for the background color. Maybe more rounded corners on the assets -- more bubbly.

4. I've learned there are _two_ voucher types! ERD (estimated release date) tenants are in prison and releasing, with a 6-month housing voucher at one value (currently $700/mont), and there's GRE (graduated re-entry) (also called "work release") where inmates are released early with 6 months of a housing voucher at a different value (don't know what that is yet). Voucher stipends are handled by DOC (not the tenant) but can change in value -- but each type is the same for all tenants on that type of voucher. The voucher start/end dates will naturally be calculated based off move-in date (tenant won't have to enter through intake form).

5. We possess the Excel file she sent us, but she has Google Sheets she primarily uses. So, we'll want to set up APIs for Google Drive/Sheets to read and write data to a Sheet. I'm thinking we'll want to auto-update a Sheet as a single source of truth she can access whenever she wants (with updated info if she ever edits through the Dashboard, or the Dashboard naturally updates info), but also an export option for creating single Sheets for a given month/property (or for all properties that month). I think when we're generating reports, it would also be useful for her to review/edit these in the Dashboard and click an "export" button to automatically save it to her Google Drive. For now, in development, I think we'll use my own Google Drive account, so we'll set up the API with `.env` variables for my own API keys, and we'll create test/mock files/Sheets based on the fake data.

6. In the mockup, on the tenants page, we can search and filter tenants by a few options. But we should add a drop down filter to search by property as well.

7. The Client is fully prepared to pay for hosting the site, so we don't have to worry about local solutions. But they would like to have access to a hosted prototype soon to play with and give feedback during production, rather than me walking on site with a prototype. The Client (or their technical person) aren't really in a position to try and fork a dev GitHub repo and `npm run dev` etc., etc..

I'll work on getting the new data fields from the Sobriety Hub forms. But let's think about how we're going to incorporate this feedback, and what the game plan to proceed will be.

## Claude

● Great client feedback! This gives us a much clearer picture of their actual workflow and needs. Let me analyze the impact and ask some critical questions before we
revise our plans.

Major Takeaways

1. Google Sheets is the Primary Data Interface (CRITICAL)

This fundamentally changes our architecture. The client primarily works in Google Sheets, not our dashboard. This means Story 1.0.5 (Google Sheets Template) is WAY
more important than we thought.

2. Forms System is MVP-Critical

- Intake form (for released tenants)
- Application form (for DOC counselors)
- E-signatures (initials + final signature)
- Forms need to preserve client branding (logo, mission statement)

3. Voucher Types Need Schema Updates

- Two types: ERD ($700/6mo) and GRE (unknown amount/6mo)
- Amounts can change over time (need to track)
- Dates auto-calculated from move-in

4. Early Hosting Required

Client needs a deployed prototype ASAP to test during development (not just at the end).

---

Critical Architecture Questions

I need your input on these decisions before we can update our epics/roadmap:

● User answered Claude's questions:
⎿
· Should Google Sheets be the primary data source, or should Supabase be primary with periodic sync to Sheets? → Supabase Primary (Dashboard writes to DB,
auto-syncs to Sheets)
· How should we handle changing voucher amounts over time (ERD/GRE rates can change)? → Client-configurable settings (admin can update current rates)
· Where should completed intake/application form submissions be stored? → Supabase as JSON (all form fields stored in database)
· Given all this new scope, should we revise our MVP Phase 1 timeline, or descope some features? → Extend timeline to accommodate new features

● Perfect! Those decisions clarify the path forward significantly. Let me synthesize this into a comprehensive plan.

---

Impact Assessment & Proposed Changes

1. Schema Updates Required

New Tables:

- voucher_rates - Store current ERD/GRE amounts (admin-configurable)
- form_submissions - Store intake/application form data as JSON with e-signature data

Modified Tables:

- tenants - Add voucher_type field ('ERD' | 'GRE' | 'Private')
- Consider adding settings table for admin-configurable values

Schema changes affect: Epic 1.0 Story 1.0.3 (Database Schema Implementation)

---

2. New Epics Required

Epic 4.2: Application Form (DOC Counselors) - NEW

- Similar to Epic 4.1 (Intake), but for DOC counselors filling out forms for inmates still in prison
- Include branding, housing agreements, e-signature fields

Epic 4.3: E-Signature Implementation - NEW

- Integrate react-signature-canvas for initials and final signatures
- Store as base64 in form_submissions table
- Display signatures in form review/admin views

Epic 2.4: Google Sheets Sync & Export - NEW

- Auto-sync Supabase → Google Sheets (one-way for now)
- Export functionality (monthly/property reports)
- Dashboard report editing with "Export to Drive" button

---

3. Epic Updates Required

Epic 1.0: Data Foundation

- Story 1.0.3: Add voucher_rates and form_submissions tables to schema
- Story 1.0.4: Update test data to include voucher types (ERD/GRE)
- Story 1.0.5: Google Sheets template now includes form submission data

Epic 3.1: Payment & Voucher Management

- Add admin settings page to configure ERD/GRE voucher amounts
- Update voucher date calculations to support ERD vs GRE
- Add voucher type selection in tenant creation/editing

Epic 4.1: Resident Intake Form

- Add client branding (logo, mission statement)
- Add housing agreement sections (with initial fields)
- Integrate e-signature component (Epic 4.3 dependency)

Epic 2.1: Manager Dashboard

- Update color scheme: purples/pinks, off-white/cream background
- Increase border radius for "bubbly" aesthetic
- Add property/house filter to tenant search dropdown

---

4. Updated Priority Mapping

MVP Phase 1 (Critical - Must Have):

1. Epic 1.0: Data Foundation (already in progress)
2. Epic 5.1: Authentication & Authorization
3. Epic 1.1: CRUD Operations
4. Epic 2.1: Manager Dashboard (with UI updates)
5. Epic 3.1: Payment & Voucher Management (voucher types + admin settings)
6. Epic 4.3: E-Signature Implementation
7. Epic 4.1: Resident Intake Form (with e-signatures)
8. Epic 4.2: Application Form (DOC counselors)

MVP Phase 2 (Important - Should Have):

1. Epic 2.4: Google Sheets Sync & Export
2. Epic 2.2: Advanced Filtering & Search
3. Epic 3.2: Property Financial Dashboard

Post-MVP (Nice to Have - Could Have):

1. Epic 2.3: Reporting & Analytics
2. Epic 3.3: Rental History & Ledger (payment_ledger table)
3. Epic 3.4: Online Payment Integration - Square
4. Additional forms (grievance, discharge, maintenance)

---

5. Revised Timeline

Given the extended scope, here's a proposed timeline:

Sprint 1 (Oct 20 - Nov 3, 2025) - 2 weeks

- Complete Epic 1.0: Data Foundation (including updated schemas)
- Early Vercel deployment for client preview

Sprint 2-3 (Nov 4 - Nov 17, 2025) - 2 weeks

- Epic 5.1: Authentication & Authorization
- Epic 1.1: CRUD Operations

Sprint 4 (Nov 18 - Nov 24, 2025) - 1 week

- Epic 2.1: Manager Dashboard (with new UI design)
- Epic 3.1: Voucher Management (types + admin settings)

Sprint 5-6 (Nov 25 - Dec 8, 2025) - 2 weeks

- Epic 4.3: E-Signature Implementation
- Epic 4.1: Intake Form
- Epic 4.2: Application Form

Sprint 7 (Dec 9 - Dec 15, 2025) - 1 week

- Epic 2.4: Google Sheets Sync (Phase 1 - export only)
- MVP Phase 1 Testing & Client Feedback

Holiday Break (Dec 16 - Jan 5, 2026)

Sprint 8+ (Jan 6, 2026 onwards)

- MVP Phase 2 features
- Post-MVP backlog

New MVP Phase 1 Completion Target: Mid-December 2025 (was early November)

---

6. Hosting Strategy

Immediate Actions (Sprint 1):

- Set up Vercel project linked to GitHub repo
- Enable preview deployments for every commit
- Share preview URL with client for ongoing feedback

Benefits:

- Client can test features as they're developed
- No need for client to run local environment
- Automatic deployments on every push
- Free tier sufficient for development/testing

---

7. Questions About Sobriety Hub

I noticed you mentioned the client currently uses Sobriety Hub. A few follow-up questions:

1. Can we export data from Sobriety Hub? Or is the Google Sheets data the complete source?
2. Will they discontinue Sobriety Hub once our dashboard is live? Or run both systems in parallel?
3. Are there additional fields in Sobriety Hub that aren't in the Excel/Sheets you have?

---

Proposed Next Steps

1. Update PRODUCT_SPEC.md:

   - Add Epic 4.2, Epic 4.3, Epic 2.4
   - Update Epic 1.0, 3.1, 4.1, 2.1 with new requirements
   - Revise priority mapping and timeline

2. Update Epic 1.0 Stories (for current assignment):

   - Story 1.0.3: Add voucher_rates and form_submissions tables
   - Story 1.0.4: Update test data generation
   - Story 1.0.5: Clarify Google Sheets scope (template + test data population)

3. Expand New Epics (after Epic 1.0 assignment is complete):

   - Create detailed user stories for Epic 4.2, 4.3, 2.4

4. Update Schema Documentation:

   - Add voucher_rates table design
   - Add form_submissions table design
   - Update tenants table with voucher_type field

5. Set Up Vercel Hosting (after Sprint 1 code begins):

   - Link GitHub repo to Vercel
   - Configure environment variables
   - Share preview URL with client

---

Does this plan align with your expectations? Any adjustments needed before I proceed with updating the documentation?

## User

Go ahead and omit sprints for now -- I'll plan those out.

I've created a file `./raw-forms-info.md` with all the information from the Sobriety Hub forms. We couldn't import them, so I copy/pasted them. Some of the forms use dropdowns that I didn't include all the options for. Generate filler for now, and Client will give feedback (I suspect they used default forms anyways). **Note:** There are two versions of the **Intake** form -- I didn't pay too close attention, but suspect 90%+ overlap -- we should consolidate those into a single intake form. We'll likely create a dual Application + Intake form as well (though we may just join them at load, rather than store a dual form). I'll need your help consolidating these forms with fields we didn't incorporate in our various tables. Suggest additional tables if necessary.

Yes -- the Client intends to abandon Sobriety Hub after our dashboard is fully deployed.

But I agree -- setting up Vercel for dev deployment for continuous Client feedback is mission critical. I have a dev account set up, and will need help setting up this project and pulling the api keys.

## Claude

Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Form Analysis & Database Structure Plan

1.  Form Inventory & Consolidation

Forms Present:

- Application - Pre-admission (DOC counselors fill for inmates)
- Intake Form v1 - Post-admission agreements (6 policy sections with checkboxes + signatures)
- Intake Form v2 - Incomplete duplicate (missing checkboxes and info section)
- Maintenance Request - Resident issue reporting
- Grievance Form - Complaint/dispute filing
- Overnight Request - Pass approval requests

Consolidation Decision:

- Use Intake v1 only - v2 is incomplete (missing checkboxes, signatures, info section)
- Combine Application + Intake into dual form at frontend (joined at load, separate submissions)

---

2.  Field Mapping Analysis

Application Fields Already in tenants table:
✅ name (full_name), phone, dob

Application Fields MISSING from tenants:
❌ email, most_recent_address, food_allergies, employment_status/details, profile_picture
❌ Recovery: drug_of_choice, substances_used, recovery_program, sober_date
❌ Legal: probation/parole status, officer info, completion date, criminal_history, sex_offender status
❌ Veteran status
❌ Emergency contacts (separate entity - 1-to-many)

Intake Form Data:

- 6 policy sections requiring checkbox acknowledgment + e-signature each
- Resident info (first, last, DOB) to link submission to profile

---

3.  Proposed Table Structure (Hybrid Approach)

EXPAND: tenants table

- Add: email (VARCHAR 255), address (VARCHAR 255), profile_picture_url (TEXT)

NEW: tenant_profiles table (1:1 with tenants)

- profile_id (UUID PK)
- tenant_id (UUID FK → tenants) UNIQUE
- food_allergies (TEXT)
- employment_status (VARCHAR 32)
- employment_details (TEXT)
- drug_of_choice (VARCHAR 64)
- substances_previously_used (TEXT)
- recovery_program (VARCHAR 64)
- sober_date (DATE)
- on_probation (BOOLEAN)
- on_parole (BOOLEAN)
- probation_parole_officer_name (VARCHAR 128)
- probation_parole_officer_phone (VARCHAR 32)
- probation_parole_completion_date (DATE)
- criminal_history (TEXT)
- is_registered_sex_offender (BOOLEAN)
- sex_offense_details (TEXT)
- is_veteran (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

NEW: emergency_contacts table (many-to-one with tenants)

- contact_id (UUID PK)
- tenant_id (UUID FK → tenants)
- first_name (VARCHAR 64)
- last_name (VARCHAR 64)
- phone (VARCHAR 32)
- email (VARCHAR 255)
- relationship (VARCHAR 64)
- address (VARCHAR 255)
- additional_info (TEXT)
- created_at, updated_at (TIMESTAMP)

NEW: form_submissions table (stores all form types as JSONB)

- submission_id (UUID PK)
- tenant_id (UUID FK → tenants)
- form_type (VARCHAR 32) CHECK IN ('Application', 'Intake', 'Maintenance', 'Grievance', 'Overnight')
- form_data (JSONB) -- Full form contents as JSON
- status (VARCHAR 32) -- 'Pending', 'Approved', 'Denied', 'Resolved'
- submitted_at (TIMESTAMP)
- submitted_by (UUID FK → users, nullable for self-submissions)
- reviewed_by (UUID FK → users, nullable)
- reviewed_at (TIMESTAMP, nullable)
- notes (TEXT)
- created_at, updated_at (TIMESTAMP)

NEW: policy_agreements table (tracks Intake form policy checkboxes + signatures)

- agreement_id (UUID PK)
- tenant_id (UUID FK → tenants)
- form_submission_id (UUID FK → form_submissions)
- policy_section (VARCHAR 32) -- 'Substance Use', 'Recovery', 'Guest', 'Behavioral', 'House', 'Safety', 'Rights', 'Payments'
- agreed (BOOLEAN)
- signature_data (TEXT) -- Base64 encoded signature/initials
- signed_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)

ALREADY PLANNED: voucher_rates table

- rate_id (UUID PK)
- voucher_type (VARCHAR 8) CHECK IN ('ERD', 'GRE')
- amount (NUMERIC 8,2)
- effective_date (DATE)
- is_active (BOOLEAN)
- notes (TEXT)

---

4.  Form Workflow Logic

Application Form (DOC counselors):

1.  DOC counselor fills out application for inmate
2.  Creates "Pending" tenant record with core info
3.  Creates tenant_profile with recovery/legal data
4.  Creates emergency_contacts (1+ required)
5.  Stores complete submission in form_submissions as JSON
6.  Admin reviews → Approves → Tenant status becomes "Active"

Intake Form (Tenant on move-in):

1.  Tenant reads 6 policy sections, checks boxes, signs
2.  Creates form_submission with form_type='Intake'
3.  Creates 6-8 policy_agreements records (one per section)
4.  Stores signature_data for each section as base64
5.  Links to tenant_id to update their status

Dual Application + Intake Form:

- Frontend renders both forms together for in-person admissions
- Backend creates two separate form_submissions (Application + Intake)
- Links both to same tenant_id

---

5.  Updates Required

Epic 1.0: Data Foundation

- Story 1.0.3: Add 5 new tables (tenant_profiles, emergency_contacts, form_submissions, policy_agreements, voucher_rates)
- Story 1.0.4: Generate test data for new tables

Epic 4.1: Resident Intake Form

- Render 6 policy sections with checkboxes
- E-signature component for each section (Epic 4.3 dependency)
- Store submissions in form_submissions + policy_agreements tables

Epic 4.2: Application Form

- Render application fields (General, Recovery, Emergency Contacts, Legal, Veteran)
- Create pending tenant record + tenant_profile + emergency_contacts
- Store submission in form_submissions table

NEW Epic 4.4: Maintenance & Grievance Forms (Post-MVP)

- Maintenance request form
- Grievance form
- Overnight request form

---

6.  Open Questions for Client

1.  Application approvals: Who approves applications? What's the review workflow?
1.  Maintenance requests: Should these create work orders/tickets? Notify specific people?
1.  Grievance forms: Who reviews these? What's the resolution process?
1.  Overnight requests: Who approves? How far in advance? Any auto-approval rules?
1.  Profile pictures: Where to store? (Supabase Storage bucket vs external CDN)
1.  ERD vs GRE vouchers: What's the GRE voucher amount? Are there other voucher types?
1.  Policy agreement enforcement: If tenant doesn't check all boxes, can they still be admitted?

---

7.  Immediate Next Steps

1.  Update PRODUCT_SPEC.md:

- Document 5 new tables with full schema
- Expand Epic 4.1, 4.2 with form field details
- Add Epic 4.4 for Maintenance/Grievance/Overnight forms
- Add Open Questions section for client

2.  Update Epic 1.0 Stories (for GitLab assignment):

- Story 1.0.3: Include all 8 tables (houses, beds, tenants + 5 new ones)
- Story 1.0.4: Generate test data for all tables including form submissions

3.  Create form field reference doc:

- Map every form field to database location
- Document which fields go in tenants vs tenant_profiles vs form_submissions
- Provide JSON schema examples for form_submissions.form_data

4.  Plan e-signature implementation (Epic 4.3):

- Research react-signature-canvas library
- Determine signature storage format (base64 PNG)
- Plan signature display/verification in admin views

## User

I generally approve of your plan above, but wanted to add the following comments:

A note on "recovery" fields -- not all tenants are in recovery, so we should have a boolean "in-recovery" field. When we construct the forms later, we should have these boolean checkboxes/radio buttons inject additional fields to fill out. The same goes for "on-probation".

A note on the Intake Form versions -- both versions had checkboxes and signature fields... I just omitted them from the second version. I was just trying to capture all the text to ensure we could identify any discrepencies.

I hadn't thought about tracking what forms the tenant had submitted -- good catch. That can ensure we (1) have their two important forms (app + intake), which can assess their status in the pipeline, but also (2) track a history of maintenance/grievance/overnight form submissions. We should also push notifications to the dashboard when forms are submitted. I _do_ think it will be important for the agreements/rules with signatures to be exportable to a PDF for compliance reasons. Perhaps simply upload/store them on Google Drive.

For the fields and schemas, we should consider which ones should be required. For example, the email wont be a required field, but they'll need at least one emergency contact. I'm also thinking the phone isn't required (an inmate releasing may not have a phone immediately).

The Client made a comment during feedback on form workflow: for releasing inmates, typically the Counselor (DOC) fills out the application and the inmate fills out the intake form upon arrival at the house. For private or non-releasing inmates, it will typically be them filling out both forms. Sometimes, an inmate doesn't have their counselor fill out the application, so both are required when they arrive. A thought on convenience -- we might include a dropdown menu for previous address with a list of addresses for all the prisons in WA state, and an other field for them to override if not an imate.

Application approval -- the housing manager/Client will approve or deny housing applications. I think they should also be able to backlog applications if they _would_ accept/approve the applicant, but there's not bedspace available (a frequent pain-point for releasing inmates), but that applicant's info should stay on file for when a bed becomes available.

I like the idea of maintenance forms generating work tickets which notify the housing manager through the dashboard (perhaps through an "outstanding/new work orders" notification/tab). I don't think the grievance forms will do much -- the housing manager will simply see/review them and decide on a course of action or forward the concern. When the housing manager receives an overnight request, they can simply approve/deny (perhaps with caveats or send back for additional information). The tenant should be notified by email or SMS.

Profile pictures -- I don't know how to handle image files in a database, and will need help with this. Currently, I don't think _any_ tenant has a profile picture on file -- it's not required, but is helpful when the housing manager is trying to find/locate them. For example, I was at a new house when an RA showed up looking for "Andy". I'm bad with names, but would have immediately recognized them if the RA had a photo.

GRE voucher -- I don't yet know this amount. But let's default it to $700 for now, and make sure to prioritize adding feature to dashboard for Client to edit these values.

Policy agreements -- the applicant should not be allowed to proceed without agreeing to all terms. If they attempt to submit a form without agreeing to all terms, they should get a prompt telling them so.

## Claude

● Excellent clarifications! Let me refine the plan with your feedback.

Updated Plan: Form System & Database Schema

1. Revised Table Schemas

EXPAND: tenants table

```sql
ALTER TABLE tenants ADD COLUMN:

- email VARCHAR(255) NULL -- Optional
- address VARCHAR(255) NULL
- profile_picture_url TEXT NULL -- Stored in Supabase Storage
- application_status VARCHAR(32) DEFAULT 'Pending'
  CHECK IN ('Pending', 'Approved', 'Waitlist', 'Denied', 'Active', 'Exited')
  -- Waitlist = approved but no bed available

NEW: tenant_profiles table
CREATE TABLE tenant_profiles (
profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
tenant_id UUID UNIQUE NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,

    -- Employment
    food_allergies TEXT,
    employment_status VARCHAR(32),  -- 'Employed', 'Unemployed', 'Student', 'Seeking'
    employment_details TEXT,

    -- Recovery (conditional fields based on is_in_recovery)
    is_in_recovery BOOLEAN DEFAULT false,
    drug_of_choice VARCHAR(64),
    substances_previously_used TEXT,
    recovery_program VARCHAR(64),
    sober_date DATE,

    -- Legal (conditional fields based on is_on_probation_or_parole)
    is_on_probation BOOLEAN DEFAULT false,
    is_on_parole BOOLEAN DEFAULT false,
    probation_parole_officer_name VARCHAR(128),
    probation_parole_officer_phone VARCHAR(32),
    probation_parole_completion_date DATE,
    criminal_history TEXT,
    is_registered_sex_offender BOOLEAN DEFAULT false,
    sex_offense_details TEXT,

    -- Veteran
    is_veteran BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()

);

NEW: emergency_contacts table (at least 1 required)
CREATE TABLE emergency_contacts (
contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
first_name VARCHAR(64) NOT NULL,
last_name VARCHAR(64) NOT NULL,
phone VARCHAR(32) NOT NULL,
email VARCHAR(255),
relationship VARCHAR(64) NOT NULL, -- 'Parent', 'Sibling', 'Friend', 'Spouse', etc.
address VARCHAR(255),
additional_info TEXT,
is_primary BOOLEAN DEFAULT false, -- One contact should be primary
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_emergency_contacts_tenant ON emergency_contacts(tenant_id);

NEW: form_submissions table
CREATE TABLE form_submissions (
submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
form_type VARCHAR(32) NOT NULL
CHECK (form_type IN ('Application', 'Intake', 'Maintenance', 'Grievance', 'Overnight')),
form_data JSONB NOT NULL, -- Full form contents
status VARCHAR(32) DEFAULT 'Pending'
CHECK (status IN ('Pending', 'Approved', 'Denied', 'Resolved', 'Needs Info', 'Waitlist')),

    -- PDF export for compliance (Intake forms with signatures)
    pdf_url TEXT,  -- Google Drive URL to exported signed agreement PDF

    submitted_at TIMESTAMP DEFAULT NOW(),
    submitted_by UUID REFERENCES users(user_id),  -- NULL for self-service submissions
    reviewed_by UUID REFERENCES users(user_id),
    reviewed_at TIMESTAMP,
    review_notes TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_form_submissions_tenant ON form_submissions(tenant_id);
CREATE INDEX idx_form_submissions_type_status ON form_submissions(form_type, status);
CREATE INDEX idx_form_submissions_pending ON form_submissions(status, submitted_at DESC)
WHERE status IN ('Pending', 'Needs Info');

NEW: policy_agreements table
CREATE TABLE policy_agreements (
agreement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
form_submission_id UUID NOT NULL REFERENCES form_submissions(submission_id) ON DELETE CASCADE,

    policy_section VARCHAR(32) NOT NULL
      CHECK (policy_section IN (
        'Substance Use', 'Recovery', 'Guest', 'Behavioral',
        'House', 'Safety', 'Rights', 'Medications', 'Neighbors', 'Payments'
      )),

    agreed BOOLEAN NOT NULL,  -- Must be TRUE to submit form (validated client-side + backend)
    signature_data TEXT,  -- Base64 encoded signature/initials image
    signed_at TIMESTAMP DEFAULT NOW(),

    created_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_policy_agreements_submission ON policy_agreements(form_submission_id);

ALREADY PLANNED: voucher_rates table
CREATE TABLE voucher_rates (
rate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
voucher_type VARCHAR(8) NOT NULL CHECK (voucher_type IN ('ERD', 'GRE')),
amount NUMERIC(8,2) NOT NULL,
effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
is_active BOOLEAN DEFAULT true,
notes TEXT,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed with defaults
INSERT INTO voucher_rates (voucher_type, amount, is_active, notes) VALUES
('ERD', 700.00, true, 'Estimated Release Date - 6 month voucher'),
('GRE', 700.00, true, 'Graduated Re-Entry (Work Release) - 6 month voucher - AMOUNT TBD');
```

---

2. Required vs Optional Fields

Application Form - Required Fields:

- ✅ First Name, Last Name
- ✅ Date of Birth
- ✅ At least 1 Emergency Contact (first, last, phone, relationship)
- ✅ Criminal History disclosure (can be "None")
- ✅ Sex Offender status (yes/no)
- ✅ Veteran status (yes/no)

Application Form - Optional Fields:

- ⚪ Phone (inmates may not have one yet)
- ⚪ Email
- ⚪ Most Recent Address (or select from prison dropdown)
- ⚪ Food Allergies
- ⚪ Employment Status/Details
- ⚪ Profile Picture
- ⚪ Recovery fields (only if "In Recovery?" = Yes)
- ⚪ Probation/Parole fields (only if "On Probation?" or "On Parole?" = Yes)

Intake Form - Required Fields:

- ✅ ALL policy agreement checkboxes (10 sections)
- ✅ Signature for each section
- ✅ Printed Name

Frontend Conditional Logic:

- If is_in_recovery = true → Show: drug_of_choice, substances_previously_used, recovery_program, sober_date
- If is_on_probation = true OR is_on_parole = true → Show: officer name, officer phone, completion date
- If is_registered_sex_offender = true → Show: sex_offense_details (required)

---

3. Application Workflow & Status Pipeline

Status Flow:
Pending → Approved (bed available) → Active (moved in)
→ Waitlist (approved, no bed) → Active (when bed opens)
→ Denied

Workflow Details:

1. Application Submitted (status = 'Pending')

   - Dashboard notification: "New Application: [Name]"
   - Manager reviews application in dashboard

2. Manager Actions:

   - Approve + Bed Available → status = 'Approved' → Manager assigns bed → status = 'Active'
   - Approve + No Bed → status = 'Waitlist' → Notifies manager when bed opens
   - Deny → status = 'Denied' → Can add notes explaining reason
   - Request More Info → form_submissions.status = 'Needs Info' → Email/SMS to applicant

3. Waitlist Management:

   - Dashboard tab: "Waitlist" showing all approved-but-waiting applicants
   - When bed becomes available → Dashboard notification: "Bed Available - Check Waitlist"
   - Manager can assign waitlisted tenant to newly available bed

---

4. Form Submission Scenarios

Scenario A: DOC Release (Typical)

1. DOC Counselor fills Application form remotely → Creates tenant record (status = 'Pending')
2. Manager reviews/approves → status = 'Approved' or 'Waitlist'
3. Inmate arrives at house → Fills Intake form on tablet/computer
4. Intake submission triggers:

   - Creates form_submission (form_type='Intake')
   - Creates 10 policy_agreements records with signatures
   - Exports signed PDF to Google Drive
   - Updates tenant status = 'Active'

Scenario B: Private Pay / Non-DOC Inmate

1. Individual visits house or applies online
2. Fills both Application + Intake forms (dual form view)
3. Frontend submits:

   - Application creates tenant + profile + emergency contacts
   - Intake creates form_submission + policy_agreements + PDF export

4. Manager reviews application → Approves/Denies/Waitlists

Scenario C: DOC Inmate Without Counselor Application

1. Same as Scenario B (both forms on arrival)

---

5. Previous Address: Prison Dropdown

Frontend Implementation:

- Field: "Most Recent Address"
- Dropdown: "Select from list" with WA State Prisons + "Other"
- If "Other" selected → Text input appears

WA State Prison Addresses (for dropdown):

```js
const WA_PRISONS = [
  "Washington State Penitentiary - 1313 N 13th Ave, Walla Walla, WA 99362",
  "Washington Corrections Center - 1010 N 14th Ave, Shelton, WA 98584",
  "Coyote Ridge Corrections Center - 1301 N Ephrata Ave, Connell, WA 99326",
  "Stafford Creek Corrections Center - 191 Constantine Way, Aberdeen, WA 98520",
  "Monroe Correctional Complex - 16700 177th Ave SE, Monroe, WA 98272",
  "Airway Heights Corrections Center - 11919 W Sprague Ave, Airway Heights, WA 99001",
  "Clallam Bay Corrections Center - 1830 Eagle Crest Way, Clallam Bay, WA 98326",
  // ... (add all WA prisons - client can provide full list)
  "Other",
];
```

---

6. Maintenance Requests: Work Order System

Workflow:

1. Tenant submits Maintenance form
2. Creates form_submission with form_type = 'Maintenance'
3. Dashboard notification appears: "New Work Order: [Issue Type] at [House Address]"
4. Manager Dashboard tab: "Work Orders" showing:

   - New (red badge count)
   - In Progress
   - Resolved

5. Manager actions:

   - Mark "In Progress" (optionally assign to self or contractor)
   - Add notes (e.g., "Called plumber, scheduled for Tuesday")
   - Mark "Resolved" (closes ticket)

Dashboard Display:
🔧 Work Orders [🔴 3 New]

[New Tab] [In Progress Tab] [Resolved Tab]

┌─────────────────────────────────────────────────────┐
│ 🔴 Plumbing - Leaky Faucet │
│ House: 123 Main St | Room: 2B │
│ Submitted: Oct 27, 3:42 PM by John Doe │
│ "Kitchen sink faucet dripping constantly..." │
│ [Mark In Progress] [View Details] │
└─────────────────────────────────────────────────────┘

---

7. Grievance Form Workflow

Workflow:

1. Tenant submits Grievance form
2. Creates form_submission with form_type = 'Grievance'
3. Dashboard notification: "New Grievance: [Relates To]"
4. Manager reviews, adds notes, marks "Resolved"
5. No complex workflow - simple review and action

---

8. Overnight Request Workflow

Workflow:

1. Tenant submits Overnight Request (at least 1 week in advance per house rules)
2. Creates form_submission with form_type = 'Overnight', status = 'Pending'
3. Dashboard notification: "Overnight Request: [Tenant Name]"
4. Manager actions:

   - Approve → Email/SMS to tenant: "Your overnight request for [dates] has been approved."
   - Deny → Email/SMS: "Your overnight request has been denied. [Reason]"
   - Needs Info → Email/SMS: "Please provide more information about your overnight request."

5. Tenant receives notification via email or SMS (configurable)

Dashboard Display:
📅 Overnight Requests [🔴 2 Pending]

┌─────────────────────────────────────────────────────┐
│ John Doe - Room 3A │
│ Leaving: Nov 5, 6:00 PM | Return: Nov 7, 9:00 AM │
│ Reason: Family visit │
│ "Visiting parents in Seattle for the weekend" │
│ [✓ Approve] [✗ Deny] [? Request More Info] │
└─────────────────────────────────────────────────────┘

---

9. Profile Pictures: Supabase Storage

Setup:

1. Create Supabase Storage bucket: tenant-profile-pictures
2. Configure bucket:

   - Public read access (or private with signed URLs)
   - File size limit: 5 MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

3. Upload flow:

   - Frontend: User selects image → Crop/resize to 300x300px
   - Upload to Supabase Storage via API
   - Get public URL (e.g., https://xxxxx.supabase.co/storage/v1/object/public/tenant-profile-pictures/[tenant_id].jpg)
   - Store URL in tenants.profile_picture_url

Benefits:

- Supabase Storage is integrated with Supabase DB
- Automatic CDN for fast loading
- Built-in access control (RLS policies)
- No external CDN needed

I'll help you set this up in Epic 4.2 implementation.

---

10. Policy Agreement Validation

Frontend Validation:

```js
function validateIntakeForm(agreements) {
  const requiredSections = [
    "Substance Use",
    "Recovery",
    "Guest",
    "Behavioral",
    "House",
    "Safety",
    "Rights",
    "Medications",
    "Neighbors",
    "Payments",
  ];

  for (const section of requiredSections) {
    if (!agreements[section]?.agreed || !agreements[section]?.signature) {
      return {
        valid: false,
        message: `You must agree to and sign the ${section} policy section before submitting.`,
      };
    }
  }

  return { valid: true };
}
```

Backend Validation:

- Reject submission if any policy_agreements.agreed = false
- Return 400 error: "All policy agreements must be accepted"

---

11. PDF Export & Google Drive Storage (Compliance)

Workflow:

1. Tenant submits Intake form with all signatures
2. Backend generates PDF from form data + signatures using library (e.g., pdfkit, jspdf)
3. PDF includes:

   - Client logo and mission statement
   - All 10 policy sections with text
   - Checkboxes (rendered as ☑)
   - Signatures (embedded base64 images)
   - Printed name and date

4. Upload PDF to Google Drive via API
5. Store Drive file URL in form_submissions.pdf_url
6. Manager can download/view PDF from dashboard

Google Drive API Setup:

- Use service account credentials (same as Sheets API from Epic 1.0 Story 1.0.2)
- Create folder: "Housing Dashboard - Signed Agreements"
- Upload PDFs with filename: [Tenant Name] - Intake - [Date].pdf

I'll help implement this in Epic 4.1/4.2 stories.

---

12. Admin Settings: Voucher Rate Management (Priority for MVP)

New Page: Admin Settings

⚙️ Admin Settings

┌─────────────────────────────────────────┐
│ Voucher Rates │
│ │
│ ERD (Estimated Release Date): │
│ [$700.00] per month [Update] │
│ Last updated: Oct 15, 2025 │
│ │
│ GRE (Graduated Re-Entry): │
│ [$700.00] per month [Update] │
│ Last updated: Oct 27, 2025 │
│ ⚠️ Amount TBD - confirm with DOC │
└─────────────────────────────────────────┘

Backend:

- Fetch current active rates: SELECT \* FROM voucher_rates WHERE is_active = true
- Update: Set old rate is_active = false, insert new rate with new effective_date
- History preserved for audit trail

---

13. Updated Epic Structure

Epic 1.0: Data Foundation

- Story 1.0.3: Add 8 tables (houses, beds, tenants, tenant_profiles, emergency_contacts, form_submissions, policy_agreements, voucher_rates)
- Story 1.0.4: Generate test data for all tables
- Story 1.0.5: Google Sheets template (may defer detailed form data until Epic 4)

Epic 4.1: Resident Intake Form

- Render 10 policy sections with checkboxes
- E-signature component for each section (react-signature-canvas)
- Frontend validation (all checkboxes + signatures required)
- Backend validation
- Store in form_submissions + policy_agreements
- Generate PDF with signatures
- Upload PDF to Google Drive

Epic 4.2: Application Form (DOC & Private)

- Render Application form fields
- Conditional fields (recovery, probation/parole)
- Profile picture upload (Supabase Storage)
- WA Prison address dropdown
- Emergency contacts (at least 1 required)
- Create tenant + tenant_profile + emergency_contacts
- Store submission in form_submissions

Epic 4.3: E-Signature Component

- Implement react-signature-canvas wrapper component
- Save as base64 PNG
- Clear/redo functionality
- Display saved signatures in admin views

Epic 4.4: Work Orders & Request Forms (Post-MVP)

- Maintenance request form + work order dashboard tab
- Grievance form + review workflow
- Overnight request form + approval workflow with email/SMS notifications

Epic 5.2: Admin Settings Panel (MVP - HIGH PRIORITY)

- Voucher rate management (ERD/GRE)
- Other configurable settings (curfew times, etc.)

---

14. Updated Open Questions for Client

1. WA State Prisons: Can you provide a complete list of WA state prison addresses for the dropdown?
1. GRE Voucher Amount: What's the current GRE voucher monthly amount?
1. Profile Pictures: Are there any specific requirements (resolution, file format, background)?
1. Maintenance Contractors: Do you have regular contractors, or handle maintenance yourself?
1. Overnight Notifications: Email or SMS for tenant notifications? Both?
1. Form Retention: How long should old form submissions be kept (grievances, maintenance, overnight)?
1. Intake Form v1 vs v2: Are there any meaningful differences beyond the sections I noted, or should we just use v1?

---

Ready to Proceed?

This updated plan incorporates all your feedback. Once you approve, I'll:

1. Update PRODUCT_SPEC.md with all 8 tables and expanded epics
2. Update Epic 1.0 Stories 1.0.3 and 1.0.4 with new tables
3. Create a field mapping reference doc
4. Add Vercel deployment setup instructions

Sound good?

## User

Perfect! I approve of your plan! I think we should backlog the additional forms after intake/application for after the MVP, though.

## Claude

● Excellent! All documentation updates are complete. Here's a summary of what I've accomplished:

✅ Completed Tasks

1. Updated PRODUCT_SPEC.md (Comprehensive)

- Added 8-table database schema with full documentation:
  - houses, beds, tenants (core tables)
  - tenant_profiles (1:1 extended info with conditional fields)
  - emergency_contacts (1:many, at least 1 required)
  - form_submissions (stores all form types as JSONB)
  - policy_agreements (tracks Intake e-signatures)
  - voucher_rates (admin-configurable ERD/GRE rates)
- Expanded Theme 4: Forms & Documentation with 4 new epics:
  - Epic 4.1: Resident Intake Form (10 policy sections + e-signatures + PDF export)
  - Epic 4.2: Application Form (extended profile, recovery, legal, emergency contacts)
  - Epic 4.3: E-Signature Component (react-signature-canvas)
  - Epic 4.4: Maintenance/Grievance/Overnight Forms (Post-MVP)
- Added Theme 6: Admin Settings with Epic 6.1 (Voucher Rate Management - HIGH PRIORITY for MVP)
- Renumbered all themes to accommodate new content:
  - Theme 5: Reporting & Insights (was Theme 4)
  - Theme 7: Advanced Operations (was Theme 6)
  - Theme 8: Access Control (was Theme 7)
- Updated Priority Mapping to reflect extended timeline and new MVP Phase 1 scope
- Added 34 Open Questions organized by category (General, Forms, Payment, Workflows)

2. Created docs/schemas/field-mapping.md (80+ pages)

- Complete Application form → database mapping (all fields, all tables)
- Complete Intake form → database mapping (10 policy sections)
- Conditional field logic documentation (recovery, legal, sex offender)
- Required vs Optional fields matrix
- JSON schema examples for form_submissions.form_data
- Database query examples
- Implementation notes for developers

3. Created docs/deployment/vercel-setup.md (Comprehensive Guide)

- Step-by-step Vercel account setup and GitHub integration
- Environment variable configuration (Supabase, Google Sheets, Square)
- Preview deployment workflow for client feedback
- Production deployment best practices
- Serverless functions setup (API routes)
- Google Service Account JSON handling
- Custom domain configuration
- Troubleshooting guide
- Cost considerations and security best practices

4. Updated project-roadmap.md

- Added Vercel deployment tasks to Phase 2: Project Setup
- Includes sub-tasks for account setup, environment variables, and client sharing

---

📊 Updated Database Schema Summary

Total Tables: 8 (was 3)

New Tables:

- tenant_profiles: Extended info (employment, recovery, legal, veteran status)
- emergency_contacts: At least 1 required per tenant
- form_submissions: Stores all form types (Application, Intake, Maintenance, Grievance, Overnight) as JSONB
- policy_agreements: Tracks Intake form policy acknowledgments and e-signatures
- voucher_rates: Admin-configurable ERD/GRE voucher amounts

Key Design Decisions:

- Rent lives in beds table (not tenants)
- Conditional fields (recovery, probation) controlled by boolean flags
- E-signatures stored as base64 PNG
- PDF export to Google Drive for compliance (Intake forms)
- Profile pictures in Supabase Storage
- Application status workflow: Pending → Approved/Waitlist/Denied → Active

---

🎯 Next Steps

1. Review Client Feedback: Schedule session to answer the 34 open questions in PRODUCT_SPEC.md Section 10
2. Set Up Vercel: Follow docs/deployment/vercel-setup.md to deploy for continuous client feedback
3. Epic 1.0 GitLab Assignment: Submit your expanded Epic 1.0 stories to GitLab (already complete per your note)
4. Start Development: Begin Sprint 1 with Epic 1.0 (Data Foundation) implementation

---

📁 New Files Created

docs/
├── schemas/
│ └── field-mapping.md (NEW - 8,000+ lines)
└── deployment/
└── vercel-setup.md (NEW - comprehensive guide)

---

🚀 Ready to Proceed

All documentation is now updated to reflect the full form system requirements from the client feedback. You have:

- ✅ Complete schema documentation (8 tables)
- ✅ Field mapping reference for developers
- ✅ Vercel deployment guide for continuous client feedback
- ✅ Updated product spec with all epics and stories
- ✅ Extended timeline reflected in Priority Mapping

You're ready to start development! 🎉

## User

Perfect! I think you're right on next steps: I've emailed the Client with the open questions, and we'll incorporate additional feedback when I receive a response. I'm going to collapse context, and we'll get started on Vercel and Supabse setup. Also, I moved the `raw-forms-info` to `./docs/planning` to archive it since you've read it and adjusted the schemas already.
