import React from 'react';

function Properties() {
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
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h3>
        <p className="text-gray-600">Property management features will be available in the next sprint.</p>
      </div>
    </div>
  );
}

export default Properties;
