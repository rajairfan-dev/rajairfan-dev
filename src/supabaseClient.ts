import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mtqletasehhoitdlvcqo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cWxldGFzZWhob2l0ZGx2Y3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NTI0MTksImV4cCI6MjEwMzUyODQxOX0.c1DMagWHI7vrBS1aLoXkGL7H2TwX4nTZB6ugOMdpYBw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
