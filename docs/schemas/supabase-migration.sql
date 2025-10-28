-- ============================================================================
-- Housing Dashboard - Complete Database Schema Migration
-- ============================================================================
-- Created: October 27, 2025
-- Database: Supabase (PostgreSQL)
-- Purpose: Creates all 8 tables for Housing Dashboard MVP
--
-- Tables Created:
--   1. houses - Property information
--   2. beds - Bed inventory per property
--   3. tenants - Resident core information
--   4. tenant_profiles - Extended resident profiles (recovery, legal, etc.)
--   5. emergency_contacts - Emergency contact information
--   6. form_submissions - Application/Intake form tracking
--   7. policy_agreements - Policy section signatures (10 sections)
--   8. system_settings - Configurable system settings (voucher rates, etc.)
--
-- Note: Safe to re-run during development (uses DROP TABLE IF EXISTS)
-- ============================================================================

-- Enable UUID extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DROP EXISTING TABLES (Development Only - Allows Clean Re-runs)
-- ============================================================================
-- Drop in reverse order to avoid foreign key constraint errors

DROP TABLE IF EXISTS policy_agreements CASCADE;
DROP TABLE IF EXISTS form_submissions CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS tenant_profiles CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS beds CASCADE;
DROP TABLE IF EXISTS houses CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- ============================================================================
-- TABLE 1: houses
-- ============================================================================
-- Purpose: Stores halfway house properties
-- Relationships: One house has many beds (one-to-many)

CREATE TABLE houses (
    house_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address VARCHAR(255) NOT NULL UNIQUE,
    county VARCHAR(64) NOT NULL DEFAULT 'King County',
    total_beds INT NOT NULL CHECK (total_beds >= 0),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE houses IS 'Halfway house properties managed by the organization';
COMMENT ON COLUMN houses.county IS 'County where property is located (supports multi-county expansion)';
COMMENT ON COLUMN houses.total_beds IS 'Total number of beds/rooms in this property';

-- ============================================================================
-- TABLE 2: beds
-- ============================================================================
-- Purpose: Individual bed/room inventory
-- Relationships: Belongs to one house, can have one current tenant

CREATE TABLE beds (
    bed_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    house_id UUID NOT NULL REFERENCES houses(house_id) ON DELETE CASCADE,
    room_number VARCHAR(32) NOT NULL,
    base_rent NUMERIC(8,2) NOT NULL DEFAULT 0.00 CHECK (base_rent >= 0),
    status VARCHAR(16) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Pending', 'Hold')),
    tenant_id UUID, -- Foreign key constraint added later (after tenants table created)
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(house_id, room_number)
);

COMMENT ON TABLE beds IS 'Individual bed/room inventory for each property';
COMMENT ON COLUMN beds.base_rent IS 'Standard monthly rent for this bed (may differ from actual tenant rent)';
COMMENT ON COLUMN beds.status IS 'Current availability: Available, Occupied, Pending, Hold';
COMMENT ON COLUMN beds.tenant_id IS 'Current occupant (NULL if available) - FK constraint added after tables created';

-- ============================================================================
-- TABLE 3: tenants
-- ============================================================================
-- Purpose: Core resident information
-- Relationships: Occupies one bed, has one profile, multiple emergency contacts

CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Info (Universal)
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(32),
    email VARCHAR(255),
    address VARCHAR(255),
    gender VARCHAR(32),
    profile_picture_url TEXT,

    -- Tenant Classification (for filtering/grouping)
    tenant_types TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Housing Dates
    entry_date DATE,
    exit_date DATE,

    -- Payment Info (Universal - all tenants have payment obligations)
    payment_type VARCHAR(32),
    actual_rent NUMERIC(8,2) CHECK (actual_rent >= 0),
    voucher_start DATE,
    voucher_end DATE,
    rent_due NUMERIC(8,2) DEFAULT 0.00 CHECK (rent_due >= 0),
    rent_paid NUMERIC(8,2) DEFAULT 0.00 CHECK (rent_paid >= 0),

    -- Application Status
    application_status VARCHAR(32) DEFAULT 'Pending' CHECK (application_status IN ('Pending', 'Approved', 'Rejected', 'Waitlist')),

    -- Current Bed Assignment
    bed_id UUID REFERENCES beds(bed_id) ON DELETE SET NULL,

    -- Notes
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE tenants IS 'Core resident information: identity, housing, and payment data';
COMMENT ON COLUMN tenants.tenant_types IS 'Array of tenant types: DOC, TeleCare, Private (can have multiple, used for filtering)';
COMMENT ON COLUMN tenants.payment_type IS 'How tenant pays rent: Voucher, Private Pay, TeleCare, Section 8, etc.';
COMMENT ON COLUMN tenants.actual_rent IS 'Actual rent charged (may differ from bed base_rent for vouchers)';
COMMENT ON COLUMN tenants.application_status IS 'Application workflow status: Pending, Approved, Rejected, Waitlist';

-- ============================================================================
-- TABLE 4: tenant_profiles
-- ============================================================================
-- Purpose: Extended tenant profile (program-specific, recovery, legal, employment)
-- Relationships: One-to-one with tenants

CREATE TABLE tenant_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(tenant_id) ON DELETE CASCADE,

    -- Program-Specific IDs
    doc_number VARCHAR(64),
    telecare_id VARCHAR(64),

    -- DOC-Specific: Community Corrections Officer
    cco_name VARCHAR(255),
    cco_phone VARCHAR(32),

    -- DOC-Specific: Estimated Release Date (for pending inmates)
    is_erd BOOLEAN DEFAULT FALSE,
    erd_date DATE,

    -- Employment
    employment_status VARCHAR(32),
    employment_details TEXT,
    food_allergies TEXT,

    -- Recovery Information
    is_in_recovery BOOLEAN DEFAULT FALSE,
    drug_of_choice VARCHAR(64),
    substances_previously_used TEXT,
    recovery_program VARCHAR(64),
    sober_date DATE,

    -- Legal/Probation/Parole
    is_on_probation BOOLEAN DEFAULT FALSE,
    is_on_parole BOOLEAN DEFAULT FALSE,
    probation_parole_officer_name VARCHAR(128),
    probation_parole_officer_phone VARCHAR(32),
    probation_parole_completion_date DATE,
    criminal_history TEXT,

    -- Sex Offender Status
    is_registered_sex_offender BOOLEAN DEFAULT FALSE,
    sex_offense_details TEXT,

    -- Veteran Status
    is_veteran BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE tenant_profiles IS 'Extended tenant profile: program-specific data (DOC, TeleCare), recovery, legal, employment (1:1 with tenants)';
COMMENT ON COLUMN tenant_profiles.doc_number IS 'Department of Corrections ID (DOC tenants only)';
COMMENT ON COLUMN tenant_profiles.telecare_id IS 'TeleCare program ID (TeleCare tenants only)';
COMMENT ON COLUMN tenant_profiles.is_erd IS 'Estimated Release Date flag for pending DOC inmates';
COMMENT ON COLUMN tenant_profiles.is_in_recovery IS 'Determines if recovery-related fields are shown in application';
COMMENT ON COLUMN tenant_profiles.is_registered_sex_offender IS 'If true, sex_offense_details is required';

-- ============================================================================
-- TABLE 5: emergency_contacts
-- ============================================================================
-- Purpose: Emergency contact information (1-3 per tenant)
-- Relationships: Multiple contacts per tenant

CREATE TABLE emergency_contacts (
    contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,

    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    relationship VARCHAR(64) NOT NULL,
    address VARCHAR(255),
    additional_info TEXT,
    is_primary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE emergency_contacts IS 'Emergency contact information (minimum 1 required per tenant)';
COMMENT ON COLUMN emergency_contacts.is_primary IS 'Designates the primary emergency contact';

-- ============================================================================
-- TABLE 6: form_submissions
-- ============================================================================
-- Purpose: Tracks Application and Intake form submissions
-- Relationships: One tenant can have multiple form submissions

CREATE TABLE form_submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,

    form_type VARCHAR(32) NOT NULL CHECK (form_type IN ('Application', 'Intake')),
    form_data JSONB NOT NULL,
    status VARCHAR(32) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),

    pdf_url TEXT,

    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR(255)
);

