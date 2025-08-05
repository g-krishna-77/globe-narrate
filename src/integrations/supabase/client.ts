import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration - using Vite environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error('Available env vars:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE
  });
  throw new Error('supabaseUrl is required. Please set VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable.');
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('supabaseAnonKey is required. Please set VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
