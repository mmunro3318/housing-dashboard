# Track Convos with Claude for this Project

## Session 1 -- Brainstorming

### User

Perfect! I'm just beginning this project, and am still fleshing out the roadmap, features, and UI design. Right now, I need your help doing just this -- let's take an Agile/Scrum approach and start going through the phases. We're in "requirements/gathering" right now, and have a good tech stack but need to begin explicitly defining features and breaking this project down into Epics and User Stories, then we'll go in and break those User Stories into tasks/specific action items. This will help both me _and_ you stay on track. Where should we start?

### Claude

● Great approach! Let's structure this systematically. Since we're in requirements gathering and you want to use Agile/Scrum methodology, here's how I recommend we proceed:

Recommended Starting Point

Start with User Personas & User Journey Mapping before diving into Epics and User Stories. Here's why:

1. Identify Your Users First

   - Who are the primary users? (Managers, residents, DOC stakeholders, admin staff?)
   - What are their pain points with the current Excel system?
   - What are their technical skill levels?
   - What devices will they use? (Desktop only? Mobile?)

2. Map Current vs. Future Workflows

   - Document how things work NOW (the chaotic Excel process)
   - Define how things SHOULD work (the streamlined dashboard process)
   - Identify the biggest pain points to prioritize

3. Then Build the Backlog Structure:

   - Themes → High-level business objectives
   - Epics → Large bodies of work (aligned with your milestones)
   - User Stories → Specific user-facing functionality
   - Tasks → Technical implementation steps

Proposed Plan

Here's what I suggest we do in order:

Phase 1: Discovery (Now)

1. Define User Personas (3-5 key user types)
2. Document current pain points from the Excel workflow
3. Prioritize features using MoSCoW method (Must/Should/Could/Won't)

Phase 2: Backlog Creation

4. Create Themes (3-4 high-level objectives like "Resident Management", "Occupancy Tracking")
5. Break Themes into Epics (aligned with your 5 milestones + future features)
6. Write User Stories for each Epic (using "As a [user], I want [goal], so that [benefit]")
7. Estimate and prioritize stories (t-shirt sizing or story points)

Phase 3: Sprint 0 Planning

8. Break first sprint's stories into tasks
9. Define Definition of Done for stories
10. Set up project board (GitHub Projects, Jira, or Trello)

My Question for You

Which would you prefer to start with?

Option A: I help you define user personas and pain points first (recommended - 30 min exercise)

Option B: We jump straight into creating Epics from your existing milestones and then work backwards to personas

Option C: You already have personas/pain points documented, and we should start breaking down Epics

Also: Do you have access to your manager/client to validate requirements, or are we working from the Excel data and your understanding of their needs?

### User

Let me go through and answer your questions.

1. Identify Users

- The primary users will be the housing manager that needs to track their properties. Secondary users will be new tenants that need to fill out intake forms. For the stretch goal, I'd like DOC officials to be able to make accounts to track available beds or register for reports on available beds.
- Currently, the housing manager has no technical skills and has been attempting to track everything through an Excel sheet. It's cumbersome for her, and she frequently begins to use fields innapropriately to add comments -- leading to inconcistent data across properties and cluttered/difficult to access rental history.

2. Current and Future Workflows

- Currently, I'm not quite sure what her workflow looks like -- just that she only uses the Excel file, and then manually writes reports by checking Excel for info. Currently, it's difficult for her to track tenants, and which tenants are releasing from prison and assigned to one of her properties (resulting in new tenants just "showing up" with no warning to the other residents or house RA).
- She wants to have an easy dashboard to view and track properties/tenants and available beds, but she also wants the dashboard to generate intelligent reports at the click of a button (pulling all relevant info automatically). She wants to eventually have the dashboard leverage an LLM to take that data/report and write documents like grant proposals and non-profit audits, etc.. She has expressed explicit interest in having an intake form for new tenants to fill out their own info (rather than her going to each property and attempting to track them down and manually fill these forms out herself). Stakeholders should automatically informed about new arrivals and impending voucher expirations.
- Priorities: (1) basic CRUD app to track and manage properties and tenants, (2) intake form for new tenants, (3) track payments and rental history, (4) be alerted to new arrivals and empty (or about to be empty) beds.

3. Backlog Structure -- This is where I'm going to struggle, and need your help. I need help extracting the themes and epics, and really scaffolding this project. In the past, I'm quick to just start coding. But this time I want to be more mindful and design and code with intent. Though I like the idea of story points (I naturally parse my own time in "build points").

Based on this, let's start with Option A and work through B and C next. Go ahead and add these to your todo list. I really like how you broke down the phases.

Client -- she doesn't communicate very well, so I have limited information to go off. Only the two data files she sent me (the 2024 Current Client Housing..., both excel and pdf). It's currently Friday, and I want a very basic mockup to show her Sunday. So I want to prioritize the MVP and showing her what the future workflow will look like so I can get proper feedback and scope. She hasn't outlined her features for me (I'm just assuming based on the data, and my observations as a tenant of hers at multiple properties).

