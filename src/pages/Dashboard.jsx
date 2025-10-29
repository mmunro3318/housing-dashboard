import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import MetricCard from '../components/dashboard/MetricCard';
import PropertiesOverviewWidget from '../components/dashboard/PropertiesOverviewWidget';
import AvailableBedsList from '../components/dashboard/AvailableBedsList';
import VoucherExpirationWidget from '../components/dashboard/VoucherExpirationWidget';

function Dashboard() {
  // Fetch all beds to calculate metrics
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

  // Fetch all houses
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

  // Calculate metrics
  const totalBeds = beds?.length || 0;
  const occupiedBeds = beds?.filter(bed => bed.status === 'Occupied').length || 0;
  const availableBeds = beds?.filter(bed => bed.status === 'Available').length || 0;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const isLoading = bedsLoading || tenantsLoading || housesLoading;

  if (bedsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-semibold">Error loading dashboard data</p>
        <p className="text-red-600 text-sm mt-1">{bedsError.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-purple-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of your housing operations</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Row 1: Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Beds"
              value={totalBeds}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              color="blue"
            />
            <MetricCard
              title="Occupied"
              value={occupiedBeds}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="green"
            />
            <MetricCard
              title="Available"
              value={availableBeds}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              color="blue"
            />
            <MetricCard
              title="Occupancy Rate"
              value={`${occupancyRate}%`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              color="purple"
            />
          </div>

          {/* Row 2: Properties Overview Widget */}
          <PropertiesOverviewWidget
            houses={houses}
            beds={beds}
            isLoading={isLoading}
          />

          {/* Row 3: Voucher Alerts and Available Beds */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VoucherExpirationWidget
              tenants={tenants}
              isLoading={isLoading}
            />
            <AvailableBedsList
              beds={beds}
              houses={houses}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
