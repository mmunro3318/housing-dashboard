import React from 'react';

function AvailableBedsList({ beds, houses, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-green-50 border-b border-green-200 p-4">
          <h3 className="text-lg font-bold text-gray-900">Available Beds</h3>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  // Filter available beds
  const availableBeds = beds?.filter(bed => bed.status === 'Available') || [];

  // Create house lookup map
  const houseMap = houses?.reduce((acc, house) => {
    acc[house.house_id] = house;
    return acc;
  }, {}) || {};

  // Enrich beds with house information
  const enrichedBeds = availableBeds.map(bed => {
    const house = houseMap[bed.house_id];
    return {
      ...bed,
      houseAddress: house?.address || 'Unknown',
      county: house?.county
    };
  });

  // Sort by house address, then room number
  enrichedBeds.sort((a, b) => {
    if (a.houseAddress !== b.houseAddress) {
      return a.houseAddress.localeCompare(b.houseAddress);
    }
    return a.room_number.localeCompare(b.room_number);
  });

  // Limit to first 10 for display
  const displayBeds = enrichedBeds.slice(0, 10);
  const hasMore = enrichedBeds.length > 10;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-green-50 border-b border-green-200 p-4">
        <h3 className="text-lg font-bold text-gray-900">Available Beds</h3>
        <p className="text-sm text-gray-600">
          {availableBeds.length} {availableBeds.length === 1 ? 'bed' : 'beds'} ready for occupancy
        </p>
      </div>

      <div className="p-4">
        {availableBeds.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block bg-gray-100 rounded-full p-3 mb-3">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No beds currently available</p>
            <p className="text-gray-400 text-xs mt-1">All beds are occupied or on hold</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {displayBeds.map(bed => (
                <div
                  key={bed.bed_id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border border-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Room {bed.room_number}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {bed.houseAddress}
                    </p>
                    {bed.county && (
                      <p className="text-xs text-gray-400">
                        {bed.county}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    {bed.base_rent > 0 ? (
                      <span className="text-sm font-semibold text-green-600">
                        ${bed.base_rent.toFixed(0)}/mo
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No rent set
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  +{enrichedBeds.length - 10} more available
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AvailableBedsList;
