import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-purple-900 mb-4">
            Housing Dashboard
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
          <p className="text-xl text-purple-700 mb-2">
            Halfway Housing Management Platform
          </p>
          <p className="text-gray-600 max-w-md mx-auto">
            A unified dashboard for managing residents, properties, beds, and intake workflows.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto">
          <div className="mb-6">
            <div className="inline-block bg-purple-100 rounded-full p-4 mb-4">
              <svg
                className="w-12 h-12 text-purple-600"
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Coming Soon
            </h2>
            <p className="text-gray-600">
              We're building something special. This platform will streamline halfway housing operations with:
            </p>
          </div>

          <div className="text-left space-y-3 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Property & Bed Management</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Resident Intake Forms with E-Signatures</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Payment & Voucher Tracking</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Real-Time Dashboard & Reporting</span>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p className="font-semibold mb-1">Development Status</p>
            <p>Phase 2: Post-Demo Refinement</p>
            <p className="mt-2 text-xs">Expected MVP: December 2025</p>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Built with React + Vite + Tailwind CSS</p>
          <p>Deployed on Vercel</p>
        </div>
      </div>
    </div>
  );
}

export default App;
