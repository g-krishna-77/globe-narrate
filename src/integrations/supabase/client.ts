import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration - using Vite environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iqnafwkhwyyjivrzowip.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL is required but not provided');
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required but not provided');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
