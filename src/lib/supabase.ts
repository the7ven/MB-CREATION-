import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Attention: Les clés Supabase sont manquantes dans les variables d'environnement.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);