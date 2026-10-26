import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError, apiError } from '@/lib/market';

/** POST /api/market/listings/[id]/bid — enchérir. Body : { amount } */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const body = (await req.json().catch(() => ({}))) as { amount?: number };
    const amount = Math.floor(Number(body.amount));

    if (!Number.isFinite(amount) || amount < 1) {
      return apiError('Montant invalide');
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('market_place_bid', {
      p_user_id: user.id,
      p_listing_id: id,
      p_amount: amount,
    });
    if (error) throw new Error(error.message);

    // solde à jour pour l'affichage
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
