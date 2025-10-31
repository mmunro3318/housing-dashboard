import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import AddPropertyModal from '../components/properties/AddPropertyModal';
import EditPropertyModal from '../components/properties/EditPropertyModal';
import AddBedModal from '../components/properties/AddBedModal';
import EditBedModal from '../components/properties/EditBedModal';
import DeleteConfirmationModal from '../components/shared/DeleteConfirmationModal';
import { useDeleteProperty } from '../hooks/usePropertyMutations';
import { useDeleteBed } from '../hooks/useBedMutations';

function Properties() {
  const [expandedHouses, setExpandedHouses] = useState(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAddBedModalOpen, setIsAddBedModalOpen] = useState(false);
  const [isEditBedModalOpen, setIsEditBedModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedHouseForBed, setSelectedHouseForBed] = useState(null);

  // Filter state
  const [selectedCounty, setSelectedCounty] = useState('all');

  // Delete modal state
  const [isDeletePropertyModalOpen, setIsDeletePropertyModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleteBedModalOpen, setIsDeleteBedModalOpen] = useState(false);
  const [bedToDelete, setBedToDelete] = useState(null);

  // Delete mutations
  const deletePropertyMutation = useDeleteProperty();
  const deleteBedMutation = useDeleteBed();

  // Fetch all houses
  const { data: houses, isLoading: housesLoading, error: housesError } = useQuery({
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

  // Fetch all beds
  const { data: beds, isLoading: bedsLoading } = useQuery({
    queryKey: ['beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beds')
        .select('*')
        .order('room_number', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Fetch all tenants
  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const isLoading = housesLoading || bedsLoading || tenantsLoading;

  // Toggle house expansion
  const toggleHouse = (houseId) => {
    setExpandedHouses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(houseId)) {
        newSet.delete(houseId);
      } else {
        newSet.add(houseId);
      }
      return newSet;
    });
  };

  // Join data: group beds by house and create tenant lookup
  const bedsByHouse = beds?.reduce((acc, bed) => {
    if (!acc[bed.house_id]) acc[bed.house_id] = [];
    acc[bed.house_id].push(bed);
    return acc;
  }, {}) || {};

  const tenantMap = tenants?.reduce((acc, tenant) => {
    acc[tenant.tenant_id] = tenant;
    return acc;
  }, {}) || {};

  // Enrich houses with bed and occupancy data
  const enrichedHouses = houses?.map(house => {
    const houseBeds = bedsByHouse[house.house_id] || [];
    const occupiedCount = houseBeds.filter(b => b.status === 'Occupied').length;
    const occupancyRate = house.total_beds > 0
      ? Math.round((occupiedCount / house.total_beds) * 100)
      : 0;

    // Calculate financial metrics
    const potentialIncome = houseBeds.reduce((sum, bed) => sum + (bed.base_rent || 0), 0);
    const actualIncome = houseBeds.reduce((sum, bed) => {
      if (bed.status === 'Occupied' && bed.tenant_id) {
        const tenant = tenantMap[bed.tenant_id];
        return sum + (tenant?.actual_rent || bed.base_rent || 0);
      }
      return sum;
    }, 0);
    const incomeEfficiency = potentialIncome > 0
      ? Math.round((actualIncome / potentialIncome) * 100)
      : 0;

    return {
      ...house,
      beds: houseBeds,
      occupancy: {
        total: house.total_beds,
        occupied: occupiedCount,
        rate: occupancyRate,
      },
      finances: {
        potential: potentialIncome,
        actual: actualIncome,
        efficiency: incomeEfficiency,
      },
    };
  }) || [];

  // Extract unique counties for filter dropdown
  const counties = ['all', ...new Set(houses?.map(h => h.county).filter(Boolean) || [])].sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return a.localeCompare(b);
  });

  // Filter houses by selected county
  const filteredHouses = selectedCounty === 'all'
    ? enrichedHouses
    : enrichedHouses.filter(house => house.county === selectedCounty);

  // Bed status configuration
  const getBedStyle = (status) => {
    const styles = {
      Available: {
        bg: 'bg-green-100',
        border: 'border-green-500',
        text: 'text-green-700',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
      },
      Occupied: {
        bg: 'bg-red-100',
        border: 'border-red-500',
        text: 'text-red-700',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
      Pending: {
        bg: 'bg-yellow-100',
        border: 'border-yellow-500',
        text: 'text-yellow-700',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      Hold: {
        bg: 'bg-gray-100',
        border: 'border-gray-500',
        text: 'text-gray-700',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
      },
    };
    return styles[status] || styles.Available;
  };

  // Error state
  if (housesError) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-purple-900">Properties</h2>
          <p className="text-gray-600 mt-1">Manage your houses and beds</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-semibold">Error loading properties</p>
          <p className="text-red-600 text-sm mt-1">{housesError.message}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-purple-900">Properties</h2>
          <p className="text-gray-600 mt-1">Manage your houses and beds</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading properties...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (houses?.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-purple-900">Properties</h2>
          <p className="text-gray-600 mt-1">Manage your houses and beds</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block bg-purple-100 rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
          <p className="text-gray-600">Add your first property to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-3xl font-bold text-purple-900">Properties</h2>
            <p className="text-gray-600 mt-1">Manage your houses and beds</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </button>
        </div>

        {/* County Filter */}
        {counties.length > 1 && (
          <div className="flex items-center gap-3">
            <label htmlFor="county-filter" className="text-sm font-medium text-gray-700">
              Filter by County:
            </label>
            <select
              id="county-filter"
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="all">All Counties ({enrichedHouses.length})</option>
              {counties.filter(c => c !== 'all').map(county => {
                const count = enrichedHouses.filter(h => h.county === county).length;
                return (
                  <option key={county} value={county}>
                    {county} ({count})
                  </option>
                );
              })}
            </select>
            {selectedCounty !== 'all' && (
              <span className="text-sm text-gray-600">
                Showing {filteredHouses.length} of {enrichedHouses.length} properties
              </span>
            )}
          </div>
        )}
      </div>

      {/* No results state for filtered view */}
      {filteredHouses.length === 0 && selectedCounty !== 'all' ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block bg-gray-100 rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties in {selectedCounty}</h3>
          <p className="text-gray-600">Try selecting a different county or clear the filter.</p>
          <button
            onClick={() => setSelectedCounty('all')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Show All Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHouses.map((house) => {
          const isExpanded = expandedHouses.has(house.house_id);

          return (
            <div
              key={house.house_id}
              className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${isExpanded ? 'lg:col-span-2' : ''}`}
            >
              {/* Property Header (clickable) */}
              <div
                className="p-5 cursor-pointer hover:bg-purple-50 transition-colors group relative"
                onClick={() => toggleHouse(house.house_id)}
              >
                {/* Action Buttons (appear on hover) */}
                <div className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(house);
                      setIsEditModalOpen(true);
                    }}
                    className="bg-white border border-purple-300 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 hover:border-purple-500 text-sm font-medium shadow-sm"
                    aria-label="Edit property"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPropertyToDelete(house);
                      setIsDeletePropertyModalOpen(true);
                    }}
                    className="bg-white border border-red-300 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-500 text-sm font-medium shadow-sm"
                    aria-label="Delete property"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-purple-900">
                      {house.address}
                    </h3>
                    {house.county && (
                      <p className="text-sm text-gray-500 mt-1">
                        {house.county}
                      </p>
                    )}
                    <div className="flex flex-col space-y-2 mt-3">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                          <span className="font-semibold">{house.occupancy.occupied}/{house.occupancy.total}</span> beds occupied
                        </span>
                        <span className="text-sm font-semibold text-purple-600">
                          {house.occupancy.rate}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Income:</span>{' '}
                        <span className="font-semibold text-green-700">${house.finances.actual.toFixed(0)}/mo</span>
                        <span className="text-gray-500"> | </span>
                        <span className="text-gray-600">${house.finances.potential.toFixed(0)}/mo potential</span>
                        <span className="ml-2 text-purple-600 font-semibold">({house.finances.efficiency}%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Beds Grid */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-5 bg-gray-50">
                  {house.beds.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No beds found for this property</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {house.beds.map((bed) => {
                        const style = getBedStyle(bed.status);
                        const tenant = bed.tenant_id ? tenantMap[bed.tenant_id] : null;
                        const baseRent = bed.base_rent || 0;
                        const actualRent = tenant?.actual_rent || 0;
                        const hasRentDiscrepancy = tenant && actualRent > 0 && actualRent !== baseRent;

                        return (
                          <div
                            key={bed.bed_id}
                            onClick={() => {
                              setSelectedBed(bed);
                              setSelectedHouseForBed(house);
                              setIsEditBedModalOpen(true);
                            }}
                            className={`${style.bg} ${style.text} border-2 ${style.border} rounded-lg p-3 flex flex-col items-center justify-center text-center min-h-[120px] cursor-pointer hover:opacity-80 transition-opacity relative group/bed`}
                          >
                            {/* Delete Icon (top-right corner, appears on hover) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBedToDelete({ bed, house });
                                setIsDeleteBedModalOpen(true);
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover/bed:opacity-100 transition-opacity bg-white rounded-full p-1 hover:bg-red-50 shadow-sm"
                              aria-label="Delete bed"
                            >
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>

                            <p className="font-semibold text-sm mb-1">
                              {bed.room_number}
                            </p>
                            <div className="my-1">
                              {style.icon}
                            </div>
                            <p className="text-xs font-medium">
                              {bed.status}
                            </p>
                            {tenant && (
                              <p className="text-xs mt-1 truncate w-full" title={tenant.full_name}>
                                {tenant.full_name}
                              </p>
                            )}
                            {/* Rent badges */}
                            <div className="mt-2 flex flex-wrap gap-1 justify-center">
                              {hasRentDiscrepancy ? (
                                <>
                                  <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                    ${actualRent.toFixed(0)} actual
                                  </span>
                                  <span className="bg-gray-400 text-white px-2 py-0.5 rounded text-xs font-medium">
                                    ${baseRent.toFixed(0)} base
                                  </span>
                                </>
                              ) : baseRent > 0 ? (
                                <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                  ${baseRent.toFixed(0)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Bed Button */}
                  <div className="mt-4 pt-3 border-t border-gray-300">
                    <button
                      onClick={() => {
                        setSelectedHouseForBed(house);
                        setIsAddBedModalOpen(true);
                      }}
                      className="w-full px-4 py-2 bg-white border-2 border-purple-300 border-dashed text-purple-700 rounded-lg hover:bg-purple-50 hover:border-purple-500 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Bed to Property
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Modals */}
      <AddPropertyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditPropertyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
      />
      <AddBedModal
        isOpen={isAddBedModalOpen}
        onClose={() => {
          setIsAddBedModalOpen(false);
          setSelectedHouseForBed(null);
        }}
        houseId={selectedHouseForBed?.house_id}
        houseAddress={selectedHouseForBed?.address}
        existingBeds={selectedHouseForBed?.beds || []}
      />
      <EditBedModal
        isOpen={isEditBedModalOpen}
        onClose={() => {
          setIsEditBedModalOpen(false);
          setSelectedBed(null);
          setSelectedHouseForBed(null);
        }}
        bed={selectedBed}
        houseAddress={selectedHouseForBed?.address}
        existingBeds={selectedHouseForBed?.beds || []}
        tenantMap={tenantMap}
      />

      {/* Delete Property Confirmation */}
      <DeleteConfirmationModal
        isOpen={isDeletePropertyModalOpen}
        onClose={() => {
          setIsDeletePropertyModalOpen(false);
          setPropertyToDelete(null);
        }}
        onConfirm={async () => {
          await deletePropertyMutation.mutateAsync(propertyToDelete.house_id);
          setIsDeletePropertyModalOpen(false);
          setPropertyToDelete(null);
        }}
        title="Delete Property?"
        itemName={propertyToDelete?.address}
        warningMessage="This action cannot be undone. All beds will be permanently deleted."
        dangerDetails={[
          `${propertyToDelete?.beds?.length || 0} bed(s) will be deleted`,
          `${propertyToDelete?.beds?.filter(b => b.tenant_id).length || 0} tenant(s) will become unassigned`,
          'Any tenants in these beds will need to be reassigned manually',
        ]}
        isLoading={deletePropertyMutation.isPending}
      />

      {/* Delete Bed Confirmation */}
      <DeleteConfirmationModal
        isOpen={isDeleteBedModalOpen}
        onClose={() => {
          setIsDeleteBedModalOpen(false);
          setBedToDelete(null);
        }}
        onConfirm={async () => {
          await deleteBedMutation.mutateAsync({
            bedId: bedToDelete.bed.bed_id,
            houseId: bedToDelete.house.house_id,
          });
          setIsDeleteBedModalOpen(false);
          setBedToDelete(null);
        }}
        title="Delete Bed?"
        itemName={`${bedToDelete?.house?.address} - ${bedToDelete?.bed?.room_number}`}
        warningMessage={
          bedToDelete?.bed?.tenant_id
            ? 'This bed is currently occupied. The tenant will become unassigned and need a new bed.'
            : 'This action cannot be undone.'
        }
        dangerDetails={
          bedToDelete?.bed?.tenant_id
            ? [
                `Status: ${bedToDelete?.bed?.status}`,
                `Tenant: ${tenantMap[bedToDelete?.bed?.tenant_id]?.full_name || 'Unknown'}`,
                'Tenant will be unassigned after deletion',
              ]
            : [`Status: ${bedToDelete?.bed?.status}`]
        }
        isLoading={deleteBedMutation.isPending}
      />
    </div>
  );
}

export default Properties;
