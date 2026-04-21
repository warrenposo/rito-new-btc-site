import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rucaagoiuvlfcsjwfrqv.supabase.co';
const supabaseAnonKey = 'sb_publishable_o803MNuoFjzB5vQZ7NiUxQ_S9nJ5Tfr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

