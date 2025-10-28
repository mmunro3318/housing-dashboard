import React from 'react';

function Tenants() {
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
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h3>
        <p className="text-gray-600">Tenant management features will be available in the next sprint.</p>
      </div>
    </div>
  );
}

export default Tenants;
