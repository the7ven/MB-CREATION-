import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// On vérifie la présence des clés AVANT de créer le client
if (!supabaseUrl || !supabaseAnonKey) {
  // En mode développement, on prévient l'utilisateur
  if (process.env.NODE_ENV !== 'production') {
    console.warn("Attention: Les clés Supabase sont manquantes. Vérifiez votre fichier .env.local");
  }
}

// Pour éviter l'erreur "supabaseUrl is required", on passe des valeurs par défaut 
// uniquement si les vraies sont absentes (cas du build statique)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);