### Claude

● Perfect! This is really helpful context. Let me work through this systematically and create a comprehensive plan for you.

User Personas (Based on Your Input)

Primary Persona: "The Housing Manager"

- Name: Property Manager Patricia
- Tech Skill: Low (struggles with Excel, no database experience)
- Current Pain Points:
  - No warning when DOC releases tenants to her properties
  - Can't easily track available beds
  - Misuses Excel fields for comments (data inconsistency)
  - Difficult to access rental history
  - Manually writes reports by searching through Excel
  - Must physically visit properties to fill intake forms
  - No visibility into voucher expirations
- Goals:
  - View all properties/tenants at a glance
  - Generate reports automatically
  - Let tenants self-register via intake form
  - Get alerts for new arrivals and voucher expirations
  - Eventually: AI-assisted grant/audit document generation

Secondary Persona: "The New Tenant"

- Name: Released Resident Randy
- Tech Skill: Variable (assume mobile-first, basic smartphone use)
- Current Pain Points:
  - Manager has to track them down for intake info
  - No self-service option
- Goals:
  - Fill out own information quickly
  - Submit intake form from anywhere (ideally mobile)

Stretch Persona: "DOC Stakeholder"

- Name: Department Officer Dana
- Tech Skill: Medium (government systems user)
- Goals:
  - Track available bed spaces across properties
  - Receive monthly reports automatically
  - Plan placements proactively

---

Themes & Epics Structure

Theme 1: Core Data Management

Foundation for tracking properties, beds, and tenants.

Epic 1.1: Property & Bed Management

- User stories for CRUD operations on houses/beds
- Bed status tracking (Available/Occupied/Pending/Hold)

Epic 1.2: Tenant Management

- User stories for CRUD operations on tenants
- Tenant-to-bed assignment
- Entry/exit date tracking

---

Theme 2: Self-Service & Automation

Reduce manual work for the manager.

Epic 2.1: Tenant Intake Form

- Self-service form for new tenants
- Mobile-friendly design
- Data validation and submission

Epic 2.2: Alerts & Notifications

- New arrival notifications
- Voucher expiration warnings
- Available bed alerts

---

Theme 3: Financial Tracking

Track payments, vouchers, and rental history.

Epic 3.1: Payment & Voucher Management

- Rent due/paid tracking
- Voucher start/end dates
- Payment type classification

Epic 3.2: Rental History & Ledger (Future)

- Transaction history per tenant
- Payment audit trail

---

Theme 4: Reporting & Insights

Generate reports and enable data-driven decisions.

Epic 4.1: Dashboard & Visualization

- Manager dashboard with key metrics
- Property occupancy view
- Tenant search/filtering

Epic 4.2: Report Generation

- One-click reports (occupancy, payments, tenants)
- Export to CSV/Google Sheets

Epic 4.3: AI-Assisted Document Generation (Stretch)

- LLM integration for grant proposals
- Non-profit audit document generation

---

Theme 5: Access Control & Security

Ensure proper authentication and data protection.

Epic 5.1: Authentication & Authorization

- Role-based access (Manager, Tenant, DOC Stakeholder)
- Secure login/logout
- Password management

---

Priority Mapping (Based on Your Needs)

Sprint 0 (Pre-Dev): Sunday Mockup Demo

Goal: Show manager what future workflow looks like

I recommend creating:

1. Clickable Figma/wireframe mockup showing:

   - Manager dashboard (property/bed overview)
   - Tenant intake form (what tenants will see)
   - Simple report example

2. Data mapping document showing how her Excel maps to the new system
3. User journey flowchart (current vs. future state)

MVP Phase 1 (Priorities 1 & 2)

- Epic 1.1: Property & Bed Management
- Epic 1.2: Tenant Management
- Epic 2.1: Tenant Intake Form
- Epic 4.1: Dashboard & Visualization (basic)
- Epic 5.1: Authentication (basic manager/tenant roles)

