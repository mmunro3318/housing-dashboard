import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';

function Tenants() {
  // State for search, filters, sorting, and card expansion
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    paymentType: 'All',
    paymentStatus: 'All',
    applicationStatus: 'All',
    bedStatus: 'All',
    tenantType: 'All',
  });
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'rent'
  const [expandedTenants, setExpandedTenants] = useState(new Set());

  // Fetch all tenants
  const { data: tenants, isLoading: tenantsLoading, error: tenantsError } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('full_name', { ascending: true });
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
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch all houses
  const { data: houses, isLoading: housesLoading } = useQuery({
    queryKey: ['houses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch tenant profiles (for DOC numbers)
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['tenant_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_profiles')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const isLoading = tenantsLoading || bedsLoading || housesLoading || profilesLoading;

  // Create lookup maps
  const bedMap = useMemo(() => {
    return beds?.reduce((acc, bed) => {
      acc[bed.bed_id] = bed;
      return acc;
    }, {}) || {};
  }, [beds]);

  const houseMap = useMemo(() => {
    return houses?.reduce((acc, house) => {
      acc[house.house_id] = house;
      return acc;
    }, {}) || {};
  }, [houses]);

  const profileMap = useMemo(() => {
    return profiles?.reduce((acc, profile) => {
      acc[profile.tenant_id] = profile;
      return acc;
    }, {}) || {};
  }, [profiles]);

  // Enrich tenants with bed/house/profile data
  const enrichedTenants = useMemo(() => {
    return tenants?.map(tenant => {
      const bed = tenant.bed_id ? bedMap[tenant.bed_id] : null;
      const house = bed?.house_id ? houseMap[bed.house_id] : null;
      const profile = profileMap[tenant.tenant_id];

      return {
        ...tenant,
        bed: bed,
        house: house,
        doc_number: profile?.doc_number || null,
        location: house && bed
          ? `${house.address} - Room ${bed.room_number}`
          : 'Unassigned',
      };
    }) || [];
  }, [tenants, bedMap, houseMap, profileMap]);

  // Calculate payment status
  const calculatePaymentStatus = (tenant) => {
    const due = tenant.rent_due || 0;
    const paid = tenant.rent_paid || 0;

    if (due === 0) return 'No Payment';
    if (paid >= due) return 'Paid';
    if (paid > 0 && paid < due) return 'Partial';
    if (paid === 0) return 'Overdue';
    return 'Unknown';
  };

  // Filter and search logic
  const filteredTenants = useMemo(() => {
    let results = enrichedTenants;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(tenant => {
        return (
          tenant.full_name?.toLowerCase().includes(query) ||
          tenant.doc_number?.toLowerCase().includes(query) ||
          tenant.phone?.includes(query) ||
          tenant.house?.address?.toLowerCase().includes(query)
        );
      });
    }

    // Apply filters
    if (filters.paymentType !== 'All') {
      results = results.filter(t => t.payment_type === filters.paymentType);
    }

    if (filters.paymentStatus !== 'All') {
      results = results.filter(t => calculatePaymentStatus(t) === filters.paymentStatus);
    }

    if (filters.applicationStatus !== 'All') {
      results = results.filter(t => t.application_status === filters.applicationStatus);
    }

    if (filters.bedStatus !== 'All') {
      const hasAssignment = filters.bedStatus === 'Assigned';
      results = results.filter(t => (t.bed_id !== null) === hasAssignment);
    }

    if (filters.tenantType !== 'All') {
      results = results.filter(t => {
        return t.tenant_types && t.tenant_types.includes(filters.tenantType);
      });
    }

    return results;
  }, [enrichedTenants, searchQuery, filters]);

  // Sorting logic
  const sortedTenants = useMemo(() => {
    const sorted = [...filteredTenants];
    if (sortBy === 'rent') {
      sorted.sort((a, b) => (b.rent_due || 0) - (a.rent_due || 0));
    } else {
      sorted.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    }
    return sorted;
  }, [filteredTenants, sortBy]);

  // Toggle tenant card expansion
  const toggleTenant = (tenantId) => {
    setExpandedTenants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tenantId)) {
        newSet.delete(tenantId);
      } else {
        newSet.add(tenantId);
      }
      return newSet;
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      paymentType: 'All',
      paymentStatus: 'All',
      applicationStatus: 'All',
      bedStatus: 'All',
      tenantType: 'All',
    });
    setSortBy('name');
  };

  // Style helpers
  const getPaymentStatusStyle = (status) => {
    const styles = {
      Paid: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
      Partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500' },
      Overdue: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' },
      'No Payment': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-500' },
    };
    return styles[status] || styles['No Payment'];
  };

  const getApplicationStatusStyle = (status) => {
    const styles = {
      Approved: { bg: 'bg-green-100', text: 'text-green-700' },
      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      Rejected: { bg: 'bg-red-100', text: 'text-red-700' },
      Waitlist: { bg: 'bg-blue-100', text: 'text-blue-700' },
    };
    return styles[status] || styles.Pending;
  };

  // Error state
  if (tenantsError) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-purple-900">Tenants</h2>
          <p className="text-gray-600 mt-1">Manage your residents</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-semibold">Error loading tenants</p>
          <p className="text-red-600 text-sm mt-1">{tenantsError.message}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-purple-900">Tenants</h2>
          <p className="text-gray-600 mt-1">Manage your residents</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading tenants...</span>
        </div>
      </div>
    );
  }

  // Empty state (no tenants at all)
  if (enrichedTenants.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-purple-900">Tenants</h2>
          <p className="text-gray-600 mt-1">Manage your residents</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block bg-pink-100 rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Tenants Found</h3>
          <p className="text-gray-600">Add your first resident to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-purple-900">Tenants</h2>
        <p className="text-gray-600 mt-1">Manage your residents</p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, DOC number, phone, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filters and Sorting Row */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        {/* Payment Type Filter */}
        <select
          value={filters.paymentType}
          onChange={(e) => setFilters({ ...filters, paymentType: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          <option value="All">All Payment Types</option>
          <option value="Voucher">Voucher</option>
          <option value="Private Pay">Private Pay</option>
          <option value="TeleCare">TeleCare</option>
          <option value="Section 8">Section 8</option>
        </select>

        {/* Payment Status Filter */}
        <select
          value={filters.paymentStatus}
          onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          <option value="All">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Overdue">Overdue</option>
          <option value="No Payment">No Payment</option>
        </select>

        {/* Application Status Filter */}
        <select
          value={filters.applicationStatus}
          onChange={(e) => setFilters({ ...filters, applicationStatus: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          <option value="All">All App Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Waitlist">Waitlist</option>
        </select>

        {/* Bed Status Filter */}
        <select
          value={filters.bedStatus}
          onChange={(e) => setFilters({ ...filters, bedStatus: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          <option value="All">All Bed Status</option>
          <option value="Assigned">Assigned</option>
          <option value="Unassigned">Unassigned</option>
        </select>

        {/* Tenant Type Filter */}
        <select
          value={filters.tenantType}
          onChange={(e) => setFilters({ ...filters, tenantType: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          <option value="All">All Tenant Types</option>
          <option value="DOC">DOC</option>
          <option value="TeleCare">TeleCare</option>
          <option value="Voucher Recipient">Voucher Recipient</option>
          <option value="Private Resident">Private Resident</option>
          <option value="In Recovery">In Recovery</option>
          <option value="Probation">Probation</option>
          <option value="Parole">Parole</option>
          <option value="Mental Health">Mental Health</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        >
          <option value="name">Sort: Name (A-Z)</option>
          <option value="rent">Sort: Rent Due (High-Low)</option>
        </select>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
        >
          Reset
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {sortedTenants.length} of {enrichedTenants.length} tenants
      </div>

      {/* Empty Search Results */}
      {sortedTenants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No tenants match your search or filters.</p>
          <button
            onClick={resetFilters}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Tenants Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTenants.map((tenant) => {
            const isExpanded = expandedTenants.has(tenant.tenant_id);
            const paymentStatus = calculatePaymentStatus(tenant);
            const paymentStyle = getPaymentStatusStyle(paymentStatus);
            const appStatusStyle = getApplicationStatusStyle(tenant.application_status);

            return (
              <div
                key={tenant.tenant_id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    {/* Profile Picture Placeholder */}
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold text-lg">
                      {tenant.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>

                    {/* Application Status Badge */}
                    {tenant.application_status && (
                      <span className={`${appStatusStyle.bg} ${appStatusStyle.text} px-2 py-1 rounded text-xs font-medium`}>
                        {tenant.application_status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-purple-900 mb-1">
                    {tenant.full_name}
                  </h3>
                </div>

                {/* Card Body - Collapsed View */}
                <div className="p-5 space-y-3">
                  {/* Phone */}
                  {tenant.phone && (
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {tenant.phone}
                    </div>
                  )}

                  {/* Payment Type & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-gray-700">{tenant.payment_type || 'N/A'}</span>
                    </div>

                    {/* Payment Status Badge */}
                    <span className={`${paymentStyle.bg} ${paymentStyle.text} border ${paymentStyle.border} px-2 py-1 rounded text-xs font-medium`}>
                      {paymentStatus}
                      {tenant.actual_rent > 0 && (
                        <span className="ml-1">${tenant.actual_rent}/mo</span>
                      )}
                    </span>
                  </div>

                  {/* Bed Assignment */}
                  <div className="flex items-start text-sm text-gray-700">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{tenant.location}</span>
                  </div>

                  {/* Entry Date */}
                  {tenant.entry_date && (
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Entry: {new Date(tenant.entry_date).toLocaleDateString()}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
                      {tenant.email && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Email:</span> {tenant.email}
                        </div>
                      )}
                      {tenant.dob && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">DOB:</span> {new Date(tenant.dob).toLocaleDateString()}
                        </div>
                      )}
                      {tenant.gender && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Gender:</span> {tenant.gender}
                        </div>
                      )}
                      {tenant.doc_number && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">DOC #:</span> {tenant.doc_number}
                        </div>
                      )}
                      {tenant.voucher_start && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Voucher Start:</span> {new Date(tenant.voucher_start).toLocaleDateString()}
                        </div>
                      )}
                      {tenant.voucher_end && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Voucher End:</span> {new Date(tenant.voucher_end).toLocaleDateString()}
                        </div>
                      )}
                      {tenant.actual_rent && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Monthly Rent:</span> ${tenant.actual_rent}/mo
                        </div>
                      )}
                      {tenant.rent_due > 0 && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Total Accumulated Rent:</span> ${tenant.rent_due.toFixed(2)} due, ${(tenant.rent_paid || 0).toFixed(2)} paid
                        </div>
                      )}
                      {tenant.exit_date && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Exit Date:</span> {new Date(tenant.exit_date).toLocaleDateString()}
                        </div>
                      )}
                      {tenant.notes && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span>
                          <p className="mt-1 text-gray-600">{tenant.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer - View Details Button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => toggleTenant(tenant.tenant_id)}
                    className="w-full py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    {isExpanded ? 'Hide Details ▲' : 'View Details ▼'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tenants;
