
import { createClient } from '@supabase/supabase-js';

// Configuration provided by user
const supabaseUrl = 'https://zlegsavclfiulmteclgl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZWdzYXZjbGZpdWxtdGVjbGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTI3MTYsImV4cCI6MjA4MTEyODcxNn0.fpKnq3H3JpT2VmSQxIH3EWl70dmQkWxo6yEbkQR9dzU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
