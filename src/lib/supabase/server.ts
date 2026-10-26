import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase côté serveur, authentifié par la clé `service_role`.
 *
 * Ce client contourne la RLS et ne doit JAMAIS être importé dans un
 * composant client. Il est réservé aux routes API (route handlers) et
 * aux Server Components.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase non configuré : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis (.env.local).',
    );
  }

  cached = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cached;
}
