import React from 'react';
import { getDaysUntil, formatDate, getUrgencyLevel } from '../../utils/dateHelpers';

function VoucherExpirationWidget({ tenants, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <h3 className="text-lg font-bold text-gray-900">Voucher Expiration Alerts</h3>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    );
  }

  // Filter tenants with vouchers expiring in the next 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

  const expiringVouchers = tenants?.filter(tenant => {
    // Must have a voucher_end date
    if (!tenant.voucher_end) return false;

    // Must not have exited already
    if (tenant.exit_date) return false;

    const voucherEnd = new Date(tenant.voucher_end);

    // Check if expiring within 30 days (including today and future)
    return voucherEnd >= today && voucherEnd <= thirtyDaysFromNow;
  }) || [];

  // Sort by expiration date (soonest first)
  expiringVouchers.sort((a, b) => {
    return new Date(a.voucher_end) - new Date(b.voucher_end);
  });

  // Limit to first 10 for display
  const displayVouchers = expiringVouchers.slice(0, 10);
  const hasMore = expiringVouchers.length > 10;

  // Get urgency styling
  const getUrgencyStyle = (daysUntil) => {
    const level = getUrgencyLevel(daysUntil);

    if (level === 'critical') {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        textColor: 'text-red-700',
        badgeBg: 'bg-red-100',
        badgeText: 'text-red-700',
        badgeBorder: 'border-red-500'
      };
    }

    // warning
    return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      textColor: 'text-yellow-700',
      badgeBg: 'bg-yellow-100',
      badgeText: 'text-yellow-700',
      badgeBorder: 'border-yellow-500'
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-yellow-50 border-b border-yellow-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Voucher Expiration Alerts</h3>
            <p className="text-sm text-gray-600">
              Expiring in next 30 days
            </p>
          </div>
          {expiringVouchers.length > 0 && (
            <span className="bg-yellow-200 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-semibold">
              {expiringVouchers.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {expiringVouchers.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block bg-green-100 rounded-full p-3 mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm font-medium">All Good!</p>
            <p className="text-gray-500 text-xs mt-1">No vouchers expiring in the next 30 days</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {displayVouchers.map(tenant => {
                const daysUntil = getDaysUntil(tenant.voucher_end);
                const style = getUrgencyStyle(daysUntil);

                return (
                  <div
                    key={tenant.tenant_id}
                    className={`flex items-center justify-between p-3 ${style.bg} rounded border ${style.border}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {tenant.full_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires: {formatDate(tenant.voucher_end)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`${style.badgeBg} ${style.badgeText} border ${style.badgeBorder} px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap`}>
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
                  +{expiringVouchers.length - 10} more expiring soon
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VoucherExpirationWidget;
