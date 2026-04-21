import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cqrdcbfbypdytfkwahwe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcmRjYmZieXBkeXRma3dhaHdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2Mjg5MjYsImV4cCI6MjA5MTIwNDkyNn0.sIU9_aFJE43cGV19XtTfUAL4zZ0xwRah_lWIJoErcFY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

