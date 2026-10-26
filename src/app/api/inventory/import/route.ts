import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';
import { mutationKey } from '@/lib/plush/mutations';
import type { OwnedPlush } from '@/lib/plush/lootbox';

/** Corps : liste des peluches possédées en localStorage. */
type ImportBody = { owned?: OwnedPlush[] };

/**
 * POST /api/inventory/import — import initial (idempotent par hash) de la
 * collection locale vers les piles Supabase. Chaque peluche devient une ligne
 * pile (variante + mutation), quantité conservée.
 */
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser();
    const body = (await req.json().catch(() => ({}))) as ImportBody;
    const owned = Array.isArray(body.owned) ? body.owned : [];

    const items = owned.map((o) => ({
      card_id: o.id,
      card_name: o.name,
      species_id: o.speciesId ?? 'mochi',
      rarity_idx: o.rarityIdx ?? 0,
      preset: {
        id: o.id,
        name: o.name,
        root: o.root,
        tip: o.tip,
        body: o.body,
        glow: o.glow,
        ...(o.hueShift ? { hueShift: o.hueShift } : {}),
      },
      mutation: o.mutation ?? null,
      mutation_key: mutationKey(o.mutation),
      quantity: Math.max(1, o.quantity ?? 1),
    }));

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('market_import_inventory', {
      p_user_id: user.id,
      p_items: items,
    });
    if (error) throw new Error(`market_import_inventory: ${error.message}`);

    return Response.json({ imported: data as number });
  } catch (err) {
    return handleApiError(err);
  }
}
