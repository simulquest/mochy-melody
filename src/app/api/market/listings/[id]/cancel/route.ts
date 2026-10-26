import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';

/** POST /api/market/listings/[id]/cancel — annuler (uniquement sans enchère). */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('market_cancel_listing', {
      p_user_id: user.id,
      p_listing_id: id,
    });
    if (error) throw new Error(error.message);

    return Response.json({ listing: data });
  } catch (err) {
    return handleApiError(err);
  }
}
