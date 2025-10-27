# Field Mapping Reference

**Last Updated**: October 27, 2025

This document maps all form fields from the Application and Intake forms to their corresponding database tables and columns.

---

## Table of Contents

1. [Application Form → Database Mapping](#application-form--database-mapping)
2. [Intake Form → Database Mapping](#intake-form--database-mapping)
3. [Conditional Field Logic](#conditional-field-logic)
4. [Required vs Optional Fields](#required-vs-optional-fields)
5. [JSON Schema Examples](#json-schema-examples)

---

## Application Form → Database Mapping

### Section 1: General Information

| Form Field | Database Table | Column | Type | Required | Notes |
|------------|---------------|--------|------|----------|-------|
| First Name | `tenants` | `full_name` | VARCHAR(255) | ✅ Yes | Combined with Last Name |
| Last Name | `tenants` | `full_name` | VARCHAR(255) | ✅ Yes | Combined with First Name |
| Phone Number | `tenants` | `phone` | VARCHAR(32) | ❌ No | Optional - inmates may not have phones |
| Email | `tenants` | `email` | VARCHAR(255) | ❌ No | Optional |
| Date of Birth | `tenants` | `dob` | DATE | ✅ Yes | |
| Most Recent Address | `tenants` | `address` | VARCHAR(255) | ❌ No | Dropdown with WA prisons + "Other" |
| Food Allergies | `tenant_profiles` | `food_allergies` | TEXT | ❌ No | |
| Employment Status | `tenant_profiles` | `employment_status` | VARCHAR(32) | ❌ No | Dropdown: Employed, Unemployed, Student, Seeking |
| Employment Details | `tenant_profiles` | `employment_details` | TEXT | ❌ No | Employer, position, etc. |
| Profile Picture | `tenants` | `profile_picture_url` | TEXT | ❌ No | URL to Supabase Storage |

**Storage Workflow**:
1. Create record in `tenants` table with core identity fields
2. Create record in `tenant_profiles` table with 1:1 relationship via `tenant_id`
3. Upload profile picture to Supabase Storage bucket `tenant-profile-pictures`
4. Store resulting URL in `tenants.profile_picture_url`

---

### Section 2: Recovery Information (Conditional)

**Conditional Display**: Only show if "Are you in recovery?" = Yes

| Form Field | Database Table | Column | Type | Required | Notes |
|------------|---------------|--------|------|----------|-------|
| Are you in recovery? | `tenant_profiles` | `is_in_recovery` | BOOLEAN | ✅ Yes | Checkbox - determines if recovery fields shown |
| Drug of Choice | `tenant_profiles` | `drug_of_choice` | VARCHAR(64) | ❌ No | Only if `is_in_recovery = true` |
| Substances Previously Used | `tenant_profiles` | `substances_previously_used` | TEXT | ❌ No | Only if `is_in_recovery = true` |
| Recovery Program | `tenant_profiles` | `recovery_program` | VARCHAR(64) | ❌ No | Dropdown: 12-Step, SMART Recovery, Faith-Based, etc. |
| Sober Date | `tenant_profiles` | `sober_date` | DATE | ❌ No | Only if `is_in_recovery = true` |

**Frontend Logic**:
```javascript
if (is_in_recovery === false) {
  // Hide all recovery fields
  // Do not send recovery fields to backend
}
```

---

### Section 3: Legal History

| Form Field | Database Table | Column | Type | Required | Notes |
|------------|---------------|--------|------|----------|-------|
| Are you on probation? | `tenant_profiles` | `is_on_probation` | BOOLEAN | ✅ Yes | Checkbox |
| Are you on parole? | `tenant_profiles` | `is_on_parole` | BOOLEAN | ✅ Yes | Checkbox |
| Probation/Parole Officer Name | `tenant_profiles` | `probation_parole_officer_name` | VARCHAR(128) | ❌ Conditional | Required if probation OR parole = true |
| Probation/Parole Officer Phone | `tenant_profiles` | `probation_parole_officer_phone` | VARCHAR(32) | ❌ Conditional | Required if probation OR parole = true |
| Completion Date | `tenant_profiles` | `probation_parole_completion_date` | DATE | ❌ Conditional | Required if probation OR parole = true |
| Criminal History (last 5 years) | `tenant_profiles` | `criminal_history` | TEXT | ✅ Yes | Text area - can be "None" |
| Are you a Registered Sex Offender? | `tenant_profiles` | `is_registered_sex_offender` | BOOLEAN | ✅ Yes | Checkbox |
| Sex Offense Details | `tenant_profiles` | `sex_offense_details` | TEXT | ❌ Conditional | **Required** if `is_registered_sex_offender = true` |

**Frontend Logic**:
```javascript
if (is_on_probation === true || is_on_parole === true) {
  // Show and require: officer name, officer phone, completion date
}

if (is_registered_sex_offender === true) {
  // Show and REQUIRE: sex_offense_details
}
```

---

### Section 4: Emergency Contacts

**Requirement**: At least 1 emergency contact is required per tenant (enforced at application layer)

| Form Field | Database Table | Column | Type | Required | Notes |
|------------|---------------|--------|------|----------|-------|
| First Name | `emergency_contacts` | `first_name` | VARCHAR(64) | ✅ Yes | |
| Last Name | `emergency_contacts` | `last_name` | VARCHAR(64) | ✅ Yes | |
| Phone | `emergency_contacts` | `phone` | VARCHAR(32) | ✅ Yes | |
| Email | `emergency_contacts` | `email` | VARCHAR(255) | ❌ No | Optional |
| Relationship | `emergency_contacts` | `relationship` | VARCHAR(64) | ✅ Yes | Dropdown: Parent, Sibling, Spouse, Friend, etc. |
| Address | `emergency_contacts` | `address` | VARCHAR(255) | ❌ No | Optional |
| Additional Info | `emergency_contacts` | `additional_info` | TEXT | ❌ No | Optional notes |
| Primary Contact | `emergency_contacts` | `is_primary` | BOOLEAN | ❌ No | Checkbox - only one should be true |

**Storage Workflow**:
1. Frontend allows adding 1-3 emergency contacts
2. At least 1 contact is required before form submission
3. Create separate row in `emergency_contacts` table for each contact
4. All rows link to same `tenant_id`

**Example**:
```sql
-- Contact 1
INSERT INTO emergency_contacts (tenant_id, first_name, last_name, phone, relationship, is_primary)
VALUES ('uuid-123', 'Jane', 'Doe', '206-555-0100', 'Mother', true);

-- Contact 2
INSERT INTO emergency_contacts (tenant_id, first_name, last_name, phone, relationship, is_primary)
VALUES ('uuid-123', 'John', 'Smith', '206-555-0200', 'Brother', false);
```

---

### Section 5: Veteran Status

| Form Field | Database Table | Column | Type | Required | Notes |
|------------|---------------|--------|------|----------|-------|
| Are you a veteran? | `tenant_profiles` | `is_veteran` | BOOLEAN | ✅ Yes | Checkbox |

---

### Section 6: Certification & Signature

| Form Field | Database Table | Column | Type | Required | Notes |
|------------|---------------|--------|------|----------|-------|
| Signature | `form_submissions` | `form_data` (JSONB) | Base64 PNG | ✅ Yes | Stored in JSON as `signature_base64` |
| Printed Name | `form_submissions` | `form_data` (JSONB) | VARCHAR | ✅ Yes | |
| Date | `form_submissions` | `submitted_at` | TIMESTAMP | ✅ Yes | Auto-generated |

**Complete Form Submission**:
- Create `form_submissions` record with `form_type = 'Application'`
- Store complete form data as JSONB in `form_data` column
- Initial status: `status = 'Pending'`

---

## Intake Form → Database Mapping

The Intake form consists of 10 policy sections, each requiring a checkbox acknowledgment and e-signature.

### Policy Sections

| Section Name | Database Table | Fields Stored |
|--------------|----------------|---------------|
| Substance Use Rules | `policy_agreements` | `policy_section = 'Substance Use'`, `agreed`, `signature_data`, `signed_at` |
| Recovery Rules | `policy_agreements` | `policy_section = 'Recovery'`, `agreed`, `signature_data`, `signed_at` |
| Guest Rules | `policy_agreements` | `policy_section = 'Guest'`, `agreed`, `signature_data`, `signed_at` |
| Behavioral Rules | `policy_agreements` | `policy_section = 'Behavioral'`, `agreed`, `signature_data`, `signed_at` |
| House Rules | `policy_agreements` | `policy_section = 'House'`, `agreed`, `signature_data`, `signed_at` |
| Safety and Inspection Rules | `policy_agreements` | `policy_section = 'Safety'`, `agreed`, `signature_data`, `signed_at` |
| Statement of Resident Rights | `policy_agreements` | `policy_section = 'Rights'`, `agreed`, `signature_data`, `signed_at` |
| Medication Policy | `policy_agreements` | `policy_section = 'Medications'`, `agreed`, `signature_data`, `signed_at` |
| Good Neighbor Policy | `policy_agreements` | `policy_section = 'Neighbors'`, `agreed`, `signature_data`, `signed_at` |
| Payment Policy | `policy_agreements` | `policy_section = 'Payments'`, `agreed`, `signature_data`, `signed_at` |

### Resident Info (Links to Tenant)

| Form Field | Database Table | Column | Type | Required | Notes |
|------------|---------------|--------|------|----------|-------|
| First Name | `form_submissions` | `tenant_id` (FK) | UUID | ✅ Yes | Used to lookup/link tenant |
| Last Name | `form_submissions` | `tenant_id` (FK) | UUID | ✅ Yes | Used to lookup/link tenant |
| Date of Birth | `form_submissions` | `tenant_id` (FK) | UUID | ✅ Yes | Used to lookup/link tenant |

**Tenant Linking Logic**:
```sql
-- Find tenant by name and DOB
SELECT tenant_id FROM tenants
WHERE full_name = 'First Last' AND dob = '1990-05-15';

-- Use found tenant_id for form_submissions and policy_agreements
```

---

### Intake Form Storage Workflow

1. **Create Form Submission**:
```sql
INSERT INTO form_submissions (
  submission_id,
  tenant_id,
  form_type,
  form_data,
  status,
  submitted_at
) VALUES (
  gen_random_uuid(),
  'tenant-uuid-123',
  'Intake',
  '{"resident_info": {...}, "policies_acknowledged": true}',
  'Pending',
  NOW()
);
```

2. **Create 10 Policy Agreement Records**:
```sql
-- Repeat for each of 10 policy sections
INSERT INTO policy_agreements (
  agreement_id,
  tenant_id,
  form_submission_id,
  policy_section,
  agreed,
  signature_data,
  signed_at
) VALUES (
  gen_random_uuid(),
  'tenant-uuid-123',
  'submission-uuid-456',
  'Substance Use',  -- Changes for each section
  true,             -- Must be TRUE
  'data:image/png;base64,iVBORw0KGgoAAAANS...',  -- Base64 PNG signature
  NOW()
);
```

3. **Generate PDF with Signatures**:
- Use `pdfkit` or `jspdf` to create PDF
- Include all policy text with ☑ checkboxes
- Embed base64 signature images
- Include client logo and mission statement

4. **Upload PDF to Google Drive**:
- Upload to folder: "Housing Dashboard - Signed Agreements"
- Filename: `[Tenant Name] - Intake - [Date].pdf`
- Get Drive file URL

5. **Store PDF URL**:
```sql
UPDATE form_submissions
SET pdf_url = 'https://drive.google.com/file/d/abc123/view'
WHERE submission_id = 'submission-uuid-456';
```

---

## Conditional Field Logic

### Recovery Fields

**Condition**: `tenant_profiles.is_in_recovery = true`

**Fields Shown**:
- Drug of Choice
- Substances Previously Used
- Recovery Program
- Sober Date

**Implementation**:
```javascript
<Checkbox
  label="Are you in recovery?"
  checked={isInRecovery}
  onChange={(val) => setIsInRecovery(val)}
/>

{isInRecovery && (
  <>
    <Input label="Drug of Choice" name="drug_of_choice" />
    <TextArea label="Substances Previously Used" name="substances_used" />
    <Select label="Recovery Program" options={recoveryPrograms} />
    <DateInput label="Sober Date" name="sober_date" />
  </>
)}
```

---

### Legal/Probation Fields

**Condition**: `tenant_profiles.is_on_probation = true` OR `tenant_profiles.is_on_parole = true`

**Fields Shown (and Required)**:
- Probation/Parole Officer Name
- Probation/Parole Officer Phone
- Completion Date

**Implementation**:
```javascript
const showOfficerFields = isOnProbation || isOnParole;

{showOfficerFields && (
  <>
    <Input label="Officer Name" name="officer_name" required />
    <Input label="Officer Phone" name="officer_phone" required />
    <DateInput label="Completion Date" name="completion_date" required />
  </>
)}
```

---

### Sex Offender Details

**Condition**: `tenant_profiles.is_registered_sex_offender = true`

**Field Required**:
- Sex Offense Details (text area)

**Implementation**:
```javascript
<Checkbox
  label="Are you a Registered Sex Offender?"
  checked={isSexOffender}
  onChange={(val) => setIsSexOffender(val)}
/>

{isSexOffender && (
  <TextArea
    label="Sex Offense Details"
    name="sex_offense_details"
    required
    placeholder="Please provide details..."
  />
)}
```

---

## Required vs Optional Fields

### Application Form - Required Fields Matrix

| Field | Required | Condition |
|-------|----------|-----------|
| First Name | ✅ Always | - |
| Last Name | ✅ Always | - |
| Date of Birth | ✅ Always | - |
| Phone | ❌ Optional | - |
| Email | ❌ Optional | - |
| Most Recent Address | ❌ Optional | - |
| Profile Picture | ❌ Optional | - |
| Food Allergies | ❌ Optional | - |
| Employment Status | ❌ Optional | - |
| Employment Details | ❌ Optional | - |
| Is in Recovery? | ✅ Always | Boolean checkbox |
| Drug of Choice | ❌ Optional | Only if `is_in_recovery = true` |
| Recovery Program | ❌ Optional | Only if `is_in_recovery = true` |
| Sober Date | ❌ Optional | Only if `is_in_recovery = true` |
| Is on Probation? | ✅ Always | Boolean checkbox |
| Is on Parole? | ✅ Always | Boolean checkbox |
| Officer Name | ❌ Conditional | **Required** if probation OR parole = true |
| Officer Phone | ❌ Conditional | **Required** if probation OR parole = true |
| Completion Date | ❌ Conditional | **Required** if probation OR parole = true |
| Criminal History | ✅ Always | Text area (can be "None") |
| Is Registered Sex Offender? | ✅ Always | Boolean checkbox |
| Sex Offense Details | ❌ Conditional | **Required** if `is_registered_sex_offender = true` |
| Emergency Contact (at least 1) | ✅ Always | At least 1 contact required |
| Is Veteran? | ✅ Always | Boolean checkbox |
| Signature | ✅ Always | Base64 PNG |

---

### Intake Form - Required Fields Matrix

| Field | Required | Condition |
|-------|----------|-----------|
| All 10 Policy Checkboxes | ✅ Always | All must be checked (`agreed = true`) |
| All 10 Signatures | ✅ Always | All must have non-empty signature data |
| Printed Name | ✅ Always | - |
| Date of Birth | ✅ Always | Used to link to tenant record |

**Validation**:
```javascript
function validateIntakeForm(agreements) {
  const requiredSections = [
    'Substance Use', 'Recovery', 'Guest', 'Behavioral',
    'House', 'Safety', 'Rights', 'Medications', 'Neighbors', 'Payments'
  ];

  for (const section of requiredSections) {
    if (!agreements[section]?.agreed) {
      return { valid: false, message: `You must agree to the ${section} policy.` };
    }
    if (!agreements[section]?.signature) {
      return { valid: false, message: `You must sign the ${section} policy.` };
    }
  }

  return { valid: true };
}
```

---

## JSON Schema Examples

### Application Form JSON Structure

Stored in `form_submissions.form_data` (JSONB):

```json
{
  "personal": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "206-555-0100",
    "email": "john.doe@example.com",
    "dob": "1990-05-15",
    "most_recent_address": "Washington State Penitentiary - 1313 N 13th Ave, Walla Walla, WA 99362",
    "food_allergies": "Peanuts, shellfish",
    "employment_status": "Unemployed",
    "employment_details": null,
    "profile_picture_url": "https://xxxxx.supabase.co/storage/v1/object/public/tenant-profile-pictures/uuid-123.jpg"
  },
  "recovery": {
    "is_in_recovery": true,
    "drug_of_choice": "Opioids",
    "substances_previously_used": "Heroin, Fentanyl, Prescription painkillers",
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
    "is_registered_sex_offender": false,
    "sex_offense_details": null
  },
  "emergency_contacts": [
    {
      "first_name": "Jane",
      "last_name": "Doe",
      "phone": "206-555-0300",
      "email": "jane.doe@example.com",
      "relationship": "Mother",
      "address": "123 Oak St, Seattle, WA 98101",
      "is_primary": true
    },
    {
      "first_name": "John",
      "last_name": "Smith",
      "phone": "206-555-0400",
      "email": null,
      "relationship": "Brother",
      "address": null,
      "is_primary": false
    }
  ],
  "veteran_status": false,
  "signature": {
    "signature_base64": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "printed_name": "John Doe",
    "date": "2025-10-27"
  }
}
```

---

### Intake Form JSON Structure

Stored in `form_submissions.form_data` (JSONB):

```json
{
  "resident_info": {
    "first_name": "John",
    "last_name": "Doe",
    "dob": "1990-05-15"
  },
  "policies_acknowledged": true,
  "all_signatures_collected": true,
  "sections": {
    "substance_use": {
      "agreed": true,
      "signature_base64": "data:image/png;base64,iVBORw0KGgoAAAANS...",
      "signed_at": "2025-10-27T14:30:00Z"
    },
    "recovery": {
      "agreed": true,
      "signature_base64": "data:image/png;base64,iVBORw0KGgoAAAANS...",
      "signed_at": "2025-10-27T14:31:00Z"
    }
    // ... (8 more sections)
  }
}
```

---

## Database Query Examples

### Get Complete Tenant Profile

```sql
SELECT
  t.tenant_id,
  t.full_name,
  t.dob,
  t.phone,
  t.email,
  t.address,
  t.profile_picture_url,
  t.application_status,

  tp.is_in_recovery,
  tp.drug_of_choice,
  tp.recovery_program,
  tp.sober_date,
  tp.is_on_probation,
  tp.is_on_parole,
  tp.probation_parole_officer_name,
  tp.criminal_history,
  tp.is_registered_sex_offender,
  tp.is_veteran,

  json_agg(
    json_build_object(
      'name', ec.first_name || ' ' || ec.last_name,
      'phone', ec.phone,
      'relationship', ec.relationship,
      'is_primary', ec.is_primary
    )
  ) AS emergency_contacts

FROM tenants t
LEFT JOIN tenant_profiles tp ON t.tenant_id = tp.tenant_id
LEFT JOIN emergency_contacts ec ON t.tenant_id = ec.tenant_id
WHERE t.tenant_id = 'uuid-123'
GROUP BY t.tenant_id, tp.profile_id;
```

---

### Get All Policy Agreements for Tenant

```sql
SELECT
  pa.policy_section,
  pa.agreed,
  pa.signed_at,
  fs.pdf_url
FROM policy_agreements pa
JOIN form_submissions fs ON pa.form_submission_id = fs.submission_id
WHERE pa.tenant_id = 'uuid-123' AND fs.form_type = 'Intake'
ORDER BY pa.signed_at DESC;
```

---

### Find Incomplete Applications

```sql
SELECT
  t.full_name,
  t.dob,
  fs.submitted_at,
  fs.status,
  COUNT(ec.contact_id) AS emergency_contact_count
FROM tenants t
JOIN form_submissions fs ON t.tenant_id = fs.tenant_id
LEFT JOIN emergency_contacts ec ON t.tenant_id = ec.tenant_id
WHERE fs.form_type = 'Application' AND fs.status = 'Pending'
GROUP BY t.tenant_id, fs.submission_id
HAVING COUNT(ec.contact_id) = 0;  -- Missing emergency contacts
```

---

## Notes for Implementation

1. **Profile Picture Upload**: Use Supabase Storage API to upload images before submitting application form
2. **Emergency Contacts**: Frontend should allow adding 1-3 contacts dynamically (minimum 1 required)
3. **Conditional Validation**: Backend must validate that conditional required fields are present when their conditions are met
4. **Policy Agreements**: All 10 sections must have `agreed = true` and non-empty `signature_data` before submission
5. **PDF Generation**: Generate PDF asynchronously after form submission to avoid blocking
6. **Google Drive Upload**: Use service account credentials from `.env` to upload PDFs
7. **Tenant Lookup**: For Intake form, use `(full_name, dob)` to find matching tenant_id (should be unique)
