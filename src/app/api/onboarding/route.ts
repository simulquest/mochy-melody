import { getSupabaseAdmin } from '@/lib/supabase/server';
import { requireUser, handleApiError } from '@/lib/market';

/** GET /api/onboarding — état du tutoriel pour le compte courant. */
export async function GET() {
  try {
    const { profile } = await requireUser();
    return Response.json({ completed: profile.onboarding_completed });
  } catch (error) {
    return handleApiError(error);
  }
}

/** POST /api/onboarding — mémorise la fin ou le passage du tutoriel. */
export async function POST() {
  try {
    const { user } = await requireUser();
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    if (error) throw new Error(`onboarding: ${error.message}`);
    return Response.json({ completed: true });
  } catch (error) {
    return handleApiError(error);
  }
}
