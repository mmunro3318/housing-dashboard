import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-purple-100">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-purple-900">Housing Dashboard</h1>
            <p className="text-xs text-purple-600">Halfway Housing Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, Manager</span>
          <button className="px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
