import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://onvqzqkjzbkprjgrsqrb.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9udnF6cWtqemJrcHJqZ3JzcXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2MzE2NTYsImV4cCI6MTk5NjIwNzY1Nn0.8qui7dZhi_noDerDr1m5I81ysRONjaanpKBW3GbNAxo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