MVP Phase 2 (Priorities 3 & 4)

- Epic 3.1: Payment & Voucher Management
- Epic 2.2: Alerts & Notifications
- Epic 4.2: Report Generation

Post-MVP (Future)

- Epic 3.2: Rental History & Ledger
- Epic 4.3: AI-Assisted Documents
- DOC Stakeholder portal

---

Recommended Next Steps for Sunday Demo

Since you need something to show by Sunday and she doesn't communicate well, I suggest:

Option 1: Low-Fidelity Mockup (Fastest - 3-4 hours)

- Use Figma, Excalidraw, or even PowerPoint
- Show 3-5 key screens with her data
- Walk through the workflow verbally

Option 2: Static HTML Prototype (Medium - 6-8 hours)

- Create non-functional but realistic-looking dashboard
- Use her actual Excel data to populate
- Click through basic flows
- Use Tailwind/Bootstrap for quick styling

Option 3: Interactive Prototype with Real Data (Intensive - 12-16 hours)

- Parse her Excel file
- Create basic React frontend with read-only views
- Show actual properties/tenants/beds
- Most convincing but time-intensive

---

My Recommendations

For Sunday: Go with Option 2 (static HTML prototype) because:

- She's non-technical, so clickable visuals will resonate
- You can use her real data, making it feel tangible
- You'll validate assumptions before building the wrong thing
- It's achievable in a weekend

For Backlog: After the demo, we'll:

1. Refine user stories based on her feedback
2. Break MVP Phase 1 epics into tasks
3. Estimate story points for first 2-3 sprints
4. Set up project board to track progress

---

Plan Summary

I'll help you with:

Phase 1 (Now - Before Sunday)

1. Create user personas document (we just did this)
2. Build themes/epics structure (outlined above)
3. Design and build a prototype/mockup for Sunday demo
4. Prepare talking points for feedback session

Phase 2 (After Sunday Demo) 5. Refine requirements based on feedback 6. Write detailed user stories for MVP Phase 1 epics 7. Break user stories into technical tasks 8. Estimate and prioritize backlog 9. Set up project board (GitHub Projects recommended)

Phase 3 (Development Start) 10. Begin Sprint 1 with ETL/data migration 11. Set up backend and database 12. Build out frontend components

Does this direction align with what you need? Should I proceed with helping you create the Sunday prototype, or would you like to adjust the approach first?

### User

I also like Option 2 -- let's crack out a clickable demo. A pure HTML prototype is quick easy to do with ChatGPT if I can be explicit in what I want. I've never used Figma before, but I've made an account and will experiment.

I'll also want to show her the schema designs for the data of the unified database. She's non-technical, so we'll likely just provide her a list of the fields we're going to use (and not mention how we split them into tables, or use unique ids).

