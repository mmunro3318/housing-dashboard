-- ============================================================================
-- Housing Dashboard - Remove Development RLS Policies (Production Prep)
-- ============================================================================
-- Created: October 30, 2025
-- Updated: October 30, 2025 (Added tenant_profiles, emergency_contacts)
-- Purpose: Remove permissive anon policies before production deployment
--
-- ✅ SAFE FOR PRODUCTION ✅
-- This script removes all DEV_ONLY policies that grant anon role access.
-- Run this script before deploying to production.
--
-- Prerequisites:
--   1. Implement proper authentication:
--      - Manager auth: Standard email/password or magic link via Supabase Auth
--      - Tenant auth: Low-level credentials (name + DOB) for tenant portal access
--   2. Add role-based access control (custom claims: 'manager' or 'tenant')
--   3. Implement duplicate application detection (check name + DOB + phone on form submission)
--   4. Test all functionality with authenticated users
--
-- Usage:
--   1. Verify you've implemented proper authentication
--   2. Copy and paste this entire script into Supabase SQL Editor
--   3. Run the script (idempotent - safe to run multiple times)
--   4. Test your application with authenticated users
--   5. Verify anon users can no longer access CRUD operations
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop all DEV_ONLY policies for anon role
-- ============================================================================

-- Drop houses DEV_ONLY policies
DROP POLICY IF EXISTS "DEV_ONLY_houses_select_anon" ON houses;
DROP POLICY IF EXISTS "DEV_ONLY_houses_insert_anon" ON houses;
DROP POLICY IF EXISTS "DEV_ONLY_houses_update_anon" ON houses;
DROP POLICY IF EXISTS "DEV_ONLY_houses_delete_anon" ON houses;

-- Drop beds DEV_ONLY policies
DROP POLICY IF EXISTS "DEV_ONLY_beds_select_anon" ON beds;
DROP POLICY IF EXISTS "DEV_ONLY_beds_insert_anon" ON beds;
DROP POLICY IF EXISTS "DEV_ONLY_beds_update_anon" ON beds;
DROP POLICY IF EXISTS "DEV_ONLY_beds_delete_anon" ON beds;

-- Drop tenants DEV_ONLY policies
DROP POLICY IF EXISTS "DEV_ONLY_tenants_select_anon" ON tenants;
DROP POLICY IF EXISTS "DEV_ONLY_tenants_insert_anon" ON tenants;
DROP POLICY IF EXISTS "DEV_ONLY_tenants_update_anon" ON tenants;
DROP POLICY IF EXISTS "DEV_ONLY_tenants_delete_anon" ON tenants;

-- Drop tenant_profiles DEV_ONLY policies
DROP POLICY IF EXISTS "DEV_ONLY_tenant_profiles_select_anon" ON tenant_profiles;
DROP POLICY IF EXISTS "DEV_ONLY_tenant_profiles_insert_anon" ON tenant_profiles;
DROP POLICY IF EXISTS "DEV_ONLY_tenant_profiles_update_anon" ON tenant_profiles;
DROP POLICY IF EXISTS "DEV_ONLY_tenant_profiles_delete_anon" ON tenant_profiles;

-- Drop emergency_contacts DEV_ONLY policies
DROP POLICY IF EXISTS "DEV_ONLY_emergency_contacts_select_anon" ON emergency_contacts;
DROP POLICY IF EXISTS "DEV_ONLY_emergency_contacts_insert_anon" ON emergency_contacts;
DROP POLICY IF EXISTS "DEV_ONLY_emergency_contacts_update_anon" ON emergency_contacts;
DROP POLICY IF EXISTS "DEV_ONLY_emergency_contacts_delete_anon" ON emergency_contacts;

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this query to verify all DEV_ONLY policies were removed:
--
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE policyname LIKE 'DEV_ONLY_%'
-- ORDER BY tablename, cmd;
--
-- Expected: 0 rows (all DEV_ONLY policies should be gone)
-- ============================================================================

