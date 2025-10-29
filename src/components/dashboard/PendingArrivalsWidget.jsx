import React from 'react';
import { getDaysUntil, formatDate } from '../../utils/dateHelpers';

function PendingArrivalsWidget({ tenants, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <h3 className="text-lg font-bold text-gray-900">Pending Arrivals</h3>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Filter tenants moving in within the next 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

  const pendingArrivals = tenants?.filter(tenant => {
    // Must have an entry_date
    if (!tenant.entry_date) return false;

    // Must not have exited already
    if (tenant.exit_date) return false;

    const entryDate = new Date(tenant.entry_date);

    // Check if entry date is in the future (not already moved in)
    // AND within next 30 days
    return entryDate >= today && entryDate <= thirtyDaysFromNow;
  }) || [];

  // Sort by entry date (soonest first)
  pendingArrivals.sort((a, b) => {
    return new Date(a.entry_date) - new Date(b.entry_date);
  });

  // Limit to first 10 for display
  const displayArrivals = pendingArrivals.slice(0, 10);
  const hasMore = pendingArrivals.length > 10;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Pending Arrivals</h3>
            <p className="text-sm text-gray-600">
              Moving in next 30 days
            </p>
          </div>
          {pendingArrivals.length > 0 && (
            <span className="bg-blue-200 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold">
              {pendingArrivals.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {pendingArrivals.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block bg-blue-100 rounded-full p-3 mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm font-medium">All Clear!</p>
            <p className="text-gray-500 text-xs mt-1">No arrivals scheduled in the next 30 days</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {displayArrivals.map(tenant => {
                const daysUntil = getDaysUntil(tenant.entry_date);

                return (
                  <div
                    key={tenant.tenant_id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {tenant.full_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Arriving: {formatDate(tenant.entry_date)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="bg-blue-100 text-blue-700 border border-blue-500 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? '1 day' : `${daysUntil} days`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  +{pendingArrivals.length - 10} more arriving soon
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PendingArrivalsWidget;
