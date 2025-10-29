# Session 6 -- Basic Frontend Components

## User

Okay, we're ready to build out some basic frontend components.

We discussed possibly implementing TDD at this stage, so let's explore what that looks like. I have some experience using Jest and Vitest for basic unit tests, and even some DB connection/upload tests, but have never written tests for React or frontend components. I'm distantly aware of Playwright for testing frontend, and even using it for giving you, the AI model, visual access to the web page (expanding and leveraging your multi-modal capabilities). I want to minimize dependencies, so we should consider the bare minimum for building testing suites, if we choose to begin TDD now.

In `./docs/screenshots/` you'll find three screenshots of versions of our web page:

1. `prototype-screenshot.png` is a screenshot of the HTML prototype, and got a good response from the Client (but they wanted more purples).
2. `figma-screenshot.png` is a screenshot of the design I mocked up in Figma with more bubbly components and purples -- the Client really liked the aesthetic of this version.
3. `vercel-screenshot.png` is a screenshot of our current app as deployed on Vercel (the working app that the client can access through our url).

I'll continue to provide screenshots for you to review as we progress, unless we find a way to extend your capacity to view the page visually through other tools, libraries or MCP tools.

I'm thinking we'll tackle the first Epic for this sprint.

---

### Theme 1: Core Data Management

_Foundation for tracking properties, beds, and tenants_

#### Epic 1.1: Property & Bed Management

**Description**: Enable managers to track houses and individual bed availability

---

