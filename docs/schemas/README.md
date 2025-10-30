# Database Schema Documentation

This directory contains all SQL scripts for setting up and managing the Housing Dashboard database in Supabase.

## 📁 Files Overview

| File | Purpose | When to Run |
|------|---------|-------------|
| **supabase-migration.sql** | Initial database setup: creates all tables, triggers, functions | Once during initial setup |
| **supabase-rls-policies.sql** | Production-ready RLS policies for authenticated users | Once after migration (production baseline) |
| **supabase-rls-dev-access.sql** | Development-only: grants temporary anon CRUD access | During development only (idempotent) |
| **supabase-rls-production-access.sql** | Cleanup script: removes all DEV_ONLY policies | Before production deployment |
| **field-mapping.md** | Documentation: maps Excel fields to database columns | Reference only |

---

## 🚀 Initial Setup (One-Time)

Run these scripts in order when setting up a new Supabase project:

### 1. Create Tables and Schema
```sql
-- Run: supabase-migration.sql
-- Creates: houses, beds, tenants, tenant_profiles, emergency_contacts,
--          form_submissions, policy_agreements, system_settings
-- Includes: Triggers, functions, indexes, foreign keys
```

### 2. Apply Production RLS Policies
```sql
-- Run: supabase-rls-policies.sql
-- Sets up: Base RLS policies for production
-- Grants: authenticated users full CRUD access
-- Restricts: anon users to intake form tables only
```

### 3. Enable Development Access
```sql
-- Run: supabase-rls-dev-access.sql
-- Creates: DEV_ONLY policies for anon role
-- Allows: Frontend testing with anon key
-- Note: Safe to run multiple times (idempotent)
```

---

## 🔧 Development Workflow

### Current Permission Model

| Role | Houses/Beds/Tenants | Form Submissions | System Settings |
|------|---------------------|------------------|-----------------|
| **anon (dev)** | ✅ Full CRUD | ✅ INSERT only | ✅ SELECT only |
| **authenticated** | ✅ Full CRUD | ✅ Full CRUD | ✅ Full CRUD |

### Why DEV_ONLY Policies?

During development, your frontend uses the **anon** Supabase key (which is safe to expose publicly). However, production security requires authentication. The `DEV_ONLY` policies allow you to develop and test CRUD operations without implementing auth first.

### Development Commands

```bash
# Check current policies
SELECT tablename, policyname, roles
FROM pg_policies
WHERE policyname LIKE 'DEV_ONLY_%'
ORDER BY tablename;

# Re-apply dev policies (if needed)
# Run: supabase-rls-dev-access.sql (idempotent)

# Test that anon can access data
SET LOCAL ROLE anon;
SELECT * FROM houses LIMIT 1;  -- Should return data
RESET ROLE;
```

---

## 🚀 Production Deployment

Before deploying to production, you **must** remove the DEV_ONLY policies:

### 1. Implement Authentication

Before removing dev policies, ensure you have:
- ✅ Supabase Auth configured (email/password or magic link)
- ✅ Frontend login/logout flows implemented
- ✅ Manager role assignment mechanism
- ✅ Tenant authentication (low-level: name + DOB)
- ✅ All CRUD operations tested with authenticated users

### 2. Remove DEV_ONLY Policies

```sql
-- Run: supabase-rls-production-access.sql
-- Drops: All 20 DEV_ONLY policies
-- Result: anon users can no longer access houses/beds/tenants
```

### 3. Verify Production Security

```bash
# Test that anon CANNOT access sensitive data
SET LOCAL ROLE anon;
SELECT * FROM houses;  -- Should return 0 rows (no policy allows this)
SELECT * FROM tenants; -- Should return 0 rows
RESET ROLE;

# Test that anon CAN still submit intake forms
SET LOCAL ROLE anon;
INSERT INTO form_submissions (full_name, dob, phone)
VALUES ('Test User', '1990-01-01', '555-0100');  -- Should succeed
RESET ROLE;

# Test that authenticated users CAN access data
SET LOCAL ROLE authenticated;
SELECT * FROM houses;  -- Should return data
RESET ROLE;
```

### 4. Optional: Implement Role-Based Access

The current production policies allow **any authenticated user** full CRUD access. For tighter security, see the commented examples in `supabase-rls-production-access.sql` for:
- Manager-only CRUD operations
- Tenant read-only access to own records
- Custom `is_manager()` helper function

