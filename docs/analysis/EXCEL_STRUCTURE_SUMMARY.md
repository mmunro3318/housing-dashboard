# Excel File Structure Analysis

**File**: 2024 Current Client Housing Participants.xlsx
**Analysis Date**: October 17, 2025

---

## Overview

- **Total Sheets**: 37
- **Main Category Sheets**:
  - Current Housing Tracking
  - Monthly Rent Due sheets (ongoing from 2024-2025)
  - Accepted/Pending Housing lists
  - Contact/Resource sheets

---

## Key Sheets for Data Migration

### 1. CURR HOUSING SHEET USE THIS (Main Data Source)
**Rows**: 62 | **Columns**: 22

**Key Fields**:
- `House` - Property identifier (int64)
- `Client` - Tenant name
- `Move in date` - Entry date
- `Move out date` - Exit date
- `DOC#` - DOC reference number
- `Who pays` - Payment type (Private, Voucher, etc.)
- `Amount Due` - Monthly rent amount
- `Amount Paid` - Total rent paid
- `Difference owed` - Outstanding balance
- `Date voucher ends` - Voucher expiration
- `Room` - Bed/room assignment
- `Status` - Current status
- `Notes` - Freeform manager notes

**Data Quality**:
- 61 non-null clients (98%)
- 57 move-in dates (92%)
- 52-55 payment tracking records (84-89%)
- Voucher data sparse (17%)

---

### 2. 2024/2025 Accepted Housing
**Rows**: 206-207 | **Columns**: 20-23

**Additional Fields Not in Main Sheet**:
- `PILL LINE & UA` - Medication/testing requirements
- `Age` - Tenant age
- `Mental Health Code` - Mental health classification
- `Crime` - Criminal history category
- `SO Level` - Sex offender level
- `Classification Counselor` - DOC counselor name/phone
- `CCO Name/Phone` - Community Corrections Officer contact
- `ABHS Counselor` - Behavioral health counselor
- `Email` - Contact email

**Notes**:
- These sheets track additional tenant metadata
- Sparse data (30-60% completion on many fields)
- Contains stakeholder contact information

---

### 3. Monthly RENT DUE Sheets (12 sheets for 2024-2025)
**Pattern**: RENT DUE MM.DD.YYYY
**Rows**: 50-60 per month | **Columns**: 9-15

**Consistent Fields**:
- `House` - Property number
- `Client` - Tenant name
- `Type of Payment` - Payment method
- `Amount Due` - Monthly rent
- `Amount Paid` / `Actual payment` - Collected rent
- `Difference owed` - Outstanding balance
- `Who pays` - Payment source
- `Family Contact for Payment` - Emergency contact

**Purpose**:
- Monthly payment tracking snapshots
- Shows rental history over time
- Can reconstruct payment ledger from these sheets

---

### 4. 2024 Pending Housing (Waitlist)
**Rows**: 32 | **Columns**: 8

**Fields**:
- `Name` - Prospective tenant
- `Phone` - Contact number
- `Email` - Email contact
- `referred by` - Referral source
- `Date potential move in` - Expected arrival
- `rent` - Expected rent amount
- `House` - Tentative assignment
- `Are they moving in` - Confirmation status (Yes/No/Maybe)

**Purpose**: Manages intake pipeline and waitlist

---

### 5. Supporting Sheets

#### House leaders info
- **Rows**: 6
- **Fields**: Name, Email
- **Purpose**: Property manager/RA contacts

#### DOC Offices Contacts
- **Rows**: 6
- **Fields**: DOC office, Manager, CCO Name, CCO phone number
- **Purpose**: Department of Corrections stakeholder contacts

#### Funding Programs
- **Rows**: 12
- **Purpose**: Track voucher programs and funding sources

#### Budget 2024/2025
- **Purpose**: Expense and revenue tracking (out of scope for MVP)

---

## Data Patterns & Observations

### House Identifiers
- Mix of integers (1, 2, 3, etc.) and text ("House 1", "1A", etc.)
- Need standardization: recommend converting to string addresses

