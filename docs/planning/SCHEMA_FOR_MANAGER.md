# Housing Dashboard - Data We'll Track

**For**: Housing Manager Review
**Date**: October 17, 2025

This document explains what information the new dashboard will track. It's based on your current Excel file, but organized to make searching, filtering, and reporting much easier.

---

## Three Main Categories

Your data will be organized into three simple categories:

1. **Properties** - The houses you manage
2. **Beds** - Individual bed spaces in each property
3. **Tenants** - The residents living in your properties

---

## 1. Property Information

For each house you manage, we'll track:

| Field | Description | Example |
|-------|-------------|---------|
| **Property Address** | Full street address | "1234 Pine Street, Seattle, WA 98101" |
| **Total Beds** | How many beds this house has | 12 |
| **Manager Notes** | Any special information about this property | "Recently renovated kitchen" |

**Why this helps**: You can see all your properties at a glance and quickly find a specific house.

---

## 2. Bed/Room Information

For each bed in each property, we'll track:

| Field | Description | Example |
|-------|-------------|---------|
| **Room Number** | How you identify this bed/room | "Room 2A" or "Bed 5" |
| **Property** | Which house this bed is in | "1234 Pine Street" |
| **Current Status** | Is this bed available or occupied? | Available, Occupied, Pending, or On Hold |
| **Current Tenant** | Who's in this bed right now (if occupied) | "John Smith" |
| **Bed Notes** | Special information about this bed | "Top bunk" or "Window view" |

**Why this helps**: You can instantly see which beds are open and where, without searching through your whole Excel file.

---

## 3. Tenant Information

For each resident (current or past), we'll track:

### Basic Information
| Field | Description | Example |
|-------|-------------|---------|
| **Full Name** | Resident's name | "John Smith" |
| **Date of Birth** | When they were born | "01/15/1985" |
| **Phone Number** | Contact number | "(206) 555-1234" |

### Housing Information
| Field | Description | Example |
|-------|-------------|---------|
| **Move-In Date** | When they arrived | "03/15/2024" |
| **Move-Out Date** | When they left (if they've exited) | "10/01/2024" or blank |
| **Current Bed** | Which bed they're assigned to | "Room 2A at 1234 Pine Street" |

### Agency & Program Information
| Field | Description | Example |
|-------|-------------|---------|
| **DOC Number** | Department of Corrections ID | "DOC123456" |

### Payment Information
| Field | Description | Example |
|-------|-------------|---------|
| **Payment Type** | How they pay rent | "Private Pay", "Voucher", "Family Support", or "ERD" |
| **Voucher Start Date** | When voucher coverage began (if applicable) | "03/15/2024" |
| **Voucher End Date** | When voucher expires (if applicable) | "09/15/2024" |
| **Monthly Rent Due** | How much they owe per month | $700 |
| **Total Rent Paid** | How much they've paid so far | $4,200 |
| **Balance Owed** | Outstanding amount | $350 |

### Notes
| Field | Description | Example |
|-------|-------------|---------|
| **Manager Notes** | Your comments and observations | "Requires weekly medication check-ins" |

**Why this helps**: All tenant information in one place. You can search by name or DOC number, see payment status at a glance, and get alerts when vouchers are expiring.

---

## How This Differs from Your Current Excel File

### Current Situation (Excel)
- Everything mixed together in one giant sheet
- Hard to see just properties, or just available beds
- Can't easily search or filter
- Difficult to track payment history over time
- No automatic alerts for important dates

### New Dashboard
- **Properties View**: See all houses and bed counts
- **Beds View**: Filter to see only available beds, or occupied beds, or by specific house
- **Tenants View**: Search by name, DOC number, or filter by payment status
- **Automatic Alerts**: Get notified when vouchers are expiring or new tenants are arriving
- **Quick Reports**: Generate occupancy reports or payment summaries with one click

---

## What We're NOT Tracking (For Now)

Based on your Excel file, these fields exist but aren't needed for the first version:

- Medication/pill line requirements
- Mental health codes
- Crime classifications
- Counselor contact information (can add later if needed)
- Budget/expense tracking

We can add any of these later if you need them!

---

## How Your Excel Data Will Transfer

### From "CURR HOUSING SHEET USE THIS"

- **House** column → Property records
- **Room** column → Bed records
- **Client** column → Tenant names
- **Move in date** → Tenant entry dates
- **Move out date** → Tenant exit dates
- **DOC#** → DOC numbers
- **Who pays** → Payment types
- **Amount Due** → Monthly rent
- **Amount Paid** → Total rent paid
- **Difference owed** → Balance (auto-calculated)
- **Date voucher ends** → Voucher expiration
- **Notes** → Manager notes

### From Monthly "RENT DUE" Sheets

- We'll use these to build a **payment history** for each tenant
- This means you can see when payments were made, not just totals
- Useful for auditing and reporting

---

## Questions for You to Think About

1. **Property Addresses**: Your Excel uses house numbers (1, 2, 3, etc.). Should we use actual street addresses instead?

2. **Bed Numbering**: You use different formats ("Room 1A", "Bed 3", etc.). Do you have a preferred system?

3. **Payment Types**: I see "Private", "Voucher", "ERD", "Family". Are there others I'm missing?

4. **Status Options**: For bed availability, are "Available", "Occupied", "Pending", "Hold" the right options?

5. **Reports**: What reports do you generate most often? This will help me prioritize which ones to include.

6. **Contacts**: Do you need to track multiple contacts per tenant (emergency contact, case manager, CCO, etc.)?

---

## Next Steps

1. **Sunday Demo**: I'll show you a working example with sample data (not your real data)
2. **Get Your Feedback**: You tell me what's missing or what should change
3. **Refine & Build**: We adjust the design and start building the real system
4. **Migrate Your Data**: We carefully move all your Excel data into the new dashboard
5. **Training & Launch**: You try it out, we fix any issues, and then you start using it!

---

## Questions?

Let's discuss this on Sunday when you see the prototype in action. It will make a lot more sense when you can click around and see how it works!
