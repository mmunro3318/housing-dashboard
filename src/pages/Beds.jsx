import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import DeleteConfirmationModal from '../components/shared/DeleteConfirmationModal';
import { useDeleteBed } from '../hooks/useBedMutations';

export default function Beds() {
  // Get URL search params
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(statusParam || 'All');
  const [sortBy, setSortBy] = useState('property');

  // Delete modal state
  const [isDeleteBedModalOpen, setIsDeleteBedModalOpen] = useState(false);
  const [bedToDelete, setBedToDelete] = useState(null);

  // Delete mutation
  const deleteBedMutation = useDeleteBed();

  // Fetch beds data
  const { data: beds, isLoading: bedsLoading, error: bedsError } = useQuery({
    queryKey: ['beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beds')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch tenants data
  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenants').select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch houses data
  const { data: houses, isLoading: housesLoading } = useQuery({
    queryKey: ['houses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('address', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Combined loading state
  const isLoading = bedsLoading || tenantsLoading || housesLoading;

  // Create lookup maps for O(1) joins
  const houseMap = useMemo(() => {
    return houses?.reduce((acc, house) => {
      acc[house.house_id] = house;
      return acc;
    }, {}) || {};
  }, [houses]);

  const tenantMap = useMemo(() => {
    return tenants?.reduce((acc, tenant) => {
      acc[tenant.tenant_id] = tenant;
      return acc;
    }, {}) || {};
  }, [tenants]);

  // Enrich beds with related data
  const enrichedBeds = useMemo(() => {
    return beds?.map(bed => {
      const house = bed.house_id ? houseMap[bed.house_id] : null;
      const tenant = bed.tenant_id ? tenantMap[bed.tenant_id] : null;
      return {
        ...bed,
        house: house,
        tenant: tenant,
        propertyAddress: house?.address || 'Unknown Property',
        occupantName: tenant?.full_name || null,
        baseRent: bed.base_rent || 0,
        actualRent: tenant?.actual_rent || 0,
      };
    }) || [];
  }, [beds, houseMap, tenantMap]);

  // Stage 1: Search filter
  const searchedBeds = useMemo(() => {
    if (!searchQuery) return enrichedBeds;
    const query = searchQuery.toLowerCase();
    return enrichedBeds.filter(bed =>
      bed.propertyAddress?.toLowerCase().includes(query) ||
      bed.room_number?.toLowerCase().includes(query) ||
      bed.occupantName?.toLowerCase().includes(query)
    );
  }, [enrichedBeds, searchQuery]);

  // Stage 2: Status filter
  const filteredBeds = useMemo(() => {
    if (statusFilter === 'All') return searchedBeds;
    return searchedBeds.filter(bed => bed.status === statusFilter);
  }, [searchedBeds, statusFilter]);

  // Stage 3: Sort
  const sortedBeds = useMemo(() => {
    const sorted = [...filteredBeds];
    switch (sortBy) {
      case 'property':
        sorted.sort((a, b) => a.propertyAddress.localeCompare(b.propertyAddress));
        break;
      case 'rent':
        sorted.sort((a, b) => (b.baseRent || 0) - (a.baseRent || 0));
        break;
      case 'room':
        sorted.sort((a, b) => {
          const roomA = a.room_number || '';
          const roomB = b.room_number || '';
          return roomA.localeCompare(roomB, undefined, { numeric: true });
        });
        break;
      case 'status':
        const statusOrder = { 'Available': 1, 'Pending': 2, 'Hold': 3, 'Occupied': 4 };
        sorted.sort((a, b) => (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5));
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredBeds, sortBy]);

  // Reset all filters
  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setSortBy('property');
  };

  // Get bed status styling
  const getBedStyle = (status) => {
    const styles = {
      Available: {
        bg: 'bg-green-100',
        border: 'border-green-500',
        text: 'text-green-700',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
      Occupied: {
        bg: 'bg-red-100',
        border: 'border-red-500',
        text: 'text-red-700',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
      Pending: {
        bg: 'bg-yellow-100',
        border: 'border-yellow-500',
        text: 'text-yellow-700',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      Hold: {
        bg: 'bg-gray-100',
        border: 'border-gray-500',
        text: 'text-gray-700',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
      },
    };
    return styles[status] || styles.Available;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading beds...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (bedsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-red-800 font-semibold">Error loading beds</h3>
            <p className="text-red-600 text-sm">{bedsError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!beds || beds.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No beds found</h3>
          <p className="text-gray-600">There are no beds in the system yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Beds</h1>
        <p className="text-gray-600">
          View and manage all beds across all properties. Filter by status, search by property or room, and sort by various criteria.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by property address, room number, or occupant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Pending">Pending</option>
              <option value="Hold">Hold</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="property">Property</option>
              <option value="rent">Rent (High-Low)</option>
              <option value="room">Room Number</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Reset
            </button>
          </div>

          {/* Results Count */}
          <div className="flex-grow text-right">
            <p className="text-sm text-gray-600 mt-6">
              Showing <span className="font-semibold">{sortedBeds.length}</span> of{' '}
              <span className="font-semibold">{enrichedBeds.length}</span> beds
            </p>
          </div>
        </div>
      </div>

      {/* Beds Grid */}
      {sortedBeds.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching beds</h3>
            <p className="text-gray-600">Try adjusting your filters or search query.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedBeds.map((bed) => {
            const style = getBedStyle(bed.status);
            const hasRentDiscrepancy = bed.status === 'Occupied' && bed.actualRent && bed.baseRent !== bed.actualRent;

            return (
              <div
                key={bed.bed_id}
                className={`${style.bg} border-2 ${style.border} rounded-lg p-4 transition-all hover:shadow-md relative group`}
              >
                {/* Delete Button (top-right corner, appears on hover) */}
                <button
                  onClick={() => {
                    setBedToDelete(bed);
                    setIsDeleteBedModalOpen(true);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1.5 hover:bg-red-50 shadow-sm"
                  aria-label="Delete bed"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Property Address */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Property</p>
                  <p className="text-sm font-semibold text-gray-900">{bed.propertyAddress}</p>
                  {bed.house?.county && (
                    <p className="text-xs text-gray-600">{bed.house.county}</p>
                  )}
                </div>

                {/* Room Number */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Room</p>
                  <p className="text-lg font-bold text-gray-900">{bed.room_number || 'N/A'}</p>
                </div>

                {/* Status Badge */}
                <div className="mb-3">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${style.bg} border ${style.border}`}>
                    <span className={style.text}>{style.icon}</span>
                    <span className={`text-sm font-semibold ${style.text}`}>{bed.status}</span>
                  </div>
                </div>

                {/* Occupant */}
                {bed.status === 'Occupied' && bed.occupantName && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Occupant</p>
                    <p className="text-sm font-semibold text-gray-900">{bed.occupantName}</p>
                  </div>
                )}

                {/* Rent */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Rent</p>
                  <div className="flex flex-wrap gap-2">
                    {hasRentDiscrepancy ? (
                      <>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          ${bed.actualRent.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          ${bed.baseRent.toLocaleString()} base
                        </span>
                      </>
                    ) : bed.baseRent > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        ${bed.baseRent.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">N/A</span>
                    )}
                  </div>
                </div>

                {/* Notes (if any) */}
                {bed.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">{bed.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Bed Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteBedModalOpen}
        onClose={() => {
          setIsDeleteBedModalOpen(false);
          setBedToDelete(null);
        }}
        onConfirm={async () => {
          await deleteBedMutation.mutateAsync({
            bedId: bedToDelete.bed_id,
            houseId: bedToDelete.house_id,
          });
          setIsDeleteBedModalOpen(false);
          setBedToDelete(null);
        }}
        title="Delete Bed?"
        itemName={`${bedToDelete?.propertyAddress} - ${bedToDelete?.room_number}`}
        warningMessage={
          bedToDelete?.tenant_id
            ? 'This bed is currently occupied. The tenant will become unassigned and need a new bed.'
            : 'This action cannot be undone.'
        }
        dangerDetails={
          bedToDelete?.tenant_id
            ? [
                `Status: ${bedToDelete?.status}`,
                `Tenant: ${bedToDelete?.occupantName || 'Unknown'}`,
                'Tenant will be unassigned after deletion',
              ]
            : [`Status: ${bedToDelete?.status}`]
        }
        isLoading={deleteBedMutation.isPending}
      />
    </div>
  );
}
