import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';

function Settings() {
  const [activeTab, setActiveTab] = useState('voucher-rates');

  const tabs = [
    {
      id: 'voucher-rates',
      name: 'Voucher Rates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      id: 'account',
      name: 'Account',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-purple-900">Settings</h2>
        <p className="text-gray-600 mt-1">Configure your system preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {activeTab === 'voucher-rates' && <VoucherRatesTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'account' && <AccountTab />}
      </div>
    </div>
  );
}

// Voucher Rates Tab Component
function VoucherRatesTab() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Local state for form inputs
  const [formData, setFormData] = useState({
    erdRate: '',
    greRate: '',
    section8Rate: '',
    telecareRate: '',
  });

  // Fetch all voucher settings from database
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['voucher-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .in('setting_key', ['erd_rate', 'voucher_rate', 'gre_rate', 'section8_rate', 'telecare_rate']);

      if (error) throw error;

      // Convert array to object for easy access
      const settingsObj = {};
      data.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });

      return settingsObj;
    },
  });

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        // Use erd_rate if available, otherwise fall back to voucher_rate for backwards compatibility
        erdRate: settings.erd_rate || settings.voucher_rate || '',
        greRate: settings.gre_rate || '',
        section8Rate: settings.section8_rate || '',
        telecareRate: settings.telecare_rate || '',
      });
    }
  }, [settings]);

  // Mutation to save rates
  const saveRatesMutation = useMutation({
    mutationFn: async (rates) => {
      const updates = [];

      // Update ERD rate
      if (rates.erdRate) {
        updates.push(
          supabase
            .from('system_settings')
            .upsert({
              setting_key: 'erd_rate',
              setting_value: rates.erdRate,
              setting_type: 'number',
              description: 'ERD (Estimated Release Date) monthly voucher rate',
              last_updated: new Date().toISOString(),
            })
        );
      }

      // Update GRE rate
      if (rates.greRate) {
        updates.push(
          supabase
            .from('system_settings')
            .upsert({
              setting_key: 'gre_rate',
              setting_value: rates.greRate,
              setting_type: 'number',
              description: 'GRE (Graduate Re-Entry) monthly voucher rate',
              last_updated: new Date().toISOString(),
            })
        );
      }

      // Update Section 8 rate
      if (rates.section8Rate) {
        updates.push(
          supabase
            .from('system_settings')
            .upsert({
              setting_key: 'section8_rate',
              setting_value: rates.section8Rate,
              setting_type: 'number',
              description: 'Section 8 voucher rate',
              last_updated: new Date().toISOString(),
            })
        );
      }

      // Update TeleCare rate
      if (rates.telecareRate) {
        updates.push(
          supabase
            .from('system_settings')
            .upsert({
              setting_key: 'telecare_rate',
              setting_value: rates.telecareRate,
              setting_type: 'number',
              description: 'TeleCare voucher rate',
              last_updated: new Date().toISOString(),
            })
        );
      }

      const results = await Promise.all(updates);

      // Check for errors
      results.forEach(({ error }) => {
        if (error) throw error;
      });

      return results;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['voucher-settings']);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error saving rates:', error);
      alert('Failed to save rates. Please try again.');
    },
  });

  const handleSave = () => {
    saveRatesMutation.mutate(formData);
  };

  const handleCancel = () => {
    // Reset form to current database values
    if (settings) {
      setFormData({
        erdRate: settings.erd_rate || settings.voucher_rate || '',
        greRate: settings.gre_rate || '',
        section8Rate: settings.section8_rate || '',
        telecareRate: settings.telecare_rate || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading voucher rates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading voucher rates: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Voucher Rate Configuration</h3>
        <p className="text-sm text-gray-600">
          Set the monthly voucher rates for all programs. Rate changes affect <strong>all tenants</strong> on that program.
        </p>
      </div>

      <div className="space-y-6">
        {/* ERD Rate */}
        <div>
          <label htmlFor="erd-rate" className="block text-sm font-medium text-gray-700 mb-2">
            ERD Voucher Rate (per month)
            <span className="ml-2 text-xs text-gray-500 font-normal">Estimated Release Date • 6 month duration</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                id="erd-rate"
                type="number"
                step="0.01"
                value={formData.erdRate}
                onChange={(e) => setFormData({ ...formData, erdRate: e.target.value })}
                disabled={!isEditing}
                className={`block w-full pl-7 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
                placeholder="0.00"
              />
            </div>
            {!isEditing && formData.erdRate && (
              <span className="text-sm text-gray-600 font-medium">
                ${parseFloat(formData.erdRate).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* GRE Rate */}
        <div>
          <label htmlFor="gre-rate" className="block text-sm font-medium text-gray-700 mb-2">
            GRE Voucher Rate (per month)
            <span className="ml-2 text-xs text-gray-500 font-normal">Graduate Re-Entry • 6 month duration</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                id="gre-rate"
                type="number"
                step="0.01"
                value={formData.greRate}
                onChange={(e) => setFormData({ ...formData, greRate: e.target.value })}
                disabled={!isEditing}
                className={`block w-full pl-7 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
                placeholder="0.00"
              />
            </div>
            {!isEditing && formData.greRate && (
              <span className="text-sm text-gray-600 font-medium">
                ${parseFloat(formData.greRate).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Section 8 Rate */}
        <div>
          <label htmlFor="section8-rate" className="block text-sm font-medium text-gray-700 mb-2">
            Section 8 Voucher Rate (per month)
            <span className="ml-2 text-xs text-purple-600 font-normal">No expiration</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                id="section8-rate"
                type="number"
                step="0.01"
                value={formData.section8Rate}
                onChange={(e) => setFormData({ ...formData, section8Rate: e.target.value })}
                disabled={!isEditing}
                className={`block w-full pl-7 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
                placeholder="0.00"
              />
            </div>
            {!isEditing && formData.section8Rate && (
              <span className="text-sm text-gray-600 font-medium">
                ${parseFloat(formData.section8Rate).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* TeleCare Rate */}
        <div>
          <label htmlFor="telecare-rate" className="block text-sm font-medium text-gray-700 mb-2">
            TeleCare Voucher Rate (per month)
            <span className="ml-2 text-xs text-purple-600 font-normal">No expiration</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                id="telecare-rate"
                type="number"
                step="0.01"
                value={formData.telecareRate}
                onChange={(e) => setFormData({ ...formData, telecareRate: e.target.value })}
                disabled={!isEditing}
                className={`block w-full pl-7 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
                placeholder="0.00"
              />
            </div>
            {!isEditing && formData.telecareRate && (
              <span className="text-sm text-gray-600 font-medium">
                ${parseFloat(formData.telecareRate).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Rates
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saveRatesMutation.isPending}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saveRatesMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={saveRatesMutation.isPending}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">How Voucher Rates Work</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Rate changes affect ALL tenants</strong> on that voucher program (new and existing)</li>
                <li>• ERD & GRE vouchers expire after 6 months (tenant then pays base bed rate)</li>
                <li>• Section 8 & TeleCare have no expiration (active until Manager terminates)</li>
                <li>• Individual tenant rates can be overridden on a per-tenant basis if needed</li>
                <li>• Rates should match current DOC/agency voucher programs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notifications Tab Placeholder
function NotificationsTab() {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="inline-block bg-gray-100 rounded-full p-4 mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Notifications Settings</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Configure email and SMS notifications for rent reminders, voucher expirations, and system alerts.
        </p>
        <div className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-lg p-3 inline-block">
          Coming in Phase 5: Forms & Authentication
        </div>
      </div>
    </div>
  );
}

// Account Tab Placeholder
function AccountTab() {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="inline-block bg-gray-100 rounded-full p-4 mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Account Settings</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Manage your account profile, password, and authentication preferences.
        </p>
        <div className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-lg p-3 inline-block">
          Coming in Phase 5: Forms & Authentication
        </div>
      </div>
    </div>
  );
}

export default Settings;