I'm thinking we'll nail down the schema, generate some fake/filler data to show her (so I'm not committing sensitive data to my GitHub repo).

So, I like your plan for Phase I. Let's break that into todo's (perhaps save the plan of all phases to a `todo.md` file for context preservation, so we can track immediate todo's in this session).

Should our user personas live in the README or a PDD file? I'm thinking we'll work to build out the PDD file, and I can use that with GitHub's `spec-kit` to generate a lot of actionable tasks and docs for us to reference as we get started on the full development.

Thoughts?

### Claude

● Excellent thinking! You're approaching this very strategically. Here are my thoughts:

Documentation Structure

User Personas & Requirements: Definitely put them in a Product Design Document (PDD) or PRODUCT_SPEC.md, not the README. Here's why:

- README.md: Should stay high-level (what/why/how to get started) - for external devs and stakeholders
- PDD/PRODUCT_SPEC.md: Living document for product requirements, personas, features, user stories - your single source of truth during development
- CLAUDE.md: Technical architecture and development guidance (already done)
- project-roadmap.md: Can evolve into your agile roadmap/backlog tracker

This structure works perfectly with GitHub's spec-kit - the PDD will feed into task generation.

Schema Presentation for Manager

Great call on hiding technical details. For her, present it as:

"Information We'll Track About Your Properties"

- House address
- Total beds per house
- Room/bed numbers
- Bed availability status

"Information We'll Track About Your Tenants"

- Full name, date of birth, phone
- Move-in and move-out dates
- DOC number
- Payment type (Private Pay, Voucher, etc.)
- Voucher start/end dates
- Rent amounts (due and paid)
- Notes/comments

Keep it simple, field-focused, relatable to her Excel columns.

Fake Data Strategy

Smart move for the demo. I can help you:

1. Parse her Excel structure (without committing sensitive data)
2. Generate realistic fake data that matches her patterns
3. Use that for the HTML prototype

This also lets you test the schema before real data migration.

---

Phase 1 Breakdown

Let me structure this as todos for immediate work and save the full plan separately:

Immediate Todos (This Session - Phase 1)

1. Create PRODUCT_SPEC.md with user personas, pain points, and themes/epics structure
2. Document database schema in user-friendly format for manager presentation
3. Parse Excel structure to understand data patterns (read-only, no sensitive data committed)
4. Generate fake/filler data matching real patterns for prototype
5. Design HTML prototype wireframes (key screens: dashboard, intake form, property view)
6. Build clickable HTML prototype with fake data using Tailwind/Bootstrap
7. Prepare demo talking points and feedback questions for Sunday

Supporting Documentation

8. Create todo.md to preserve full phase plan (Phases 1-3) for context
9. Update project-roadmap.md to reflect agile structure (themes/epics)

---

My Plan

I'll help you:

1. First: Create PRODUCT_SPEC.md with all personas, themes, epics we discussed
2. Second: Create todo.md with the full 3-phase plan for preservation
3. Third: Read the Excel file structure (without exposing sensitive data) to understand patterns
4. Fourth: Generate a fake dataset as JSON/CSV that matches her data structure
5. Fifth: Create schema documentation in manager-friendly format
6. Sixth: Help design and build the HTML prototype screens

For the prototype, I'm thinking we show:

- Dashboard: Grid of properties with bed counts, occupancy metrics
- Property Detail View: List of beds/tenants for a specific house
- Tenant Intake Form: What new residents will see
- Simple Report Example: Mock report output

Does this sequence work for you? Should I proceed with creating the PRODUCT_SPEC.md and todo.md files first?

### User

Perfect! I'm activating `edit mode` for you to write the appropriate files. Let's get started.

### Claude

● Perfect! Let me present my plan for what I'll create:

●User approved Claude's plan:
⎿ Plan: Phase 1 - Requirements & Sunday Demo Prep

     I'll create the following files and structure:

     1. PRODUCT_SPEC.md

     - User personas (Manager, Tenant, DOC Stakeholder)
     - Current pain points and goals
     - Themes and Epics structure (5 themes, 10+ epics)
     - Priority mapping (MVP Phase 1, Phase 2, Post-MVP)
     - User-friendly schema/field descriptions

     2. todo.md

     - Full 3-phase plan (Phase 1: Pre-Sunday, Phase 2: Post-Demo, Phase 3: Development)
     - Immediate todos for this session
     - Context preservation for future sessions

     3. Analyze Excel Structure

     - Read the Excel file to understand data patterns
     - Document column structure (without exposing sensitive data)

     4. Generate Fake Data

     - Create realistic fake dataset matching Excel patterns
     - Output as JSON files for prototype use
     - Generate 3-4 fake houses, 10-15 fake beds, 8-12 fake tenants

     5. Schema Documentation (manager-friendly)

     - Simple field list for "Houses", "Beds", "Tenants"
     - No technical jargon (no PKs, FKs, table relationships)
     - Map to her Excel columns where applicable

     6. HTML Prototype Wireframe Plan

     - Dashboard view (properties overview, metrics)
     - Property detail view (beds/tenants list)
     - Tenant intake form
     - Simple report mockup

     Ready to execute when you confirm!

### User

[confirm]

### Claude

● Perfect! Let me create a final summary for you:

🎉 Phase 1 Complete - You're Ready for Sunday!

I've successfully completed all the Phase 1 tasks to prepare you for Sunday's demo. Here's what we accomplished:

📋 Documentation Created

1. PRODUCT_SPEC.md - Complete product specification with:

   - User personas (Manager, Tenant, DOC Stakeholder)
   - 5 themes with 10+ epics and user stories
   - Priority mapping for MVP phases
   - Success metrics and open questions

2. SCHEMA_FOR_MANAGER.md - Non-technical data field guide for your client
3. EXCEL_STRUCTURE_SUMMARY.md - Complete analysis of her 37-sheet Excel file
4. todo.md - Full 3-phase roadmap from now through MVP completion
5. SUNDAY_DEMO_GUIDE.md - Step-by-step demo script with talking points and questions
6. PHASE_1_SUMMARY.md - Complete summary of everything we built

💻 Prototype Built

4 clickable HTML pages in the prototype/ folder:

- index.html - Dashboard with metrics, property overview, and alerts
- properties.html - Property cards with color-coded bed status grids
- tenants.html - Searchable/filterable tenant list
- intake-form.html - Mobile-responsive self-service intake form

All using fake data - no sensitive information included!

📊 Data Analysis

- Analyzed all 37 Excel sheets
- Generated realistic fake data (4 properties, 40 beds, 25 tenants)
- Created Python scripts for data generation and analysis
- Documented data migration strategy

🚀 How to Demo on Sunday

1. Open prototype/index.html in your browser
2. Follow the script in SUNDAY_DEMO_GUIDE.md
3. Review SCHEMA_FOR_MANAGER.md together
4. Capture her feedback for Phase 2 refinement

📁 Key Files to Review Before Sunday

1. SUNDAY_DEMO_GUIDE.md ← Read this first!
2. SCHEMA_FOR_MANAGER.md ← Share with client
3. prototype/README.md ← Understanding the prototype
4. PRODUCT_SPEC.md ← Background on requirements

✅ Everything is Ready

The prototype is fully functional, mobile-responsive, and demonstrates all core workflows. You're well-prepared to gather valuable feedback and validate your assumptions.

Good luck on Sunday! 🎯

### User

Absolutely beautiful! I've reviewed the prototype, and love its simple layout and ease of navigation.

I've noticed the intake form has erroneous fields, or is missing a few important fields. I'll review the schema and come back to you with my personal feedback, as well as feedback from the client on Sunday. I'm thinking we may want a dynamic form that can expose certain fields based on certain dropdown selections. For example, not all tenants are on DOC. Some are private citizens, some on TeleCare patients (some are both DOC _and_ TeleCare), etc.. So we have have sections that have dropdown menus or radio buttons that if `true` will expose additional fields to fill in (for example, if "On DOC" is true, we expose fields for DOC number, cco info (if known), "is on voucher", etc.). This could also affect payment type (ie, Voucher, TeleCare, Section 8, etc.). If a tenant is "ERD", that means they're currently in prison and have a release date (ERD = estimated release date) -- this means that the bed is either on hold, or will become occupied on the date the inmate releases.

A more complex feature, would be to allow a "batter's box" for beds -- the bed may be occupied now, but will be vacated by the time a new tenant arrives. This may be a stretch goal to add to the backlog.

The client may also expand in the future to include properties in other counties. Currently she only owns houses in King County, but releasing DOC tenants can be restricted to certain county. So we'll want to include a field in our schema for property county, as well as search functionality to let the manager (or DOC stakeholder) filter by county (maybe even multiple counties).

Currently, when a user clicks on a tenant in a property, a dialogue box pops up with tenant info. This is helpful for now, but we'll want to change it in the future to display a card with tenant info. We'll want to add functionality to the system to allow the manager to easily remove or relocate tenants to other properties she owns (this doesn't happen often, but is currently quite a painful process).

Currently, your voucher expiration notifications show "days". However, the system generally considers voucher by month. We might change this to "Oct", "Nov" or "1 month", "2 months", "expired", etc.

Also -- when looking at a property or bed, we'll want to see what the current rate of rent is for that property (or bed if she has varied rents). We should also display the "value" of that property in terms of max output and current output (expected rent by current occupancy vs. total rent expectation for fully occupied property). An additional complication -- Vouchers and special TeleCare payments only offer set rates no matter what (Vouchers are always $700/month). So if she has a certain rent set for the bed, but it's occupied by a Voucher tenant, the set rent should be overridden (but display the discrepency -- perhaps a blue box with what she's collecting, and a gray box for what the bed is "worth").

Thinking ahead -- certain houses are "women only", so we might include functionality to check for tenant gender to enforce that constraint. However, this may get tricky for transgender tenants without having to ask for more personal information.

Your context window is a bit used up -- so ponder this and help me plan out what we want to add/keep, backlog, or ignore. I'll approve your plan and you can update documentation before I collapse context.

### Claude

● Excellent feedback! Let me organize this strategically and help you prioritize. You're thinking ahead really well - some of these are critical for MVP, others are perfect for the backlog.

Critical Analysis & Recommendations

🔴 MUST ADD to MVP Phase 1 (Core functionality blockers)

1. Dynamic Intake Form with Conditional Fields

   - Why: Different tenant types (DOC, TeleCare, Private) need different data
   - Impact: Without this, you'll have incomplete/incorrect data from day one
   - Add to: Epic 2.1 (Tenant Intake Form)
   - Fields to add:
     - Tenant type checkboxes (DOC, TeleCare, Private Citizen - can be multiple)
     - If DOC → DOC#, CCO info, voucher checkbox
     - If TeleCare → TeleCare ID/program info
     - If ERD (pending release) → Release date field
     - Payment type dropdown (Voucher $700, TeleCare, Section 8, Private, ERD)

2. County Field for Properties

   - Why: She's planning multi-county expansion + DOC restrictions
   - Impact: Fundamental to search/filtering and future DOC stakeholder features
   - Add to: Epic 1.1 (Property Management) - just add county field to schema
   - Simple: Just add to houses table now, filter UI can come in Phase 2

3. Rent Tracking Per Bed/Property

   - Why: She needs to track financial performance per property
   - Impact: Core business metric for her operations
   - Add to: Epic 3.1 (Payment & Voucher Management) - move to MVP Phase 1
   - Fields:
     - base_rent on bed (what it's "worth")
     - actual_rent on tenant (what she's collecting - may differ for vouchers)
     - Display variance (expected vs actual)

🟡 SHOULD ADD to MVP Phase 2 (Important but can wait)

4. Tenant Relocation/Transfer Functionality

   - Why: She needs this, but it's operational not foundational
   - Add to: New Epic 1.3 - "Tenant Operations"
   - Features: Move tenant to different bed, reassign between properties
   - Can wait: Manual workaround exists (edit tenant, change bed assignment)

5. Property Financial Dashboard

   - Why: Shows revenue potential vs actual (occupied beds × rent)
   - Add to: Epic 4.1 (Dashboard) expansion
   - Metrics: Max monthly revenue, current monthly revenue, vacancy cost
   - Nice visual: Your blue box (actual) vs gray box (potential) idea is perfect

6. Month-Based Voucher Display

   - Why: More intuitive for her workflow
   - Add to: Dashboard refinement (Epic 4.1)
   - Change: "30 days" → "1 month", "Nov 2025", "Expired"

🟢 BACKLOG for Post-MVP (Valuable but not urgent)

7. "Batter's Box" / Bed Reservation System

   - Why: Complex edge case, doesn't happen often
   - Complexity: Requires bed status timeline, future occupancy tracking
   - Workaround: Use "Pending" status + notes field for now
   - Add as: New Epic (Post-MVP) - "Advanced Bed Management"

8. Gender-Based House Restrictions

   - Why: Important for compliance but not immediate blocker
   - Sensitivity: As you noted, transgender considerations need care
   - Add as: Epic 5.2 - "Compliance & Constraints" (Post-MVP)
   - Approach: Optional gender field, house rules engine, warnings not hard blocks

9. Tenant Detail Card View (vs Popup)

   - Why: Better UX but current popup works for demo
   - Add to: UI/UX improvements backlog
   - Can do: During frontend build in Sprint 2-3

❌ IGNORE / OUT OF SCOPE

- None of your suggestions should be ignored! All are valid. Just prioritized.

---

Immediate Schema Updates Needed

houses table - ADD:
county VARCHAR(64) -- e.g., "King County", "Pierce County"

beds table - ADD:
base_rent NUMERIC(8,2) -- What the bed is "worth" per month

tenants table - ADD:
tenant_type VARCHAR(32)[] -- Array: ['DOC', 'TeleCare', 'Private']
telecare_id VARCHAR(64) -- TeleCare program ID if applicable
cco_name VARCHAR(255) -- Community Corrections Officer
cco_phone VARCHAR(32) -- CCO contact number
is_erd BOOLEAN -- TRUE if pending release from prison
erd_date DATE -- Estimated Release Date
gender VARCHAR(32) -- For future house restrictions (optional)

Update payment_type options:

- "Voucher ($700/mo)"
- "TeleCare"
- "Section 8"
- "Private Pay"
- "ERD"
- "Family Support"

---

Recommended Documentation Updates

1. PRODUCT_SPEC.md:

   - Update Epic 2.1 with dynamic form requirements
   - Move Epic 3.1 from Phase 2 to Phase 1 (rent tracking critical)
   - Add Epic 1.3: Tenant Operations (relocation) to Phase 2
   - Add Epic 6.1: Advanced Bed Management (batter's box) to Post-MVP
   - Update schema section with new fields

2. SCHEMA_FOR_MANAGER.md:

   - Add county field explanation
   - Add tenant type categories explanation
   - Add rent tracking (base vs actual) explanation
   - Add ERD concept explanation

3. SUNDAY_DEMO_GUIDE.md:

   - Add questions about multi-county expansion timeline
   - Ask about gender-based house rules
   - Ask about tenant relocation frequency
   - Ask about TeleCare vs DOC vs Private breakdown

4. intake-form.html (prototype):

   - Add conditional sections (can do after Sunday if time is short)

---

My Recommended Plan

Before Sunday Demo:

- Update documentation only (save prototype edits for post-demo)
- Add new fields to schema docs
- Update PRODUCT_SPEC with reprioritized epics

After Sunday Feedback:

- Refine based on what she confirms/rejects
- Update intake form prototype with conditional fields
- Finalize MVP Phase 1 scope

Reasoning: Don't over-iterate on prototype before getting her feedback. She may have different priorities or additional insights.

---

Action Items for Me

Should I:

1. ✅ Update PRODUCT_SPEC.md with new epics and reprioritization
2. ✅ Update SCHEMA_FOR_MANAGER.md with new fields
3. ✅ Update database schema in CLAUDE.md
4. ✅ Add questions to SUNDAY_DEMO_GUIDE.md
5. ⏸️ Update intake-form.html prototype (wait for Sunday feedback?)

Confirm this approach and I'll execute the updates now before context collapses!

### User

Okay -- we may have enough context. Don't forget to update the `todo.md` file as well! Proceed (don't update the prototype for now, leave as is and I'll come back with client feedback). However, don't use the format 'Voucher ($700)' -- it can change. We'll leave as Voucher, and use an environment variable to track Voucher rates (maybe let the client edit this value through the dashboard if it changes).

### Claude

● ✅ All Documentation Updates Complete!

I've successfully updated all documentation based on your feedback. Here's what was accomplished:

📝 Files Updated

1. PRODUCT_SPEC.md - Major updates:

   - Added 4 new epics (Tenant Operations, Property Financial Dashboard, Advanced Bed Management, Compliance & House Rules)
   - Updated Epic 2.1 with dynamic conditional intake form
   - Moved Epic 3.1 (Payment & Voucher Management) to MVP Phase 1
   - Added county filtering throughout
   - Updated schema section with all new fields
   - Added 5 new questions for Sunday demo

2. SCHEMA_UPDATES.md (NEW) - Comprehensive technical guide:

   - All new database fields documented
   - Migration strategy (3 phases with SQL)
   - Backfill scripts
   - Application logic changes
   - UI changes required
   - Testing checklist & rollback plan

3. todo.md - Added important updates banner linking to schema changes
4. POST_FEEDBACK_UPDATES.md (NEW) - Summary of all changes for context preservation

🎯 Key Decisions Implemented

- ✅ Voucher rates: Configurable via system_settings table (NOT hardcoded)
- ✅ Tenant types: Array field supporting multiple programs
- ✅ Rent tracking: Base rent (bed value) vs actual rent (collected)
- ✅ County support: Ready for multi-county expansion
- ✅ ERD tracking: Support for pending prison releases
- ✅ "Batter's Box": Deferred to Post-MVP (Epic 6.1)
- ✅ Gender restrictions: Post-MVP with sensitive handling (Epic 6.2)

📊 Updated Priorities

MVP Phase 1 (5-7 weeks):

- Property & Bed Management (+ county)
- Tenant Management
- Dynamic Intake Form
- Payment & Voucher Management ← Added
- Dashboard (+ county filter)
- Authentication

MVP Phase 2 (2-4 weeks):

- Tenant Operations (relocation)
- Alerts & Notifications (month-based)
- Property Financial Dashboard ← Added
- Report Generation

🚀 Ready for Sunday

All documentation is updated and ready. The prototype remains unchanged per your request - you'll gather client feedback first, then we'll enhance it.

Key files for Sunday:

- SUNDAY_DEMO_GUIDE.md (demo script)
- SCHEMA_FOR_MANAGER.md (show client the fields)
- PRODUCT_SPEC.md Section 10 (questions to ask)

Your context is preserved and ready to continue after the demo! 🎉
