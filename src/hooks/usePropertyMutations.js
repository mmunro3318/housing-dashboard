import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import { normalizeCounty } from '../utils/formatters';

/**
 * Custom Hook: Property Mutations
 *
 * Provides React Query mutations for Property (houses) CRUD operations.
 * Automatically handles cache invalidation and error management.
 */

/**
 * Add New Property
 *
 * Creates a new house record and auto-generates N beds with sequential room numbers.
 * Uses a transaction-like approach: if beds fail to insert, the house is deleted (rollback).
 *
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useAddProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyData) => {
      const { address, county, total_beds, default_base_rent, notes } = propertyData;

      // Step 1: Insert house record
      const { data: newHouse, error: houseError } = await supabase
        .from('houses')
        .insert({
          address: address.trim(),
          county: normalizeCounty(county) || 'King',
          total_beds: parseInt(total_beds),
          notes: notes?.trim() || null,
        })
        .select()
        .single();

      if (houseError) {
        throw new Error(houseError.message || 'Failed to create property');
      }

      // Step 2: Bulk create beds with sequential room numbers (1, 2, 3...)
      const bedsToInsert = Array.from({ length: parseInt(total_beds) }, (_, i) => ({
        house_id: newHouse.house_id,
        room_number: String(i + 1),
        base_rent: parseFloat(default_base_rent) || 0,
        status: 'Available',
        tenant_id: null,
        notes: null,
      }));

      const { error: bedsError } = await supabase
        .from('beds')
        .insert(bedsToInsert);

      if (bedsError) {
        // Rollback: Delete the house if beds fail to insert
        await supabase
          .from('houses')
          .delete()
          .eq('house_id', newHouse.house_id);

        throw new Error(bedsError.message || 'Failed to create beds');
      }

      return newHouse;
    },
    onSuccess: () => {
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
    onError: (error) => {
      console.error('Error adding property:', error);
    },
  });
};

/**
 * Update Existing Property
 *
 * Updates house record details (address, county, total_beds, notes).
 * Note: This does NOT add/remove actual bed records - only updates the total_beds count.
 *
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ houseId, updates }) => {
      // Normalize county if provided
      if (updates.county) {
        updates.county = normalizeCounty(updates.county) || 'King';
      }

      // Trim string fields
      if (updates.address) {
        updates.address = updates.address.trim();
      }
      if (updates.notes !== undefined) {
        updates.notes = updates.notes?.trim() || null;
      }

      const { data, error } = await supabase
        .from('houses')
        .update(updates)
        .eq('house_id', houseId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update property');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
    },
    onError: (error) => {
      console.error('Error updating property:', error);
    },
  });
};

/**
 * Delete Property (Cascade)
 *
 * Deletes a house record and all associated beds (via database CASCADE).
 * Before deletion, unassigns any tenants currently assigned to beds in this property.
 *
 * Steps:
 * 1. Find all beds for this property
 * 2. Find all tenants assigned to those beds
 * 3. Set tenant.bed_id = NULL for affected tenants (unassign)
 * 4. Delete the property (beds cascade delete automatically)
 *
 * WARNING: This is a destructive operation.
 *
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (houseId) => {
      // Step 1: Find all beds for this property
      const { data: beds, error: bedsError } = await supabase
        .from('beds')
        .select('bed_id')
        .eq('house_id', houseId);

      if (bedsError) {
        throw new Error(bedsError.message || 'Failed to fetch beds for property');
      }

      const bedIds = beds.map((bed) => bed.bed_id);

      // Step 2: Unassign any tenants currently in these beds
      if (bedIds.length > 0) {
        const { error: unassignError } = await supabase
          .from('tenants')
          .update({ bed_id: null })
          .in('bed_id', bedIds);

        if (unassignError) {
          throw new Error(unassignError.message || 'Failed to unassign tenants');
        }
      }

      // Step 3: Delete the property (beds will cascade delete)
      const { error: deleteError } = await supabase
        .from('houses')
        .delete()
        .eq('house_id', houseId);

      if (deleteError) {
        throw new Error(deleteError.message || 'Failed to delete property');
      }

      return {
        houseId,
        bedsDeleted: bedIds.length,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (error) => {
      console.error('Error deleting property:', error);
    },
  });
};