### Tenant Identifiers
- Currently only name-based (no unique ID)
- **Risk**: Name conflicts, misspellings
- **Solution**: Generate unique `tenant_id` during migration

### Date Formats
- Inconsistent: datetime, object (string), float
- Multiple formats observed
- **Solution**: Parse and standardize to ISO 8601 (YYYY-MM-DD)

### Payment Data
- Tracked both in current housing sheet AND monthly rent sheets
- **Strategy**: Use monthly sheets to reconstruct payment history
- Current sheet shows totals; monthly sheets show transactions

### Status/Type Fields
- Payment types: "Private", "Voucher", "ERD", "Family", etc.
- Status: "Current", "Exited", "Pending", "Hold"
- Need to define controlled vocabularies

### Sparse Fields
- Many optional fields (counselor contacts, mental health codes)
- 30-70% null values on secondary fields
- **Decision**: Include in schema but make nullable

---

## Recommended Migration Strategy

### Phase 1: Core Data (Houses, Beds, Tenants)
1. Extract from `CURR HOUSING SHEET USE THIS`
2. Generate unique IDs for houses, beds, tenants
3. Normalize house identifiers to addresses
4. Parse and standardize all date fields
5. Map payment types to controlled vocabulary

### Phase 2: Historical Payment Data
1. Parse 12 monthly RENT DUE sheets
2. Create payment transaction records (ledger)
3. Validate totals against current sheet
4. Flag discrepancies for manual review

### Phase 3: Waitlist & Contacts
1. Import Pending Housing as pending tenants
2. Import House leaders as property managers
3. Import DOC contacts as stakeholder directory

### Phase 4: Validation
1. Cross-reference tenant names across sheets
2. Validate bed assignments (no double-booking)
3. Check payment math (due - paid = owed)
4. Manual review of flagged records

---

## Mapping to New Schema

### houses Table
**Source**: `CURR HOUSING SHEET USE THIS.House` + manual address entry
- `house_id` ← Generate from address
- `address` ← Manual lookup or user entry during migration
- `total_beds` ← Count of unique rooms per house
- `notes` ← Aggregate notes if any

### beds Table
**Source**: `CURR HOUSING SHEET USE THIS.Room` + `House`
- `bed_id` ← Generate (house_id + room)
- `house_id` ← Foreign key from houses
- `room_number` ← Room field
- `status` ← Derive from occupancy (Occupied if tenant assigned, else Available)
- `tenant_id` ← Current occupant
- `notes` ← Empty for MVP

### tenants Table
**Source**: `CURR HOUSING SHEET USE THIS` + `Accepted Housing` sheets
- `tenant_id` ← Generate UUID
- `full_name` ← Client
- `dob` ← Calculate from Age if available
- `phone` ← Phone field (from Accepted Housing)
- `entry_date` ← Move in date
- `exit_date` ← Move out date
- `doc_number` ← DOC#
- `payment_type` ← Who pays
- `voucher_start` ← Calculate or set to entry_date if voucher
- `voucher_end` ← Date voucher ends
- `rent_due` ← Amount Due
- `rent_paid` ← Amount Paid
- `notes` ← Notes field
- `bed_id` ← Link to current bed

---

## Data Quality Issues to Address

1. **Inconsistent house numbering**: Some numeric, some text
2. **No unique tenant IDs**: Risk of duplicates
3. **Date format chaos**: Multiple formats across sheets
4. **Sparse voucher data**: Only 17% have voucher end dates
5. **Payment discrepancies**: Need validation between monthly sheets and totals
6. **Room/bed ambiguity**: Sometimes room numbers, sometimes "Bed 1A"
7. **Status inconsistency**: Not always updated when tenant exits

---

## Fields to Exclude from MVP

- PILL LINE & UA
- Mental Health Code
- Crime classification
- SO Level
- Counselor contacts (can add in Phase 2)
- Email (limited data)
- Budget/expense tracking

---

## Next Steps

1. Generate fake data matching these patterns
2. Create ETL script with data cleaning logic
3. Build data validation rules
4. Create manual review checklist for manager