COMMENT ON TABLE form_submissions IS 'Application and Intake form submissions with full form data stored as JSON';
COMMENT ON COLUMN form_submissions.form_type IS 'Type of form: Application or Intake';
COMMENT ON COLUMN form_submissions.form_data IS 'Complete form data stored as JSONB for flexibility';
COMMENT ON COLUMN form_submissions.pdf_url IS 'URL to generated PDF (uploaded to Google Drive)';

-- ============================================================================
-- TABLE 7: policy_agreements
-- ============================================================================
-- Purpose: Tracks individual policy section agreements (10 sections)
-- Relationships: Multiple agreements per tenant (one per policy section)

CREATE TABLE policy_agreements (
    agreement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    form_submission_id UUID REFERENCES form_submissions(submission_id) ON DELETE CASCADE,

    policy_section VARCHAR(64) NOT NULL CHECK (policy_section IN (
        'Substance Use', 'Recovery', 'Guest', 'Behavioral',
        'House', 'Safety', 'Rights', 'Medications',
        'Neighbors', 'Payments'
    )),

    agreed BOOLEAN NOT NULL DEFAULT FALSE,
    signature_data TEXT NOT NULL,
    signed_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(tenant_id, form_submission_id, policy_section)
);

COMMENT ON TABLE policy_agreements IS '10 policy section agreements with individual signatures';
COMMENT ON COLUMN policy_agreements.policy_section IS 'One of 10 policy sections (must all be signed for Intake)';
COMMENT ON COLUMN policy_agreements.signature_data IS 'Base64 PNG signature image';

-- ============================================================================
-- TABLE 8: system_settings
-- ============================================================================
-- Purpose: Configurable system-wide settings (voucher rates, etc.)

