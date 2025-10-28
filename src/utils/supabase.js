/**
 * Supabase Client Initialization
 *
 * This file creates and exports a single Supabase client instance
 * to be used throughout the application.
 *
 * Environment variables are loaded via Vite's import.meta.env
 * (NOT process.env - that's Node.js only)
 */

import { createClient } from '@supabase/supabase-js'

// Load environment variables from Vercel/Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set ✓' : 'Missing ✗')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set ✓' : 'Missing ✗')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export URL for debugging
export { supabaseUrl }
