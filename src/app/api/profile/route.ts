import { requireUser, handleApiError } from '@/lib/market';

/** GET /api/profile — profil de l'utilisateur connecté (solde MochyCoins). */
export async function GET() {
  try {
    const { profile } = await requireUser();
    return Response.json({
      user_id: profile.user_id,
      display_name: profile.display_name,
      coins: profile.coins,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