CREATE TABLE system_settings (
    setting_key VARCHAR(64) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(32) NOT NULL CHECK (setting_type IN ('number', 'string', 'boolean')),
    description TEXT,
    last_updated TIMESTAMP DEFAULT NOW(),
    updated_by VARCHAR(255)
);

COMMENT ON TABLE system_settings IS 'System-wide configurable settings (voucher rates, etc.)';

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
VALUES
    ('voucher_rate', '700.00', 'number', 'Standard monthly voucher payment amount'),
    ('telecare_rate', '750.00', 'number', 'Standard TeleCare monthly payment'),
    ('section8_rate', '800.00', 'number', 'Standard Section 8 voucher rate');

-- ============================================================================
-- ADD CIRCULAR FOREIGN KEY CONSTRAINTS
-- ============================================================================
-- Add foreign keys that have circular dependencies (beds ↔ tenants)
-- These must be added AFTER both tables exist

-- beds.tenant_id → tenants.tenant_id
ALTER TABLE beds
ADD CONSTRAINT fk_beds_tenant_id
FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE SET NULL;

-- ============================================================================
-- INDEXES (Performance Optimization)
-- ============================================================================

-- houses
CREATE INDEX idx_houses_county ON houses(county);

-- beds
CREATE INDEX idx_beds_house_id ON beds(house_id);
CREATE INDEX idx_beds_status ON beds(status);
CREATE INDEX idx_beds_tenant_id ON beds(tenant_id);

-- tenants
CREATE INDEX idx_tenants_full_name ON tenants(full_name);
CREATE INDEX idx_tenants_dob ON tenants(dob);
CREATE INDEX idx_tenants_application_status ON tenants(application_status);
CREATE INDEX idx_tenants_bed_id ON tenants(bed_id);
CREATE INDEX idx_tenants_voucher_end ON tenants(voucher_end);
CREATE INDEX idx_tenants_payment_type ON tenants(payment_type);
CREATE INDEX idx_tenants_tenant_types ON tenants USING GIN(tenant_types);

-- tenant_profiles
CREATE INDEX idx_tenant_profiles_tenant_id ON tenant_profiles(tenant_id);
CREATE INDEX idx_tenant_profiles_doc_number ON tenant_profiles(doc_number);
CREATE INDEX idx_tenant_profiles_telecare_id ON tenant_profiles(telecare_id);

-- emergency_contacts
CREATE INDEX idx_emergency_contacts_tenant_id ON emergency_contacts(tenant_id);

-- form_submissions
CREATE INDEX idx_form_submissions_tenant_id ON form_submissions(tenant_id);
CREATE INDEX idx_form_submissions_form_type ON form_submissions(form_type);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);

-- policy_agreements
CREATE INDEX idx_policy_agreements_tenant_id ON policy_agreements(tenant_id);
CREATE INDEX idx_policy_agreements_form_submission_id ON policy_agreements(form_submission_id);

-- ============================================================================
-- CONSTRAINTS SUMMARY
-- ============================================================================
--
-- Foreign Keys:
-- - beds.house_id → houses.house_id (CASCADE on delete)
-- - beds.tenant_id → tenants.tenant_id (SET NULL on delete)
-- - tenants.bed_id → beds.bed_id (SET NULL on delete)
-- - tenant_profiles.tenant_id → tenants.tenant_id (CASCADE on delete)
-- - emergency_contacts.tenant_id → tenants.tenant_id (CASCADE on delete)
-- - form_submissions.tenant_id → tenants.tenant_id (CASCADE on delete)
-- - policy_agreements.tenant_id → tenants.tenant_id (CASCADE on delete)
-- - policy_agreements.form_submission_id → form_submissions.submission_id (CASCADE)
--
-- Check Constraints:
-- - houses.total_beds >= 0
-- - beds.base_rent >= 0
-- - beds.status IN ('Available', 'Occupied', 'Pending', 'Hold')
-- - tenants.actual_rent >= 0
-- - tenants.rent_due >= 0
-- - tenants.rent_paid >= 0
-- - tenants.application_status IN ('Pending', 'Approved', 'Rejected', 'Waitlist')
-- - form_submissions.form_type IN ('Application', 'Intake')
-- - form_submissions.status IN ('Pending', 'Approved', 'Rejected')
-- - policy_agreements.policy_section IN (10 valid sections)
-- - system_settings.setting_type IN ('number', 'string', 'boolean')
--
-- Unique Constraints:
-- - houses.address (UNIQUE)
-- - beds(house_id, room_number) (UNIQUE combination)
-- - tenant_profiles.tenant_id (UNIQUE - enforces 1:1 relationship)
-- - policy_agreements(tenant_id, form_submission_id, policy_section) (UNIQUE)
--
-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
--
-- Next Steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify all 8 tables created successfully
-- 3. Set up Row Level Security (RLS) policies
-- 4. Create Storage bucket for profile pictures
-- 5. Seed with test data
--
-- ============================================================================
