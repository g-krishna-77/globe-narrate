import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration - using direct values for Lovable
const SUPABASE_URL = 'https://iqnafwkhwyyjivrzowip.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmFmd2tod3l5aml2cnpvd2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjc2MDEsImV4cCI6MjA2OTkwMzYwMX0.JCq5UgSgJYLHPs9eQbmIDVNOYL7mHk37Op9J2P8DK4E';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