---

## 🔐 Security Model

### Current Policies (After Base + Dev)

**Houses, Beds, Tenants, Tenant Profiles, Emergency Contacts:**
- ✅ `authenticated`: Full CRUD (production baseline)
- ⚠️ `anon`: Full CRUD via DEV_ONLY policies (development only)

**Form Submissions:**
- ✅ `anon`: INSERT only (allows intake form submission)
- ✅ `authenticated`: Full CRUD (manager review/approval)

**Policy Agreements:**
- ✅ `anon`: INSERT only (accompanies intake form)
- ✅ `authenticated`: Full CRUD (manager review)

**System Settings:**
- ✅ `anon`: SELECT only (display voucher rates on forms)
- ✅ `authenticated`: Full CRUD (manager configuration)

### Production Policies (After Cleanup)

After running `supabase-rls-production-access.sql`:
- ❌ `anon`: NO access to houses/beds/tenants (DEV_ONLY policies removed)
- ✅ `authenticated`: Full CRUD access (base policies remain)
- ✅ `anon`: Can still submit intake forms (base policies remain)

---

## 📋 Policy Naming Conventions

All policies follow a consistent naming pattern:

```
{table}_{operation}_{role}

Examples:
- houses_select_authenticated     (production policy)
- DEV_ONLY_houses_insert_anon     (development policy)
- form_submissions_insert_public  (production policy for anon)
```

The `DEV_ONLY_` prefix makes development policies easy to identify and remove.

---

## 🔍 Troubleshooting

### "new row violates row-level security policy"

**Cause**: Trying to INSERT/UPDATE/DELETE with anon key, but DEV_ONLY policies aren't applied yet.

**Solution**: Run `supabase-rls-dev-access.sql` in Supabase SQL Editor.

### "Cannot coerce the result to a single JSON object"

**Cause**: Usually related to UPDATE operations when RLS blocks the query.

**Solution**: Ensure DEV_ONLY policies are applied, or check that your query is properly formatted.

### Changes not appearing in frontend

**Cause**: React Query cache may be stale.

**Solution**: Check that your mutation hooks invalidate the correct query keys:
```javascript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['houses'] });
  queryClient.invalidateQueries({ queryKey: ['beds'] });
}
```

### Need to reset all policies

If policies get into a bad state:

```sql
-- Drop all policies (CAUTION: This removes ALL RLS policies)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Then re-run:
-- 1. supabase-rls-policies.sql (base policies)
-- 2. supabase-rls-dev-access.sql (if in development)
```

---

## 📝 Future Enhancements

### Authentication Requirements

When implementing full authentication:

1. **Manager Authentication**
   - Standard Supabase Auth (email/password or magic link)
   - Add custom claim: `{ "role": "manager" }`
   - Update policies to check `is_manager()` function

2. **Tenant Authentication**
   - Low-level credentials: name + DOB
   - Implemented in frontend, validated against tenants table
   - Grant temporary authenticated session
   - Policies allow tenants to read only their own records

3. **Duplicate Application Detection**
   - Check name + DOB + phone on form submission
   - If match found: notify user, offer to update, alert manager
   - Prevents multiple applications from same person

### Role-Based Policies

See `supabase-rls-production-access.sql` for examples of:
- Creating `is_manager()` helper function
- Restricting CRUD to managers only
- Allowing tenants to read their own records

---

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Policy Documentation](https://www.postgresql.org/docs/current/sql-createpolicy.html)
- [Project Roadmap](../../project-roadmap.md)
- [Field Mapping](./field-mapping.md)

---

## ✅ Pre-Production Checklist

Before deploying to production, verify:

- [ ] All DEV_ONLY policies removed (`supabase-rls-production-access.sql` executed)
- [ ] Authentication implemented and tested
- [ ] anon key cannot access houses/beds/tenants (test with `SET LOCAL ROLE anon`)
- [ ] authenticated users can perform all CRUD operations
- [ ] Intake forms still work for unauthenticated users
- [ ] Role-based access implemented (optional)
- [ ] Service role key is NEVER exposed in frontend
- [ ] All queries use anon key in frontend
- [ ] Error handling for unauthorized access attempts
- [ ] All policies reviewed with security mindset

---

**Last Updated**: October 30, 2025
**Maintainer**: Michael Munro (m.munro3318@gmail.com)
