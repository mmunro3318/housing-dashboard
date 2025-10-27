/**
 * Sample Vercel Serverless Function
 *
 * This demonstrates the pattern for backend API routes.
 * Each file in /api becomes an endpoint.
 *
 * Endpoint: https://housing-dashboard.vercel.app/api/hello
 */

export default async function handler(req, res) {
  // CORS headers (adjust domains in production)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Housing Dashboard API',
      version: '0.1.0',
      status: 'operational',
      endpoints: {
        houses: '/api/houses',
        beds: '/api/beds',
        tenants: '/api/tenants',
        forms: '/api/forms'
      },
      note: 'API routes will be implemented as we build the backend'
    });
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
