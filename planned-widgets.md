# Planned Dashboard Widgets

This document tracks dashboard widgets and features identified for future implementation, organized by dependencies and milestones.

---

## Immediate Next Steps (Post-Context Collapse)

### 1. Simplify Properties Overview Widget

**Current state:** Shows 5 metrics (Total Properties, Total Beds, Occupancy Rate, At Full Capacity, Potential Income)

**Issue:** Redundancy with top-row metric cards (Total Beds, Occupancy Rate shown twice)

**Proposed changes:**
- **Remove:** Total Beds, Occupancy Rate, At Full Capacity
- **Keep:** Total Properties, Potential Income
- **Add:** Current Income (sum of occupied beds' actual_rent for current month)

**Display format:**
```
Total Properties: 5
Current Income: $26,500/mo actual
Potential Income: $36,768/mo potential
Revenue Gap: -$10,268/mo (72% efficiency)
```

**Benefits:**
- Eliminates redundancy
- Provides actionable financial insight
- Shows revenue loss from vacancies + voucher discounts at a glance

**File to modify:** `src/components/dashboard/PropertiesOverviewWidget.jsx`

---

### 2. Create Pending Arrivals Widget

**Purpose:** Show tenants scheduled to move in within next 30 days (DOC releases + approved move-ins)

**Data requirements:**
- Filter: `tenant.entry_date` between today and +30 days
- Filter: `tenant.exit_date` is null (active/upcoming tenants)
- Sort: By soonest entry_date first

**Display:**
- Tenant name
- Entry date (formatted)
- Days until arrival
- Badge color-coded by urgency (similar to voucher expiration)

**Color scheme:** Blue theme (intake/arrival)

**Empty state:** "No arrivals scheduled in next 30 days"

**Parallel to:** Voucher Expiration Widget (same structure, different data)

**Files to create:**
- `src/components/dashboard/PendingArrivalsWidget.jsx`

**Dashboard layout:** Replace or add alongside existing widgets

---

### 3. Enhance Available Beds Widget

**Current state:** Shows "+7 more available" text at bottom

**Enhancement:** Make clickable link that navigates to Properties page

**Implementation:**
```jsx
<Link to="/properties?filter=available">
  +{enrichedBeds.length - 10} more available
</Link>
```

**Properties page enhancement (optional future work):**
- Read `?filter=available` query param
- Auto-expand all property cards
- Highlight/scroll to available beds
- Filter bed cards to show only available

**Alternative:** Link to dedicated "All Available Beds" page or modal

**File to modify:** `src/components/dashboard/AvailableBedsList.jsx`

---

## Depends on: Forms Implementation (Phase 4)

### 4. Pending Form Submissions Widget

**Purpose:** Show manager how many unreviewed form submissions require action

**Prerequisites:**
- Forms implementation complete
- Schema change: Add `reviewed` field to `form_submissions` table (see `planned-schema-changes.md`)

**Display:**
- Count of unreviewed submissions
- List of pending submissions (name, submission date, form type)
- "Review" button/link for each

**Interaction:**
- Click submission → Opens form detail view
- Manager marks as reviewed
- Widget updates count

**Color scheme:** Orange/yellow theme (action required)

**Files to create:**
- `src/components/dashboard/PendingFormSubmissionsWidget.jsx`

**Related schema changes:**
```sql
ALTER TABLE form_submissions
ADD COLUMN reviewed BOOLEAN DEFAULT false,
ADD COLUMN reviewed_at TIMESTAMP,
ADD COLUMN reviewed_by VARCHAR(255);
```

---

## Depends on: Waitlist Management Feature

### 5. Waitlist Assignment Widget/Flow

**Purpose:** Quick view of waitlist applicants with ability to assign to available beds

**Feature components:**
1. **Dashboard Widget:** Show count of waitlist applicants
2. **Waitlist Tab/Page:** Full list of applicants with details
3. **Assignment Modal:** Select available bed, set entry date
4. **County Validation:** Alert if DOC tenant restricted to different county

**Workflow:**
```
1. Manager views waitlist (sorted by application date or priority)
2. Clicks "Assign" next to applicant
3. Modal shows available beds (filtered by county if applicable)
4. Manager selects bed, sets expected entry_date
5. System updates:
   - tenant.bed_id = selected_bed
   - tenant.application_status = "Pending" (awaiting move-in)
   - bed.status = "Pending"
6. On move-in day, manager confirms:
   - bed.status = "Occupied"
   - tenant.application_status = "Housed"
```

**Dashboard widget display:**
- Count of waitlist applicants
- "View Waitlist" button → Navigate to full page
- Optionally: Top 3-5 waitlist applicants with quick assign

**Related schema considerations:**
- `application_status` taxonomy (see `planned-schema-changes.md`)
- County restrictions validation (see `planned-schema-changes.md`)

**Files to create:**
- `src/pages/Waitlist.jsx` (new page)
- `src/components/AssignBedModal.jsx`
- `src/components/dashboard/WaitlistWidget.jsx` (optional)

---

## Future Enhancements

### 6. Rent Collection Status Widget

**Purpose:** Show payment status for current month

**Display:**
- Count of tenants who paid in full
- Count of partial payments
- Count of overdue (no payment)
- Total collected vs expected for current month

**Requires:**
- Current month payment status calculation
- Possibly rent_transactions table for detailed tracking

**Benefits:**
- Quick cash flow visibility
- Identify collection issues early
- Month-to-date revenue tracking

---

### 7. Maintenance/Issues Tracker Widget

**Purpose:** Track maintenance requests and property issues

**Future scope:** Depends on whether this system will include maintenance tracking

**Display:**
- Open maintenance requests
- Urgent issues
- Requests by property

**Prerequisites:**
- New table: `maintenance_requests`
- Maintenance tracking feature implementation

---

### 8. Occupancy Trends Chart

**Purpose:** Visual graph showing occupancy rate over time (3 months, 6 months, 1 year)

**Display:**
- Line chart of occupancy percentage
- Compare across properties
- Identify seasonal trends

**Technology:**
- Charting library (e.g., Recharts, Chart.js)
- Historical occupancy data tracking

**Benefits:**
- Visual insights into trends
- Identify seasonal patterns
- Forecast capacity needs

---

### 9. Voucher Budget Tracker

**Purpose:** Track total voucher payments vs budget/cap

**Context:** Some voucher programs have caps or budget limits

**Display:**
- Total vouchers active
- Monthly voucher revenue
- Year-to-date voucher income
- Capacity for additional voucher tenants

**Requires:**
- Budget/cap configuration in system_settings
- Voucher payment tracking

---

## Implementation Priority Matrix

| Widget | Priority | Effort | Dependencies | Phase |
|--------|----------|--------|--------------|-------|
| Simplify Properties Overview | High | Low | None | Current |
| Pending Arrivals | High | Low | None | Current |
| Enhanced Available Beds Link | High | Low | None | Current |
| County Restrictions | High | Medium | Schema change | 1.5 |
| Pending Form Submissions | Medium | Low | Forms + Schema | 4 |
| Waitlist Assignment | Medium | High | Schema + UI work | 2 |
| Rent Collection Status | Low | Medium | Financial tracking | 3+ |
| Maintenance Tracker | Low | High | New feature scope | Future |
| Occupancy Trends Chart | Low | Medium | Historical data + charting lib | 3+ |
| Voucher Budget Tracker | Low | Low | Config + tracking | 3+ |

---

## Review Schedule

- Revisit after Phase 1 completion
- Re-prioritize based on Client feedback
- Update after Forms implementation (Phase 4)
