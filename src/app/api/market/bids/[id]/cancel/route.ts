import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';

/**
 * POST /api/market/bids/[id]/cancel — annule la mise active de l'utilisateur
 * sur une enchère encore en cours. Uniquement possible si la mise a été
 * dépassée (jamais en tête) : les MochyCoins bloqués sont remboursés.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('market_cancel_bid', {
      p_user_id: user.id,
      p_bid_id: id,
    });
    if (error) throw new Error(error.message);

    // Solde à jour après remboursement de l'escrow.
    const { data: profile } = await supabase
      .from('profiles')
      .select('coins')
      .eq('user_id', user.id)
      .single();

    return Response.json({
      bid: data,
      coins: (profile as { coins: number } | null)?.coins ?? null,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
