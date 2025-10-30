-- ============================================================================
-- Housing Dashboard - Development RLS Policies for Anon Role
-- ============================================================================
-- Created: October 30, 2025
-- Updated: October 30, 2025 (Added idempotency, tenant_profiles, emergency_contacts)
-- Purpose: Grant TEMPORARY permissive access to anon role for development
--
-- ⚠️ WARNING: UNSAFE FOR PRODUCTION ⚠️
-- These policies allow unauthenticated users (anon key) full CRUD access.
-- This is ONLY for development/testing purposes.
-- Run supabase-rls-production-access.sql before going to production!
--
-- Usage:
--   1. Copy and paste this entire script into Supabase SQL Editor
--   2. Run the script (can be run multiple times - it's idempotent)
--   3. Test your frontend CRUD operations
--   4. Before production, run supabase-rls-production-access.sql to remove these policies
--
-- Future Authentication Requirements:
--   - Manager auth: Standard email/password or magic link via Supabase Auth
--   - Tenant auth: Low-level credentials (name + DOB) for tenant portal access
--   - Duplicate application detection: Check name + DOB + phone on form submission
--   - Re-application workflow: Alert user, offer to update existing application
-- ============================================================================

-- ============================================================================
-- houses - Allow anon role full CRUD access (DEVELOPMENT ONLY)
-- ============================================================================

DROP POLICY IF EXISTS "DEV_ONLY_houses_select_anon" ON houses;
CREATE POLICY "DEV_ONLY_houses_select_anon" ON houses
    FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "DEV_ONLY_houses_insert_anon" ON houses;
CREATE POLICY "DEV_ONLY_houses_insert_anon" ON houses
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_houses_update_anon" ON houses;
CREATE POLICY "DEV_ONLY_houses_update_anon" ON houses
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_houses_delete_anon" ON houses;
CREATE POLICY "DEV_ONLY_houses_delete_anon" ON houses
    FOR DELETE
    TO anon
    USING (true);

-- ============================================================================
-- beds - Allow anon role full CRUD access (DEVELOPMENT ONLY)
-- ============================================================================

DROP POLICY IF EXISTS "DEV_ONLY_beds_select_anon" ON beds;
CREATE POLICY "DEV_ONLY_beds_select_anon" ON beds
    FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "DEV_ONLY_beds_insert_anon" ON beds;
CREATE POLICY "DEV_ONLY_beds_insert_anon" ON beds
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_beds_update_anon" ON beds;
CREATE POLICY "DEV_ONLY_beds_update_anon" ON beds
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_beds_delete_anon" ON beds;
CREATE POLICY "DEV_ONLY_beds_delete_anon" ON beds
    FOR DELETE
    TO anon
    USING (true);

-- ============================================================================
-- tenants - Allow anon role full CRUD access (DEVELOPMENT ONLY)
-- ============================================================================

DROP POLICY IF EXISTS "DEV_ONLY_tenants_select_anon" ON tenants;
CREATE POLICY "DEV_ONLY_tenants_select_anon" ON tenants
    FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "DEV_ONLY_tenants_insert_anon" ON tenants;
CREATE POLICY "DEV_ONLY_tenants_insert_anon" ON tenants
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_tenants_update_anon" ON tenants;
CREATE POLICY "DEV_ONLY_tenants_update_anon" ON tenants
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_tenants_delete_anon" ON tenants;
CREATE POLICY "DEV_ONLY_tenants_delete_anon" ON tenants
    FOR DELETE
    TO anon
    USING (true);

-- ============================================================================
-- tenant_profiles - Allow anon role full CRUD access (DEVELOPMENT ONLY)
-- ============================================================================

DROP POLICY IF EXISTS "DEV_ONLY_tenant_profiles_select_anon" ON tenant_profiles;
CREATE POLICY "DEV_ONLY_tenant_profiles_select_anon" ON tenant_profiles
    FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "DEV_ONLY_tenant_profiles_insert_anon" ON tenant_profiles;
CREATE POLICY "DEV_ONLY_tenant_profiles_insert_anon" ON tenant_profiles
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_tenant_profiles_update_anon" ON tenant_profiles;
CREATE POLICY "DEV_ONLY_tenant_profiles_update_anon" ON tenant_profiles
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_tenant_profiles_delete_anon" ON tenant_profiles;
CREATE POLICY "DEV_ONLY_tenant_profiles_delete_anon" ON tenant_profiles
    FOR DELETE
    TO anon
    USING (true);

-- ============================================================================
-- emergency_contacts - Allow anon role full CRUD access (DEVELOPMENT ONLY)
-- ============================================================================

DROP POLICY IF EXISTS "DEV_ONLY_emergency_contacts_select_anon" ON emergency_contacts;
CREATE POLICY "DEV_ONLY_emergency_contacts_select_anon" ON emergency_contacts
    FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "DEV_ONLY_emergency_contacts_insert_anon" ON emergency_contacts;
CREATE POLICY "DEV_ONLY_emergency_contacts_insert_anon" ON emergency_contacts
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_emergency_contacts_update_anon" ON emergency_contacts;
CREATE POLICY "DEV_ONLY_emergency_contacts_update_anon" ON emergency_contacts
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "DEV_ONLY_emergency_contacts_delete_anon" ON emergency_contacts;
CREATE POLICY "DEV_ONLY_emergency_contacts_delete_anon" ON emergency_contacts
    FOR DELETE
    TO anon
    USING (true);

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this query to verify all DEV_ONLY policies were created:
--
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE policyname LIKE 'DEV_ONLY_%'
-- ORDER BY tablename, cmd;
--
-- Expected: 20 policies (5 tables × 4 operations: SELECT, INSERT, UPDATE, DELETE)
-- ============================================================================

-- ============================================================================
-- IMPORTANT REMINDERS
-- ============================================================================
--
-- 1. These policies are EXTREMELY PERMISSIVE and UNSAFE for production
-- 2. Any user with your anon key can now perform ANY operation on these tables
-- 3. The anon key is PUBLIC (exposed in frontend code)
-- 4. Before deploying to production:
--    a) Run supabase-rls-production-access.sql to remove these policies
--    b) Implement proper authentication (Supabase Auth)
--    c) Add role-based access control (manager vs tenant)
-- 5. These policies are prefixed with "DEV_ONLY_" to make them easy to identify
--
-- ============================================================================
