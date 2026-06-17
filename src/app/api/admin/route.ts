import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Client "service_role" : à n'utiliser QUE côté serveur.
// SUPABASE_SERVICE_ROLE_KEY ne doit jamais avoir le préfixe NEXT_PUBLIC_
// et ne doit jamais être exposée au navigateur.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { requesterEmail, name, email, password } = await req.json();

    if (!requesterEmail || !email || !password) {
      return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 });
    }

    // Vérifie que la personne qui fait la demande est déjà un admin existant.
    const { data: requester } = await supabaseAdmin
      .from('admins')
      .select('email')
      .eq('email', requesterEmail)
      .maybeSingle();

    if (!requester) {
      return NextResponse.json({ error: 'Non autorisé : vous devez être administrateur pour créer un compte admin.' }, { status: 403 });
    }

    // Création du compte d'authentification, sans toucher à la session du navigateur
    // puisque ceci s'exécute côté serveur avec la clé service_role.
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    const { error: insertError } = await supabaseAdmin
      .from('admins')
      .insert([{ email }]);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    await supabaseAdmin.from('customers').upsert(
      [{ email, customer_name: name || email }],
      { onConflict: 'email' }
    );

    return NextResponse.json({ success: true, userId: created.user?.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur inconnue.' }, { status: 500 });
  }
}