We may want to add some stories, and focus first on viewing the test data we uploaded (viewing and searching properties, tenants, and beds). Then we'll add update features (manager can change status of beds, add notes, vacate beds, etc.). Then we'll add features to create new properties and beds (likely a wizard for property insertion, allowing them to initial with N beds), and the ability to add beds to a current property (she's done this several times). So my current thoughts are to phase by intensive operation (view -> update -> create).

---

### User Stories with CRUD Phases

#### Phase 1: View (Read)

- As a manager, I want to view all properties at a glance so I can see my entire portfolio.
- As a manager, I want to view individual property details, including bed availability and status.
- As a manager, I want to view all tenants across various properties.
- As a manager, I want to search/filter properties, beds, and tenants for quick access.

#### Phase 2: Update

- As a manager, I want to update bed counts and room numbers so the system accurately reflects reality.
- As a manager, I want to change bed status to Available/Occupied/Pending/Hold for current assignment management.
- As a manager, I want to add and update notes on properties and beds for ongoing maintenance and special conditions.
- As a manager, I want to vacate beds when a tenant leaves so beds can be reassigned.

#### Phase 3: Create

- As a manager, I want to create new properties through a guided wizard that allows me to initialize properties with a specific number of beds.
- As a manager, I want to add beds to existing properties to expand capacity when needed.

#### Phase 4: Delete (optional if safe)

- As a manager, I want to delete properties and beds when they are no longer in use, following confirmation to prevent accidental loss.

---

We'll want to likely break these into tasks. The first story, just to view the properties, will require a lot of setup of the frontend components which we'll then iterate upon.

Thoughts so far? I'm putting you in planning mode to ponder and come back with a solid strategy and feedback. Always push back if you think there's a better direction.

## **Forgot to track convo for Properties Page**

## User

Okay -- ready to build the Tenants page! Go ahead and thoroughly plan out how you intend to structure the tenants page first. I'll provide any feedback, and then we'll get started.

## Claude

Tenants Page - Final Implementation Plan

     Overview

     Build a card-based Tenants page with search, filtering, sorting, and inline detail expansion.

     Data Fetching (4 queries)

     - Fetch tenants, beds, houses, tenant_profiles
     - In-memory joins for bed/house location lookup
     - Create enriched tenant objects with address and DOC data

     Search Functionality

     Single search bar filtering by:
     - Full name
     - DOC number (from tenant_profiles)
     - Phone number
     - Street address (from bed → house relationship)

     Filtering (4 dropdowns + reset)

     - Payment Type: All, Voucher, Private Pay, TeleCare, Section 8
     - Payment Status: All, Paid, Partial, Overdue, No Payment
     - Application Status: All, Pending, Approved, Rejected, Waitlist
     - Bed Status: All, Assigned, Unassigned
     - Default: All filters set to "All"

     Sorting (dropdown)

     - Alphabetical (A-Z) - default
     - Rent Due (highest to lowest)

     Tenant Cards

     Collapsed view shows:
     - Name, photo, status badge
     - Phone, payment type/status
     - Bed assignment (address + room)
     - Entry date

     Expanded view shows all above PLUS:
     - Email, DOB, gender
     - DOC number
     - Voucher start/end dates
     - Rent amounts (due/paid)
     - Notes field

     Click "View Details" to toggle expansion

     Layout

     - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
     - Purple/pink color scheme (matching Properties page)
     - Color-coded payment status badges (green/yellow/red/gray)
     - Loading, error, and empty states

     Tech Debt Notes

     - Consider refining application_status taxonomy (Pending vs Approved vs Housed)
     - Address this schema change before Phase 2 (Write Operations)

## User

[confirm]

## Claude

● Excellent! The dev server successfully hot-reloaded the Tenants page. I can see the HMR update at 4:13:40 PM for /src/pages/Tenants.jsx.

Let me mark this task as complete:

● Perfect! The Tenants page is complete and ready for testing. Here's what I've built:

Tenants Page - Complete Implementation

Features Implemented:

1. Data Fetching (4 queries)

- Fetches tenants, beds, houses, and tenant_profiles tables
- In-memory joins to enrich tenant data with location and DOC numbers

2. Search Bar

- Searches by: name, DOC number, phone, and street address
- Real-time filtering as you type

3. Filters (4 dropdowns)

- Payment Type: All, Voucher, Private Pay, TeleCare, Section 8
- Payment Status: All, Paid, Partial, Overdue, No Payment
- Application Status: All, Approved, Pending, Rejected, Waitlist
- Bed Status: All, Assigned, Unassigned

4. Sorting

- Sort by Name (A-Z) - default
- Sort by Rent Due (High to Low)

5. Tenant Cards

- Profile picture placeholder (first initial)
- Application status badge (color-coded)
- Phone, payment type, payment status with amount
- Bed assignment (address + room number)
- Entry date
- Expandable inline details showing: email, DOB, gender, DOC #, voucher dates, actual rent, exit date, notes

6. Color-Coded Badges

- Payment Status: Green (Paid), Yellow (Partial), Red (Overdue), Gray (No Payment)
- Application Status: Green (Approved), Yellow (Pending), Red (Rejected), Blue (Waitlist)

7. Responsive Layout

- 1 column mobile, 2 columns tablet, 3 columns desktop
- Clean purple/pink color scheme matching Properties page

8. Results Counter

- Shows "Showing X of Y tenants" based on active filters

You can now test the Tenants page in your browser! Navigate to the Tenants section and try:

- Searching for tenants by name, DOC, phone, or address
- Filtering by different criteria
- Sorting by name or rent due
- Expanding tenant cards to see full details
- Using the Reset button to clear all filters

Let me know how it looks and if you'd like any adjustments!

## User

I've updated `./docs/screenshots/current-screenshot.png` with a screenshot of the current tenants page with a few tenant cards expanded.

I've noticed your payment values are bizarre and large (I assume that you set to one value, but then it somewhere got multiplied by 100 to account for cents?)

I think we might want to add a filter dropdown for tenant archetype (DOC, telecare, private, etc.)

Right now, we have one search bar for all text queries, which seems to work fine for now. But I'm wondering, for ease and consitency of use, we don't add multiple search bars for specific fields? Address, doc,  
 name... not mission critical. We can backlog this.

But this looks good so far -- next steps?

## Claude

● Perfect! I found the issue. Looking at the tenant generator (lines 47-65), the rent calculation is accumulating total rent over the tenant's entire stay, not showing monthly rent.

Here's what's happening:
const monthsOccupied = Math.max(1, Math.floor(...));
const rent*due = actualRent * monthsOccupied; // $700 \_ 26 months = $18,200

So Celia Willms with $18337.54 has been housed for ~26 months at $705/month. This is technically tracking total accumulated rent, but you probably want to see current monthly rent (e.g., $700/month).

This is a data model decision: Should we track:

1. Monthly rent (current month only: $700 due, $700 paid)
2. Accumulated total (lifetime: $18,337 total over 26 months)
3. Both (add new fields for monthly vs lifetime tracking)

For your use case (Phase 1 Read Operations), I suspect you want monthly rent. We can fix this in the Tenants page display to show monthly amounts instead of accumulated totals. Would you like me to adjust  
 the display logic to divide by months?

---

Regarding the "tenant archetype" filter: I noticed you mentioned wanting a filter for "DOC, telecare, private, etc." Looking at the database, we have:

- payment_type (Voucher, ERD, Private Pay) - we already filter this
- tenant_types (array like ['DOC', 'In Recovery'], ['TeleCare', 'Mental Health']) - this is not yet filtered

Did you mean you want a filter for tenant_types? That would let you filter by DOC, TeleCare, Voucher Recipient, etc. This is separate from payment type.

---

Next steps - your call:

1. Fix rent display to show monthly or accumulated totals correctly
2. Add tenant_types filter (DOC, TeleCare, etc.)
3. Address search - you mentioned it's working fine for now, backlog the multiple search bars idea
4. Then move on to enhancing the Dashboard with widgets (voucher alerts, properties overview, available beds)

What would you like me to prioritize?

☒ Create feature branch and install React Query
☒ Set up React Router and Layout components
☒ Build reusable UI components (Card, Badge, Button)
☒ Create React Query hooks for data fetching
☒ Build Dashboard page with metrics
☒ Fix RLS policies for anon role
☒ Build Properties page with house cards and expandable bed grids
☒ Build Tenants page with search, filters, sorting, and inline detail view
☐ Fix rent display to show monthly rent instead of accumulated totals
☐ Add tenant_types filter to Tenants page
☐ Enhance Dashboard with summary widgets (voucher alerts, properties overview, available beds)
☐ Refactor Properties page to extract PropertyCard and BedCard components
☐ Future: Financial page for rent auditing and property value tracking
☐ Future: Add base_rent field to beds table for tracking income loss
☐ Backlog: Multiple search bars for specific fields (address, doc, name)
☐ Backlog: Account for Pending/Hold bed statuses in Dashboard metrics
☐ Tech Debt: Update county schema to store name only (e.g., 'King' instead of 'King County')
☐ Tech Debt: Refine application_status taxonomy (Pending vs Approved vs Housed)

## User

Ah, I see. Accumulated monthly rent is certainly useful for a manager to see for auditing and financial record purposes. But for the default display, perhaps we focus on monthly rent due. The accumulated rent should be pulled/calculated when generating a financial report. I'll ask the Client if they want it immediately visible, though. I'm thinking we'll add a financial page to get these details. The bed will have a base value, but will be overridden if the tenant uses a voucher. For the bed cards, we should probably display the rent being paid vs the value of the bed (base rent), so the manager can see the loss of income with the voucher. We can use that to calculate the value of the property -- base value vs actual.

Yes -- let's add a filter for `tenant_types`.

We'll backlog the multiple search bars ideas until I get Client feedback. Maybe she's fine with how it is right now.

## Claude

● Perfect! I've successfully updated the Tenants page with both improvements. Here's what changed:

Changes Made:

1. Fixed Rent Display ✅

- Collapsed view: Now shows monthly rent (e.g., "Paid $705/mo") instead of accumulated totals
- Expanded view: Shows both:
  - Monthly Rent: $705/mo
  - Total Accumulated Rent: $18,337.54 due, $18,337.54 paid (for financial auditing)

This gives managers the quick monthly rate at a glance, while preserving the accumulated totals for detailed financial tracking when they expand the card.

2. Added Tenant Type Filter ✅

Added a new dropdown filter with options:

- All Tenant Types
- DOC
- TeleCare
- Voucher Recipient
- Private Resident
- In Recovery
- Probation
- Parole
- Mental Health

This filters based on the tenant_types array field, so tenants tagged with multiple types (e.g., ['DOC', 'In Recovery']) will appear when filtering by either "DOC" or "In Recovery".

---

Summary

The Tenants page now displays rent in a more user-friendly way (monthly rate by default), while keeping accumulated totals accessible for auditing purposes. The new tenant_types filter helps managers quickly  
 segment their resident population by classification.

Next steps - your choice:

1. Get client feedback on the current Tenants page and rent display
2. Enhance Dashboard with summary widgets (voucher expiration alerts, properties overview, available beds)
3. Something else based on your priorities

What would you like to tackle next?

Todos
☒ Create feature branch and install React Query
☒ Set up React Router and Layout components
☒ Build reusable UI components (Card, Badge, Button)
☒ Create React Query hooks for data fetching
☒ Build Dashboard page with metrics
☒ Fix RLS policies for anon role
☒ Build Properties page with house cards and expandable bed grids
☒ Build Tenants page with search, filters, sorting, and inline detail view
☒ Fix rent display to show monthly rent instead of accumulated totals
☒ Add tenant_types filter to Tenants page
☐ Enhance Dashboard with summary widgets (voucher alerts, properties overview, available beds)
☐ Refactor Properties page to extract PropertyCard and BedCard components
☐ Future: Financial page for rent auditing and property value tracking
☐ Future: Add base_rent field to beds table for tracking income loss
☐ Backlog: Multiple search bars for specific fields (address, doc, name)
☐ Backlog: Account for Pending/Hold bed statuses in Dashboard metrics
☐ Tech Debt: Update county schema to store name only (e.g., 'King' instead of 'King County')
☐ Tech Debt: Refine application_status taxonomy (Pending vs Approved vs Housed)

## User

I've updated the screenshot. Perfect job on the filters!

I've noticed that one of the tenants is a "private pay" tenant, but they're on the voucher. This is likely due to the fake data generation script. But a voucher tenant will always be on DOC.

But now that I'm looking on the Properties page, I'm seeing that the beds cards could use a little more info. I'd like to add the actual/base rent to the card. The property should also show the estimated value/income of the property vs its worth (total rent payments based on current tenants, vs total rent of all beds' base value).

