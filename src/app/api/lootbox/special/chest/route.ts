import { requireUser, handleApiError } from '@/lib/market';
import { reportChestMissed } from '@/lib/plush/chest-schedule';

/**
 * POST /api/lootbox/special/chest — le client signale que le coffre mystère
 * prévu à `dueAt` a disparu sans être touché (ou qu'une ouverture a échoué).
 *
 * Le serveur compte la chute manquée et re-planifie la suivante dans 2,5 à
 * 6 min. Le compare-and-swap sur l'horaire garantit qu'un même coffre n'est
 * compté qu'une seule fois (plusieurs onglets, requêtes en double…).
 *
 * Rouvrir le site ne permet PAS d'accélérer l'apparition : l'horaire est
 * mémorisé côté serveur, recharger ne fait que le récupérer.
 *
 * Réponse : { chest: { nextSpawnAt, spawnsLeft } | null }
 *   (null = plus de coffre aujourd'hui : tentative consommée ou 5 chutes
 *   manquées).
 */
export async function POST(request: Request) {
  try {
    const { user } = await requireUser();

    let dueAt = '';
    try {
      const body = (await request.json()) as { dueAt?: unknown };
      if (typeof body.dueAt === 'string') dueAt = body.dueAt;
    } catch {
      // Corps absent ou invalide : dueAt reste vide → erreur 400 ci-dessous.
    }
    if (!dueAt) {
      return Response.json({ error: 'Instant du coffre manquant (dueAt).' }, { status: 400 });
    }

    const chest = await reportChestMissed(user.id, dueAt);
    return Response.json({ chest });
  } catch (err) {
    return handleApiError(err);
  }
}
