import { requireUser, handleApiError } from '@/lib/market';
import { getSupabaseAdmin } from '@/lib/supabase/server';

/** Format de la sélection stockée dans profiles.selection (jsonb). */
interface ServerSelection {
  equipped: string | null;
  byShape: Record<string, string>;
}

/** Valide la charge utile `selection` envoyée par le client (tolérant). */
function validateSelection(raw: unknown): ServerSelection | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Sélection invalide');
  }
  const { equipped, byShape } = raw as Record<string, unknown>;
  if (equipped !== null && equipped !== undefined && typeof equipped !== 'string') {
    throw new Error('Sélection invalide');
  }
  if (typeof equipped === 'string' && equipped.length > 200) {
    throw new Error('Sélection invalide');
  }
  const clean: Record<string, string> = {};
  if (byShape !== undefined && byShape !== null) {
    if (typeof byShape !== 'object' || Array.isArray(byShape)) {
      throw new Error('Sélection invalide');
    }
    let count = 0;
    for (const [shape, key] of Object.entries(byShape as Record<string, unknown>)) {
      if (count >= 32) break;
      if (
        typeof shape === 'string' && shape.length > 0 && shape.length <= 64 &&
        typeof key === 'string' && key.length > 0 && key.length <= 200
      ) {
        clean[shape] = key;
        count += 1;
      }
    }
  }
  return { equipped: typeof equipped === 'string' ? equipped : null, byShape: clean };
}

/** GET /api/profile — profil de l'utilisateur connecté (solde MochyCoins). */
export async function GET() {
  try {
    const { profile } = await requireUser();
    return Response.json({
      user_id: profile.user_id,
      display_name: profile.display_name,
      coins: profile.coins,
      selection: profile.selection ?? null,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/** PUT /api/profile — enregistre la sélection de peluche de l'utilisateur. */
export async function PUT(request: Request) {
  try {
    const { user } = await requireUser();
    const body = (await request.json().catch(() => null)) as { selection?: unknown } | null;
    if (!body) throw new Error('Corps de requête invalide');
    const selection = validateSelection(body.selection);
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('profiles')
      .update({ selection, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    if (error) throw new Error(error.message);
    return Response.json({ ok: true, selection });
  } catch (err) {
    return handleApiError(err);
  }
}