-- ============================================================================
-- STEP 2: Verify Existing Production Policies
-- ============================================================================
-- These policies should already exist from supabase-rls-policies.sql.
-- Verify they're still active:
--
-- SELECT schemaname, tablename, policyname, roles, cmd
-- FROM pg_policies
-- WHERE tablename IN ('houses', 'beds', 'tenants', 'tenant_profiles', 'emergency_contacts')
--   AND policyname LIKE '%authenticated%'
-- ORDER BY tablename, cmd;
--
-- Expected: Policies for authenticated users (from supabase-rls-policies.sql)
-- ============================================================================

-- ============================================================================
-- STEP 3: (OPTIONAL) Add Role-Based Policies for Production
-- ============================================================================
-- The current authenticated policies allow ANY authenticated user full access.
-- For production, you may want to restrict access based on user role (manager vs tenant).
--
-- To implement role-based access:
--
-- 1. Create a helper function to check if user is a manager:
--
-- CREATE OR REPLACE FUNCTION is_manager()
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   RETURN (auth.jwt() ->> 'role') = 'manager';
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- 2. Drop the permissive authenticated policies and replace with role-specific ones:
--
-- Example for houses table:
--
-- DROP POLICY IF EXISTS "houses_select_authenticated" ON houses;
-- DROP POLICY IF EXISTS "houses_insert_authenticated" ON houses;
-- DROP POLICY IF EXISTS "houses_update_authenticated" ON houses;
-- DROP POLICY IF EXISTS "houses_delete_authenticated" ON houses;
--
-- CREATE POLICY "houses_select_manager" ON houses
--     FOR SELECT
--     TO authenticated
--     USING (is_manager());
--
-- CREATE POLICY "houses_insert_manager" ON houses
--     FOR INSERT
--     TO authenticated
--     WITH CHECK (is_manager());
--
-- CREATE POLICY "houses_update_manager" ON houses
--     FOR UPDATE
--     TO authenticated
--     USING (is_manager())
--     WITH CHECK (is_manager());
--
-- CREATE POLICY "houses_delete_manager" ON houses
--     FOR DELETE
--     TO authenticated
--     USING (is_manager());
--
-- Repeat similar policies for beds and tenants tables.
--
-- For tenants table, you may want to allow tenants to read their own record:
--
-- CREATE POLICY "tenants_select_own" ON tenants
--     FOR SELECT
--     TO authenticated
--     USING (auth.uid()::text = tenant_id::text OR is_manager());
--
-- ============================================================================

-- ============================================================================
-- STEP 4: Test After Removing DEV_ONLY Policies
-- ============================================================================
-- After running this script, test your application:
--
-- 1. Unauthenticated users (anon key):
--    - Should NOT be able to access houses, beds, or tenants
--    - Should get RLS policy violation errors
--    - Can still submit intake forms (form_submissions, policy_agreements)
--
-- 2. Authenticated users (logged in):
--    - Should be able to access all data (with current authenticated policies)
--    - Or only data allowed by their role (if you implemented role-based policies)
--
-- 3. Test in Supabase SQL Editor:
--    SET LOCAL ROLE anon;
--    SELECT * FROM houses; -- Should return 0 rows (no policy allows this)
--    RESET ROLE;
--
-- ============================================================================

-- ============================================================================
-- IMPORTANT PRODUCTION CHECKLIST
-- ============================================================================
--
-- Before deploying to production, ensure:
--
-- ✅ 1. All DEV_ONLY policies are removed (run this script)
-- ✅ 2. Supabase Auth is properly configured
-- ✅ 3. User registration/login flows are implemented
-- ✅ 4. Role-based access is implemented (optional but recommended)
-- ✅ 5. Service role key is NEVER exposed to frontend
-- ✅ 6. Anon key is the only key used in frontend
-- ✅ 7. All CRUD operations require authentication
-- ✅ 8. Test all functionality with real authenticated users
-- ✅ 9. Verify error handling for unauthorized access attempts
-- ✅ 10. Review all policies with a security mindset
--
-- ============================================================================