After that we'll add the summary widgets.

I'm going to first collapse context, then you'll add the updates to the Property page. Then I'll likely collapse again, and we'll get to work on the summary widgets.

Is there anything else you think we should add/address on the tenants page?

## Claude

● Great work on testing! Looking at the Tenants page, here are a few considerations before we move on:

Potential Improvements (Optional):

1. Payment Status Logic vs Display

Right now, the payment status badges (Paid/Partial/Overdue) are calculated based on accumulated rent (rent_due vs rent_paid), but the badge displays monthly rent ($705/mo).

This is actually fine for tracking who's behind on payments, but might be slightly confusing. For example:

- A tenant could show "Partial $705/mo" but actually owes $18k total with only $13k paid
- The status is correct (they're behind), but the dollar amount shown is just the monthly rate

Should we:

- Keep it as-is (status tracks accumulated debt, dollar shows monthly rate)
- Change the badge to show accumulated totals when not "Paid" status (e.g., "Partial $5,000 behind")
- Add a small note/tooltip?

2. "No Payment" Label for Voucher/ERD Tenants

Voucher and ERD tenants show "No Payment" status since rent_due = 0. Is "No Payment" the right label, or should it be:

- "N/A" (rent not applicable)
- "Covered" (rent covered by voucher/program)
- "Voucher/ERD" (explicit program name)

3. Sorting by Rent

The "Sort: Rent Due" option sorts by accumulated totals (rent_due), but we're now displaying monthly rent. Should we:

- Rename it to "Sort: Total Due (High-Low)" to clarify it's accumulated
- Change it to sort by actual_rent (monthly) instead
- Add both options (monthly vs accumulated)

4. Tenant Types on Card

We have a tenant_types filter, but the collapsed card doesn't show the tenant's types (DOC, TeleCare, etc.). Should we display tenant_types badges on the card, or is that info clutter?

---

My Recommendation:

I think the Tenants page is in great shape as-is for Sprint 1 Phase 1 (Read Operations). The issues above are minor UX polish that we can address in Phase 2 or based on client feedback.

For now, I'd suggest:

- Moving forward with the Properties page enhancements you mentioned
- Getting client feedback on the current Tenants page
- Noting the data validation issue (voucher tenants should be DOC) as a seed data fix

Let me know if you want to address any of the above before moving on, or if you're ready to proceed with the Properties page updates!

## User

We'll move the total rent past due to a Financial Page. Let's backlog a Financial Page for later implementation. You're right in this, but maybe not necessary for the quick glance. At a glance, we should show if they've paid for the current month.

I _do_ like the idea of signaling that the rent is covered if the patient is on voucher. It's automatically paid. I'm not sure how DOC and the Client handle voucher auto-pays, but we might leave it to her to mark them as paid. It's possible there could be complications that delay a voucher payment. Let's backlog that for review later.

The "rent_due" sort should display tenants that haven't paid for the current month. We might add an additional search parameter for "past_due" that brings up all tenants behind in their payments. This means we should likely have, in the additional info expansion, a past due amount for all the money they owe currently (based off accumulated rent).

I think the `tenant_types` is generally inferred by the Client based off payment type. So let's leave out that info for now. When the Client clicks on a card to expand, they'll see the DOC number or program in the card (do we display any program in the card currently?)

## Claude

● Perfect decisions! Let me address your questions and backlog those items:

Current Expanded Card Display:

Yes, we do show program-related info in the expanded card:

- DOC # - displayed (line 486-490 in Tenants.jsx)
- Voucher Start/End dates - displayed (lines 491-500)
- Payment Type - shown in collapsed view ("Voucher", "ERD", "Private Pay", etc.)

So the Client can see if they're in DOC (via DOC number) or on a voucher program (via voucher dates + payment type).

---

Items to Backlog:

Financial Page Features:

- Detailed rent tracking (accumulated totals, payment history)
- Past due amounts and overdue tenants report
- Property income tracking (actual vs base rent calculations)

Tenants Page Refinements:

- Change "No Payment" label to "Covered" or similar for voucher/ERD tenants
- Review voucher auto-pay workflow with Client
- Add "Past Due" filter to show tenants behind on accumulated rent
- Add "Past Due Amount" field in expanded card details
- Update "Sort: Rent Due" to prioritize current month unpaid tenants

Data Validation:

- Fix seed data so voucher tenants are always DOC
- Ensure payment_type and tenant_types alignment

---

I'll add these to the todo list as backlog items. Once you've collapsed context, I'll be ready to tackle the Properties page enhancements:

1. Add actual/base rent to bed cards
2. Add property-level income tracking (actual revenue vs potential revenue based on base rates)

Ready when you are!

## User

Okay -- let's get to work on those Property page enhancements. Plan out what we need to do, and get a strategy together.

## Claude

Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Properties Page Rent Enhancements

1.  Add Rent Display to Bed Cards

For ALL beds (Available, Occupied, Pending, Hold):

- Show base rent below room number: "$750/mo base"
- Use existing bed card structure, add new line for rent

For OCCUPIED beds only:

- Show comparison: "$750 base / $700 actual"
- Add visual indicator if actual < base (voucher discount icon)
- Keep tenant name visible

2.  Add Property-Level Financial Summary

New section in property card header (next to occupancy):

Calculate and display:

- Potential Income: Sum of all bed base_rents (if 100% occupied)
- Current Income: Sum of actual_rents for occupied beds only
- Vacancy Cost: Sum of base_rents for Available beds
- Income Loss: Potential minus Current (shows voucher discounts + vacancies)

Example display:
Income: $8,400/mo actual | $10,500/mo potential (80% efficiency)

3.  Implementation Details

- Modify src/pages/Properties.jsx only (no schema changes needed)
- Add rent calculation logic in useMemo hook
- Update bed card JSX to include rent labels
- Add financial summary to property header section
- Style consistently with existing Tailwind classes

Files to modify:

- src/pages/Properties.jsx (bed cards + property summary)

No database changes needed - all data already exists!

## User

I approve of the plan. Let's swap the order of the rent comparison -> "$700 actual / $750 base"... maybe put the acutal in a blue badge, and the base in a gray badge. Let's only do that if there's a discrepency, and leave it simply as "$750" in blue badge if there's no override.

## Claude

● Excellent! The dev server compiled successfully with no errors. All changes are live at http://localhost:3000/.

Summary of Changes to Properties Page

I've successfully implemented both enhancements:

1. Rent Display on Bed Cards (src/pages/Properties.jsx:276-321)

Each bed card now shows rent information:

For occupied beds with rent discrepancy (actual ≠ base):

- Blue badge: $700 actual
- Gray badge: $750 base

For occupied beds without discrepancy or non-occupied beds:

- Single blue badge: $750

The logic checks:
const hasRentDiscrepancy = tenant && actualRent > 0 && actualRent !== baseRent;

2. Property-Level Financial Summary (src/pages/Properties.jsx:250-256)

Added a new income section to each property card header showing:

- Actual monthly income (green): Sum of occupied beds' actual_rent
- Potential monthly income (gray): Sum of all beds' base_rent
- Income efficiency (purple): Percentage showing (actual/potential) \* 100

Example display:
Income: $8,400/mo | $10,500/mo potential (80%)

The calculations are done during data enrichment (lines 81-92), so they're computed once and efficiently reused.

Technical Details

Financial metrics calculation:

- potentialIncome: Sum of all bed.base_rent values
- actualIncome: For occupied beds only, sum of tenant.actual_rent (fallback to bed.base_rent if tenant has no actual_rent)
- incomeEfficiency: (actualIncome / potentialIncome) \* 100

Styling:

- Actual income: Green text (text-green-700)
- Potential income: Gray text (text-gray-600)
- Efficiency percentage: Purple text (text-purple-600)
- Rent badges: Blue for actual/standard (bg-blue-500), Gray for base (bg-gray-400)

All changes are working with the existing data structure - no database schema modifications were needed since base_rent already exists on the beds table!

Todos
☒ Create feature branch and install React Query
☒ Set up React Router and Layout components
☒ Build reusable UI components (Card, Badge, Button)
☒ Create React Query hooks for data fetching
☒ Build Dashboard page with metrics
☒ Fix RLS policies for anon role
☒ Build Properties page with house cards and expandable bed grids
☒ Build Tenants page with search, filters, sorting, and inline detail view
☒ Fix rent display to show monthly rent instead of accumulated totals
☒ Add tenant_types filter to Tenants page
☒ Add rent display to bed cards on Properties page
☒ Add property-level financial summary to Properties page
☐ Enhance Dashboard with summary widgets (voucher alerts, properties overview, available beds)
☐ Future: Financial page for rent auditing and property value tracking
☐ Backlog: Multiple search bars for specific fields (address, doc, name)
☐ Backlog: Account for Pending/Hold bed statuses in Dashboard metrics
☐ Tech Debt: Update county schema to store name only (e.g., 'King' instead of 'King County')
☐ Tech Debt: Refine application_status taxonomy (Pending vs Approved vs Housed)

## User

Perfect! I think we're ready to implement the summary widgets. I've updated the screenshot so you can see. I'm debating if I should collapse context -- go ahead and plan out thoroughly your design and implementation strategy for the summary widgets, and I'll decide to compact or not.

## Claude

Dashboard Summary Widgets Implementation Plan

Overview

Add 3 new widget components to Dashboard: Voucher Expiration Alerts, Properties Overview, and Available Beds List

Current State

- Dashboard has 4 basic metric cards (Total Beds, Occupied, Available, Occupancy %)
- Fetches: beds and tenants (already in place)
- Need to add: houses query

---

Component Architecture

Create 3 new components in src/components/dashboard/:

1.  VoucherExpirationWidget.jsx

- Shows tenants with vouchers expiring in next 30 days
- Color-coded urgency: Red (≤7 days), Yellow (8-30 days)
- Sorted by soonest expiration first
- Empty state: "No vouchers expiring in next 30 days"

2.  PropertiesOverviewWidget.jsx

- Mini metrics grid showing:
  - Total Properties count
  - Total Beds count
  - Overall Occupancy %
  - Properties at Full Capacity
  - Total Potential Monthly Income
- Compact grid layout (2-3 columns)

3.  AvailableBedsList.jsx

- List of available beds with house address + room + rent
- Green accent color (availability theme)
- Show up to 10 beds, sorted by address then room
- Empty state: "No beds currently available"

---

Dashboard Layout (3 Rows)

Row 1: [Metric][Metric][Metric][Metric] ← Existing 4 cards
Row 2: [Properties Overview Widget] ← Full width or 2-col
Row 3: [Voucher Alerts] | [Available Beds] ← 2 columns

Responsive: Stack to 1 column on mobile

---

Data Strategy

Add to Dashboard.jsx:

- New houses query using React Query
- Update loading state: isLoading = bedsLoading || tenantsLoading || housesLoading
- Pass data as props to widgets

Widget Calculations:

- Voucher Widget: Filter tenants where voucher_end is between today and +30 days
- Properties Widget: Aggregate metrics across houses/beds (count, occupancy, capacity)
- Available Beds: Filter beds where status === 'Available', enrich with house address

---

Implementation Order

1.  Add houses query to Dashboard.jsx
2.  Create PropertiesOverviewWidget (simplest - no date logic)
3.  Create AvailableBedsList (straightforward filtering)
4.  Create VoucherExpirationWidget (most complex - date calculations)
5.  Update Dashboard layout to include all 3 widgets
6.  Test responsive behavior and empty states

---

Technical Details

Date Helper Utility:
Create src/utils/dateHelpers.js for voucher expiration calculations

Styling:

- Follow existing Tailwind patterns
- Yellow/orange accent for Voucher widget (alerts)
- Purple accent for Properties widget (brand)
- Green accent for Available Beds (availability)
- Consistent card style: white background, shadow, rounded corners

No New Dependencies: Uses existing React Query, Supabase, Tailwind

---

Estimated Effort

~400-500 lines of code, 4-5 file changes, medium complexity

## User

[confirm]

## Claude

## User

I feel like there's some repitition in the Properties Overview bar (total beds, occupancy rate) -- I'm thinking we remove those two, remove the "Fully Capacity" marker, and keep the potential revenue marker -- but add a current revenue marker that sums all current payments across all properties for that month.

The pending voucher expirations card is perfect, but I'm also thinking we include a "pending arrivals" card for any tenants that about to move in in the next month (primarily DOC, releasing inmates, but possibly those approved and about to move in).

We haven't implemented forms yet, but we'll want to add a card that notifies the Client of any pending form submissions as well. I'm starting to think for the DB/schema, we need a "reviewed" field that defaults to `false` until the Client marks it as review/processed. We might want a tab for waitlisted applicants, so if there's available beds the Client can view waitlist and assign tenants (perhaps default to pending until confirm move-in?).

I'm also realizing that for releasing inmates that may have county restrictions, we may need to include (if we haven't already) a "release_county" field for tenants that's checked against properties. That way, if Client attempts to assign a county-restricted tenant (only DOC does this), then there's an alert if they attempt to assign to a bed/property in a different county.

