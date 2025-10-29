import React from 'react';

function PropertiesOverviewWidget({ houses, beds, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-purple-900 mb-4">Properties Overview</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalProperties = houses?.length || 0;
  const totalBeds = houses?.reduce((sum, h) => sum + h.total_beds, 0) || 0;

  const occupiedBeds = beds?.filter(b => b.status === 'Occupied').length || 0;
  const overallOccupancyRate = totalBeds > 0
    ? Math.round((occupiedBeds / totalBeds) * 100)
    : 0;

  // Group beds by house to calculate properties at full capacity
  const bedsByHouse = beds?.reduce((acc, bed) => {
    if (!acc[bed.house_id]) acc[bed.house_id] = [];
    acc[bed.house_id].push(bed);
    return acc;
  }, {}) || {};

  const propertiesAtCapacity = houses?.filter(house => {
    const houseBeds = bedsByHouse[house.house_id] || [];
    const occupied = houseBeds.filter(b => b.status === 'Occupied').length;
    return occupied === house.total_beds && house.total_beds > 0;
  }).length || 0;

  // Calculate total potential monthly income
  const totalPotentialIncome = beds?.reduce((sum, bed) => sum + (bed.base_rent || 0), 0) || 0;

  const metrics = [
    {
      label: 'Total Properties',
      value: totalProperties,
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      label: 'Total Beds',
      value: totalBeds,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Occupancy Rate',
      value: `${overallOccupancyRate}%`,
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      label: 'At Full Capacity',
      value: propertiesAtCapacity,
      icon: (
        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Potential Income',
      value: `$${totalPotentialIncome.toLocaleString()}/mo`,
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  // Empty state
  if (totalProperties === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-purple-900 mb-4">Properties Overview</h3>
        <div className="text-center py-8">
          <div className="inline-block bg-purple-100 rounded-full p-3 mb-3">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-gray-600">No properties found. Add your first property to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-purple-900 mb-4">Properties Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-center mb-2">
              {metric.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-xs text-gray-600">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertiesOverviewWidget;
