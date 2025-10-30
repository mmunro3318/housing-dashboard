import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';

/**
 * Custom Hook: Tenant Mutations
 *
 * Provides React Query mutations for Tenant CRUD operations.
 * Automatically handles cache invalidation and error management.
 *
 * Note: UI components for manual tenant CRUD are deferred to Forms phase.
 * These hooks serve as the foundation for form-based tenant creation workflows.
 */

/**
 * Add New Tenant
 *
 * Creates a new tenant record without bed assignment (bed_id = NULL).
 * Tenants are created in "unassigned" state and can be assigned to beds later.
 *
 * Common use cases:
 * - Manager approves application → Creates tenant record
 * - Manager manually adds tenant (future feature)
 * - Batch import from external system
 *
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useAddTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenantData) => {
      const {
        full_name,
        dob,
        phone = null,
        email = null,
        address = null,
        profile_picture_url = null,
        application_status = 'Pending',
        entry_date = null,
        exit_date = null,
        doc_number = null,
        tenant_type = null,
        voucher_type = null,
        payment_type = null,
        voucher_start = null,
        voucher_end = null,
        rent_paid = false,
        notes = null,
        access_code = null,
      } = tenantData;

      // Validation: Required fields
      if (!full_name || !dob) {
        throw new Error('Full name and date of birth are required');
      }

      const { data, error } = await supabase
        .from('tenants')
        .insert({
          full_name: full_name.trim(),
          dob,
          phone: phone?.trim() || null,
          email: email?.trim() || null,
          address: address?.trim() || null,
          profile_picture_url,
          application_status,
          bed_id: null, // Always create unassigned initially
          entry_date,
          exit_date,
          doc_number: doc_number?.trim() || null,
          tenant_type: tenant_type?.trim() || null,
          voucher_type,
          payment_type: payment_type?.trim() || null,
          voucher_start,
          voucher_end,
          rent_paid,
          notes: notes?.trim() || null,
          access_code: access_code?.trim() || null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to create tenant');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (error) => {
      console.error('Error adding tenant:', error);
    },
  });
};

/**
 * Update Existing Tenant
 *
 * Updates tenant record details. Accepts partial updates (only provided fields are updated).
 *
 * Common use cases:
 * - Manager updates tenant information
 * - Tenant submits information update request (pending Manager approval)
 * - System updates (e.g., voucher expiration, bed assignment)
 *
 * @param {Object} params
 * @param {string} params.tenantId - UUID of tenant to update
 * @param {Object} params.updates - Partial tenant data to update
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenantId, updates }) => {
      // Trim string fields if provided
      const cleanedUpdates = { ...updates };

      if (cleanedUpdates.full_name) {
        cleanedUpdates.full_name = cleanedUpdates.full_name.trim();
      }
      if (cleanedUpdates.phone !== undefined) {
        cleanedUpdates.phone = cleanedUpdates.phone?.trim() || null;
      }
      if (cleanedUpdates.email !== undefined) {
        cleanedUpdates.email = cleanedUpdates.email?.trim() || null;
      }
      if (cleanedUpdates.address !== undefined) {
        cleanedUpdates.address = cleanedUpdates.address?.trim() || null;
      }
      if (cleanedUpdates.doc_number !== undefined) {
        cleanedUpdates.doc_number = cleanedUpdates.doc_number?.trim() || null;
      }
      if (cleanedUpdates.tenant_type !== undefined) {
        cleanedUpdates.tenant_type = cleanedUpdates.tenant_type?.trim() || null;
      }
      if (cleanedUpdates.payment_type !== undefined) {
        cleanedUpdates.payment_type = cleanedUpdates.payment_type?.trim() || null;
      }
      if (cleanedUpdates.notes !== undefined) {
        cleanedUpdates.notes = cleanedUpdates.notes?.trim() || null;
      }
      if (cleanedUpdates.access_code !== undefined) {
        cleanedUpdates.access_code = cleanedUpdates.access_code?.trim() || null;
      }

      const { data, error } = await supabase
        .from('tenants')
        .update(cleanedUpdates)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update tenant');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] }); // If bed assignment changed
    },
    onError: (error) => {
      console.error('Error updating tenant:', error);
    },
  });
};

/**
 * Delete Tenant
 *
 * Deletes a tenant record from the system. Before deletion, unassigns tenant from bed
 * (sets bed.tenant_id = NULL and bed.status = 'Available').
 *
 * WARNING: This is a destructive operation and should require confirmation.
 * Consider soft-deleting (setting application_status = 'Exited') instead for historical records.
 *
 * Steps:
 * 1. If tenant is assigned to a bed, unassign them (set bed.tenant_id = NULL, status = 'Available')
 * 2. Delete the tenant record
 *
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenantId) => {
      // Step 1: Check if tenant is assigned to a bed
      const { data: tenant, error: fetchError } = await supabase
        .from('tenants')
        .select('bed_id')
        .eq('tenant_id', tenantId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message || 'Failed to fetch tenant');
      }

      // Step 2: If assigned to a bed, unassign them
      if (tenant.bed_id) {
        const { error: unassignError } = await supabase
          .from('beds')
          .update({
            tenant_id: null,
            status: 'Available',
          })
          .eq('bed_id', tenant.bed_id);

        if (unassignError) {
          throw new Error(unassignError.message || 'Failed to unassign tenant from bed');
        }
      }

      // Step 3: Delete the tenant record
      const { error: deleteError } = await supabase
        .from('tenants')
        .delete()
        .eq('tenant_id', tenantId);

      if (deleteError) {
        throw new Error(deleteError.message || 'Failed to delete tenant');
      }

      return {
        tenantId,
        bedUnassigned: !!tenant.bed_id,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
    onError: (error) => {
      console.error('Error deleting tenant:', error);
    },
  });
};

/**
 * Assign Tenant to Bed
 *
 * Assigns an unassigned tenant to a specific bed. Updates both tenant.bed_id and bed.tenant_id.
 * Prevents double-booking by checking if bed is already occupied.
 *
 * Steps:
 * 1. Validate bed is available (status = 'Available' and tenant_id = NULL)
 * 2. Update tenant.bed_id = bedId
 * 3. Update bed.tenant_id = tenantId, bed.status = 'Occupied'
 * 4. If entry_date not set, set to today
 * 5. Update application_status to 'Active' if not already
 *
 * @param {Object} params
 * @param {string} params.tenantId - UUID of tenant to assign
 * @param {string} params.bedId - UUID of bed to assign to
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useAssignTenantToBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenantId, bedId }) => {
      // Step 1: Validate bed is available
      const { data: bed, error: bedError } = await supabase
        .from('beds')
        .select('status, tenant_id')
        .eq('bed_id', bedId)
        .single();

      if (bedError) {
        throw new Error(bedError.message || 'Failed to fetch bed');
      }

      if (bed.status !== 'Available' || bed.tenant_id !== null) {
        throw new Error('Bed is already occupied or not available');
      }

      // Step 2: Update tenant record
      const { error: tenantError } = await supabase
        .from('tenants')
        .update({
          bed_id: bedId,
          application_status: 'Active',
          entry_date: new Date().toISOString().split('T')[0], // Set entry date to today if not set
        })
        .eq('tenant_id', tenantId)
        .is('entry_date', null); // Only set entry_date if it's null

      if (tenantError) {
        throw new Error(tenantError.message || 'Failed to update tenant');
      }

      // Also update application_status for tenants with entry_date already set
      const { error: statusError } = await supabase
        .from('tenants')
        .update({
          bed_id: bedId,
          application_status: 'Active',
        })
        .eq('tenant_id', tenantId)
        .not('entry_date', 'is', null);

      if (statusError) {
        throw new Error(statusError.message || 'Failed to update tenant status');
      }

      // Step 3: Update bed record
      const { error: bedUpdateError } = await supabase
        .from('beds')
        .update({
          tenant_id: tenantId,
          status: 'Occupied',
        })
        .eq('bed_id', bedId);

      if (bedUpdateError) {
        // Rollback tenant update
        await supabase.from('tenants').update({ bed_id: null }).eq('tenant_id', tenantId);
        throw new Error(bedUpdateError.message || 'Failed to update bed');
      }

      return { tenantId, bedId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
    onError: (error) => {
      console.error('Error assigning tenant to bed:', error);
    },
  });
};

/**
 * Unassign Tenant from Bed
 *
 * Removes tenant from their current bed assignment. Creates "unassigned" tenant.
 *
 * Steps:
 * 1. Get tenant's current bed_id
 * 2. Update tenant.bed_id = NULL
 * 3. Update bed.tenant_id = NULL, bed.status = 'Available'
 *
 * @param {string} tenantId - UUID of tenant to unassign
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useUnassignTenantFromBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenantId) => {
      // Step 1: Get tenant's current bed
      const { data: tenant, error: fetchError } = await supabase
        .from('tenants')
        .select('bed_id')
        .eq('tenant_id', tenantId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message || 'Failed to fetch tenant');
      }

      if (!tenant.bed_id) {
        throw new Error('Tenant is not assigned to any bed');
      }

      const bedId = tenant.bed_id;

      // Step 2: Unassign tenant
      const { error: tenantError } = await supabase
        .from('tenants')
        .update({ bed_id: null })
        .eq('tenant_id', tenantId);

      if (tenantError) {
        throw new Error(tenantError.message || 'Failed to unassign tenant');
      }

      // Step 3: Mark bed as available
      const { error: bedError } = await supabase
        .from('beds')
        .update({
          tenant_id: null,
          status: 'Available',
        })
        .eq('bed_id', bedId);

      if (bedError) {
        // Rollback tenant update
        await supabase.from('tenants').update({ bed_id: bedId }).eq('tenant_id', tenantId);
        throw new Error(bedError.message || 'Failed to update bed');
      }

      return { tenantId, bedId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
    onError: (error) => {
      console.error('Error unassigning tenant from bed:', error);
    },
  });
};
