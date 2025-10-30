import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';

/**
 * Custom Hook: Bed Mutations
 *
 * Provides React Query mutations for Bed CRUD operations.
 * Automatically handles cache invalidation and house.total_beds synchronization.
 */

/**
 * Add New Bed
 *
 * Creates a new bed record and auto-increments the house.total_beds field.
 * This ensures the house total_beds count stays accurate.
 *
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useAddBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bedData) => {
      const { house_id, room_number, base_rent, status, notes } = bedData;

      // Step 1: Insert bed record
      const { data: newBed, error: bedError } = await supabase
        .from('beds')
        .insert({
          house_id,
          room_number: room_number.trim(),
          base_rent: parseFloat(base_rent) || 0,
          status: status || 'Available',
          tenant_id: null,
          notes: notes?.trim() || null,
        })
        .select()
        .single();

      if (bedError) {
        throw new Error(bedError.message || 'Failed to add bed');
      }

      // Step 2: Auto-increment house.total_beds
      // First, get current total_beds value
      const { data: house, error: fetchError } = await supabase
        .from('houses')
        .select('total_beds')
        .eq('house_id', house_id)
        .single();

      if (fetchError) {
        console.error('Warning: Failed to fetch house for total_beds update:', fetchError);
      } else {
        // Increment total_beds
        const { error: updateError } = await supabase
          .from('houses')
          .update({ total_beds: house.total_beds + 1 })
          .eq('house_id', house_id);

        if (updateError) {
          console.error('Warning: Failed to update house total_beds:', updateError);
        }
      }

      return newBed;
    },
    onSuccess: () => {
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['houses'] });
    },
    onError: (error) => {
      console.error('Error adding bed:', error);
    },
  });
};

/**
 * Update Existing Bed
 *
 * Updates bed record details (room_number, base_rent, status, notes).
 * Does NOT change house_id (moving beds between properties requires different logic).
 *
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useUpdateBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bedId, updates }) => {
      // Trim string fields
      if (updates.room_number) {
        updates.room_number = updates.room_number.trim();
      }
      if (updates.notes !== undefined) {
        updates.notes = updates.notes?.trim() || null;
      }

      // Parse numeric fields
      if (updates.base_rent !== undefined) {
        updates.base_rent = parseFloat(updates.base_rent) || 0;
      }

      const { data, error } = await supabase
        .from('beds')
        .update(updates)
        .eq('bed_id', bedId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update bed');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
    onError: (error) => {
      console.error('Error updating bed:', error);
    },
  });
};

/**
 * Delete Bed
 *
 * Deletes a bed record and auto-decrements the house.total_beds field.
 * WARNING: This is a destructive operation.
 * Should check if bed is occupied before allowing deletion.
 *
 * @returns {Object} - useMutation result with mutate, mutateAsync, isPending, isError, error
 */
export const useDeleteBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bedId, houseId }) => {
      // Step 1: Delete bed record
      const { error: deleteError } = await supabase
        .from('beds')
        .delete()
        .eq('bed_id', bedId);

      if (deleteError) {
        throw new Error(deleteError.message || 'Failed to delete bed');
      }

      // Step 2: Auto-decrement house.total_beds
      const { data: house, error: fetchError } = await supabase
        .from('houses')
        .select('total_beds')
        .eq('house_id', houseId)
        .single();

      if (fetchError) {
        console.error('Warning: Failed to fetch house for total_beds update:', fetchError);
      } else {
        // Decrement total_beds (minimum 0)
        const newTotal = Math.max(0, house.total_beds - 1);
        const { error: updateError } = await supabase
          .from('houses')
          .update({ total_beds: newTotal })
          .eq('house_id', houseId);

        if (updateError) {
          console.error('Warning: Failed to update house total_beds:', updateError);
        }
      }

      return { bedId, houseId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['houses'] });
    },
    onError: (error) => {
      console.error('Error deleting bed:', error);
    },
  });
};
