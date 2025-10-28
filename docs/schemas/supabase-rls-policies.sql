-- ============================================================================
-- Housing Dashboard - Row Level Security (RLS) Policies
-- ============================================================================
-- Created: October 27, 2025
-- Purpose: Secure all tables with Row Level Security policies
--
-- Security Model:
--   1. Public (unauthenticated) - Can submit intake forms only
--   2. Tenant (authenticated) - Read-only access to own data
--   3. Manager (authenticated + admin role) - Full CRUD access
--
-- Note: For DEVELOPMENT, we're using permissive policies.
--       For PRODUCTION, uncomment the restrictive policies at the bottom.
-- ============================================================================

-- ============================================================================
-- STEP 1: Enable RLS on All Tables
-- ============================================================================
-- Once RLS is enabled, NO ONE can access data unless a policy explicitly allows it

ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Development Policies (Permissive - For Testing)
-- ============================================================================
-- These policies allow authenticated users to do anything.
-- Useful during development when you're testing with the anon key.
-- DISABLE these in production!

-- ============================================================================
-- houses - Manager Only
-- ============================================================================

-- Allow authenticated users to read all houses
CREATE POLICY "houses_select_authenticated" ON houses
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert houses
CREATE POLICY "houses_insert_authenticated" ON houses
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update houses
CREATE POLICY "houses_update_authenticated" ON houses
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete houses
CREATE POLICY "houses_delete_authenticated" ON houses
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- beds - Manager Only
-- ============================================================================

CREATE POLICY "beds_select_authenticated" ON beds
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "beds_insert_authenticated" ON beds
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "beds_update_authenticated" ON beds
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "beds_delete_authenticated" ON beds
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- tenants - Manager Full Access, Tenants Read Own Data
-- ============================================================================

-- Allow authenticated users to read all tenants (for now - will restrict in production)
CREATE POLICY "tenants_select_authenticated" ON tenants
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "tenants_insert_authenticated" ON tenants
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "tenants_update_authenticated" ON tenants
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "tenants_delete_authenticated" ON tenants
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- tenant_profiles - Manager Full Access, Tenants Read Own Profile
-- ============================================================================

CREATE POLICY "tenant_profiles_select_authenticated" ON tenant_profiles
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "tenant_profiles_insert_authenticated" ON tenant_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "tenant_profiles_update_authenticated" ON tenant_profiles
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "tenant_profiles_delete_authenticated" ON tenant_profiles
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- emergency_contacts - Manager Full Access, Tenants Read Own Contacts
-- ============================================================================

CREATE POLICY "emergency_contacts_select_authenticated" ON emergency_contacts
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "emergency_contacts_insert_authenticated" ON emergency_contacts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "emergency_contacts_update_authenticated" ON emergency_contacts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "emergency_contacts_delete_authenticated" ON emergency_contacts
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- form_submissions - Public Can Insert, Authenticated Can Read/Update
-- ============================================================================

-- Public can submit intake forms (unauthenticated)
CREATE POLICY "form_submissions_insert_public" ON form_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Authenticated users can read all submissions
CREATE POLICY "form_submissions_select_authenticated" ON form_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can update submissions (for manager approval)
CREATE POLICY "form_submissions_update_authenticated" ON form_submissions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated users can delete submissions
CREATE POLICY "form_submissions_delete_authenticated" ON form_submissions
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- policy_agreements - Public Can Insert, Authenticated Can Read
-- ============================================================================

-- Public can submit policy agreements (as part of intake form)
CREATE POLICY "policy_agreements_insert_public" ON policy_agreements
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Authenticated users can read all agreements
CREATE POLICY "policy_agreements_select_authenticated" ON policy_agreements
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "policy_agreements_update_authenticated" ON policy_agreements
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "policy_agreements_delete_authenticated" ON policy_agreements
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- system_settings - Public Can Read, Authenticated Can Update
-- ============================================================================

-- Public can read system settings (to display voucher rates on forms)
CREATE POLICY "system_settings_select_public" ON system_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Authenticated users can update settings (managers only in production)
CREATE POLICY "system_settings_update_authenticated" ON system_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- PRODUCTION POLICIES (Commented Out - Uncomment When Ready)
-- ============================================================================
--
-- These policies are more restrictive and use custom claims to distinguish
-- managers from tenants.
--
-- Prerequisites:
-- 1. Set up Supabase Auth (email/password or magic link)
-- 2. Add custom claim 'role' to user metadata (either 'manager' or 'tenant')
-- 3. Create a helper function to check if user is a manager:
--
-- CREATE OR REPLACE FUNCTION is_manager()
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   RETURN (auth.jwt() ->> 'role') = 'manager';
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- ============================================================================

-- Example Production Policy for tenants table:
--
-- -- Managers can read all tenants
-- CREATE POLICY "tenants_select_manager" ON tenants
--     FOR SELECT
--     TO authenticated
--     USING (is_manager());
--
-- -- Tenants can only read their own record
-- CREATE POLICY "tenants_select_own" ON tenants
--     FOR SELECT
--     TO authenticated
--     USING (auth.uid()::text = tenant_id::text);
--
-- -- Only managers can insert/update/delete tenants
-- CREATE POLICY "tenants_insert_manager" ON tenants
--     FOR INSERT
--     TO authenticated
--     WITH CHECK (is_manager());
--
-- CREATE POLICY "tenants_update_manager" ON tenants
--     FOR UPDATE
--     TO authenticated
--     USING (is_manager())
--     WITH CHECK (is_manager());
--
-- CREATE POLICY "tenants_delete_manager" ON tenants
--     FOR DELETE
--     TO authenticated
--     USING (is_manager());

-- ============================================================================
-- TESTING RLS POLICIES
-- ============================================================================
--
-- Test as authenticated user (using anon key from frontend):
--   - Should be able to read/write all data (development policies)
--
-- Test as unauthenticated (public):
--   - Should be able to INSERT into form_submissions and policy_agreements
--   - Should be able to SELECT from system_settings
--   - Should NOT be able to access any other tables
--
-- To test in Supabase SQL Editor:
--   SET LOCAL ROLE anon;  -- Test as public/unauthenticated
--   SELECT * FROM houses; -- Should return 0 rows (no policy allows this)
--
--   RESET ROLE;           -- Back to admin
--
-- ============================================================================

-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================
--
-- 1. Service Role Key Bypasses RLS:
--    - The service_role key (secret) bypasses ALL RLS policies
--    - NEVER expose service_role key to frontend
--    - Only use service_role in backend/serverless functions
--
-- 2. Anon Key Respects RLS:
--    - The anon key (public) is subject to RLS policies
--    - Safe to expose in frontend code
--    - Users can only access data allowed by policies
--
-- 3. Development vs Production:
--    - Current policies are PERMISSIVE (any authenticated user can do anything)
--    - Before production launch, replace with RESTRICTIVE policies
--    - Add role-based access control (manager vs tenant)
--
-- 4. Testing:
--    - Test with the anon key to verify policies work correctly
--    - Create test users with different roles
--    - Verify tenants can't see other tenants' data
--
-- ============================================================================
