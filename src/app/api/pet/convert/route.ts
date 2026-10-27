import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';

interface ConversionResult {
  converted_hearts: number;
  coins: number;
  hearts: number;
}

/** POST /api/pet/convert — convertit les tranches complètes de 100 cœurs. */
export async function POST() {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('pet_convert_hearts', {
      p_user_id: user.id,
    });

    if (error) throw new Error(`pet_convert_hearts: ${error.message}`);

    const result = data as ConversionResult;
    return Response.json({
      convertedHearts: Number(result.converted_hearts),
      coins: Number(result.coins),
      hearts: Number(result.hearts),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