Also, for the "Available Beds" widget, there's a "+7 more available" string at the bottom. I think this should be a link/button that opens the full beds view (either redirect to beds page with auto-filter to available, or opens a model with all available beds).

We don't have much context left for major work or refactors, so I'll collapse before we do any work. Thoughts? (I've updated the screenshot as well).

## Claude

● Excellent feedback! The Dashboard is looking great. Let me provide detailed thoughts on each of your suggestions:

1. Properties Overview Widget - Simplification ✅

Your suggestion: Remove Total Beds, Occupancy Rate, At Full Capacity. Keep Potential Income, add Current Income.

My thoughts: Absolutely agree! This eliminates redundancy and provides actionable financial insight. The comparison between Current Income vs Potential Income immediately shows the manager:

- Revenue loss from vacancies
- Revenue loss from voucher discounts
- Overall portfolio efficiency

Recommendation: Display as:
Total Properties: 5
Current Income: $26,500/mo actual
Potential Income: $36,768/mo potential
Revenue Gap: -$10,268/mo (72% efficiency)

This is much more valuable than "0 properties at full capacity."

---

2. Pending Arrivals Widget ✅

Your suggestion: Show tenants moving in within next 30 days (DOC releases + approved move-ins).

My thoughts: Perfect parallel to Voucher Expiration widget! This gives the manager proactive visibility into:

- Upcoming DOC releases (prepare bed, paperwork)
- Approved tenants' expected move-in dates
- Upcoming occupancy changes

Implementation notes:

- Filter: entry_date is between today and +30 days, and exit_date is null
- Sort by soonest entry date first
- Color-code: Blue theme (arrival/intake)
- Empty state: "No arrivals scheduled in next 30 days"

---

3. Pending Form Submissions Widget 🔮

Your suggestion: Add widget for unreviewed form submissions. Add reviewed field (defaults false).

My thoughts: Essential for workflow management! This creates a clear action queue for the manager.

Schema change needed:
ALTER TABLE form_submissions
ADD COLUMN reviewed BOOLEAN DEFAULT false,
ADD COLUMN reviewed_at TIMESTAMP,
ADD COLUMN reviewed_by VARCHAR(255);

Implementation:

- Widget shows count of unreviewed submissions
- Click opens modal or navigates to Forms page
- Manager can mark as reviewed
- Track who reviewed and when (audit trail)

Defer until: Forms implementation (Phase 4 - Admin Portal)

---

4. Waitlist Management & Bed Assignment 🔮

Your suggestion: Waitlist tab to view applicants and assign to available beds. Default to Pending until move-in confirmed.

My thoughts: This is a game-changer feature for workflow efficiency! Currently, the manager has to:

1. Check waitlist
2. Check available beds
3. Manually coordinate assignment

Proposed flow:

1. Manager clicks "Assign" on waitlist applicant
2. Modal shows available beds (filtered by county if applicable)
3. Manager selects bed
4. System creates tentative assignment:
   - tenant.bed_id = selected_bed
   - tenant.application_status = "Approved"
   - bed.status = "Pending"
   - tenant.entry_date = [manager sets expected date]
5. On move-in day, manager confirms:
   - bed.status = "Occupied"
   - tenant moves from Pending → Active

Schema consideration:

- application_status taxonomy: Waitlist → Approved → Housed
- Need to distinguish "Approved but not moved in" vs "Housed"

Defer until: After Dashboard widgets complete, before Forms

---

5. County Restrictions for DOC Tenants ⚠️

Your suggestion: Add release_county field. Alert if assigning to wrong county.

My thoughts: Critical compliance feature! DOC release restrictions are legal requirements, not preferences.

Schema change:
ALTER TABLE tenants
ADD COLUMN release_county VARCHAR(64),
ADD COLUMN county_restricted BOOLEAN DEFAULT false;

Implementation:

- When assigning DOC tenant to bed:
  - Check if county_restricted = true
  - Compare tenant.release_county with house.county
  - Show blocking alert if mismatch: "⚠️ County restriction violation! This DOC release is restricted to [King County]. This property is in [Pierce County]."
- Add to tenant profile form
- Seed data: Only DOC tenants have this restriction

Priority: High (legal compliance)

---

6. Available Beds "+7 more" Link ✅

Your suggestion: Make "+7 more available" clickable. Opens Properties page filtered to Available, or modal.

My thoughts: Navigation to Properties page is simpler and more intuitive than modal.

Recommendation: Navigate to Properties page

- Add ?filter=available query param
- Properties page reads query param and auto-expands all houses, highlights available beds
- User can see full context (which houses, room details)

Alternative: Link to Tenants page with "Assign Tenant" workflow if that exists

Implementation:

  <Link to="/properties?filter=available" className="text-purple-600 hover:underline">
    +{enrichedBeds.length - 10} more available
  </Link>

---

Context & Prioritization

You're right about context - we're at 67% (134k/200k tokens). Before collapsing, here's my suggested priority order:

Do Now (before collapse):

1. ✅ Simplify Properties Overview Widget (remove redundancy, add Current Income)
2. ✅ Create Pending Arrivals Widget (parallel to voucher expiration)
3. ✅ Make "+X more available" clickable (simple link to Properties page)

Do After Collapse (Phase 1.5):

4. County restrictions implementation (schema + validation logic)
5. Waitlist assignment UI (Assign button → modal → confirm)

Defer to Later Phases:

6. Pending Form Submissions widget (requires Forms implementation first - Phase 4)
7. Enhanced application_status taxonomy (tech debt - can iterate)

---

Summary of Changes Needed

Properties Overview Widget:

- Remove: Total Beds, Occupancy Rate, At Full Capacity
- Keep: Total Properties, Potential Income
- Add: Current Income (sum of occupied beds' actual_rent)

New Widget: Pending Arrivals

- Filter: entry_date between today and +30 days, exit_date is null
- Display: Tenant name, entry date, days until arrival
- Blue theme (intake/arrival)

Available Beds Enhancement:

- Make "+X more" a link to /properties?filter=available

---

Your thoughts? Should we proceed with these three changes before collapse, or collapse now and tackle them fresh? Also, do you want Current Income to show only occupied beds' actual payments, or include
Pending beds' expected payments?

## User

We'll defer schema changes until later. But we should make a note of all the schema changes we've identified thus far, and put them into a document `./planned-schema-changes.md` to review later. We should likely do the same for `./planned-widgets.md` for widgets to create after we reach certain milestones (like implementing forms). This way we don't lose context, and can review the plan later.

We'll collapse context first, then start on the widget updates.

But we've made good progress, so let's go ahead and commit all changes `git add .`, commit and push.
