import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { getSessionUser, handleApiError } from '@/lib/market';
import type {
  CommunityListResponse,
  CommunitySceneView,
  SceneRow,
  WeeklyWinner,
} from '@/lib/community/scenes';

// Clôture hebdo throttlée (même principe que le settlement du marché).
let lastSettle = 0;
const SETTLE_INTERVAL_MS = 15_000;

async function settleWeekThrottled(): Promise<void> {
  const now = Date.now();
  if (now - lastSettle < SETTLE_INTERVAL_MS) return;
  lastSettle = now;
  try {
    await getSupabaseAdmin().rpc('community_settle_week');
  } catch (err) {
    console.error('community_settle_week:', err instanceof Error ? err.message : err);
  }
}

/**
 * GET /api/community/scenes?sort=top|new — galerie communautaire :
 * scènes publiées + infos du concours (fin de semaine, derniers gagnants).
 *
 * Si les tables n'existent pas encore (migration SQL non exécutée), la
 * réponse reste 200 avec `needs_setup: true` pour afficher un état
 * d'attente propre côté client.
 */
export async function GET(req: NextRequest) {
  try {
    const sort = req.nextUrl.searchParams.get('sort') === 'new' ? 'new' : 'top';
    const user = await getSessionUser();
    const supabase = getSupabaseAdmin();

    await settleWeekThrottled();

    // ----- État du concours
    const { data: state } = await supabase
      .from('community_state')
      .select('week_start')
      .eq('id', 1)
      .maybeSingle();
    const weekStart = state?.week_start ? new Date(state.week_start) : new Date();
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 3600 * 1000);

    // ----- Scènes publiées
    let query = supabase
      .from('community_scenes')
      .select('*')
      .eq('published', true)
      .limit(48);
    query =
      sort === 'top'
        ? query.order('votes_total', { ascending: false }).order('published_at', { ascending: false })
        : query.order('published_at', { ascending: false });

    const { data: rows, error } = await query;
    if (error) {
      // Table absente (SQL pas encore exécuté) → état d'attente.
      if ((error as { code?: string }).code === 'PGRST205' || /does not exist/i.test(error.message)) {
        return Response.json({
          scenes: [],
          week_end: weekEnd.toISOString(),
          winners: [],
          needs_setup: true,
        } satisfies CommunityListResponse & { needs_setup: boolean });
      }
      throw new Error(`community_scenes: ${error.message}`);
    }
    const scenes = (rows as SceneRow[]) ?? [];

    // ----- Auteurs
    const authorIds = [...new Set(scenes.map((s) => s.user_id))];
    const { data: authors } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url')
      .in('user_id', authorIds.length > 0 ? authorIds : ['—']);
    const authorMap = new Map(
      ((authors as Array<{ user_id: string; display_name: string; avatar_url: string | null }>) ?? []).map(
        (a) => [a.user_id, a],
      ),
    );

    // ----- Mon vote
    let votedIds = new Set<string>();
    if (user && scenes.length > 0) {
      const { data: votes } = await supabase
        .from('community_scene_votes')
        .select('scene_id')
        .eq('user_id', user.id)
        .in('scene_id', scenes.map((s) => s.id));
      votedIds = new Set(((votes as Array<{ scene_id: string }>) ?? []).map((v) => v.scene_id));
    }

    const views: CommunitySceneView[] = scenes.map((s) => ({
      ...s,
      author: authorMap.get(s.user_id) ?? {
        user_id: s.user_id,
        display_name: 'Plushie',
        avatar_url: null,
      },
      my_vote: votedIds.has(s.id),
    }));

    // ----- Palmarès de la semaine passée (le plus récent archivé)
    const { data: lastReward } = await supabase
      .from('community_rewards')
      .select('week_start')
      .order('week_start', { ascending: false })
      .limit(1)
      .maybeSingle();

    let winners: WeeklyWinner[] = [];
    if (lastReward?.week_start) {
      const { data: rewRows } = await supabase
        .from('community_rewards')
        .select('rank, coins, votes, scene_id, user_id')
        .eq('week_start', lastReward.week_start)
        .order('rank', { ascending: true });
      const rews =
        (rewRows as Array<{
          rank: number;
          coins: number;
          votes: number;
          scene_id: string;
          user_id: string;
        }>) ?? [];

      const sceneIds = rews.map((r) => r.scene_id);
      const { data: rewScenes } = sceneIds.length
        ? await supabase
            .from('community_scenes')
            .select('id, title, thumbnail')
            .in('id', sceneIds)
        : { data: [] };
      const sceneMap = new Map(
        ((rewScenes as Array<{ id: string; title: string; thumbnail: string | null }>) ?? []).map(
          (s) => [s.id, s],
        ),
      );
      const { data: rewAuthors } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', [...new Set(rews.map((r) => r.user_id))]);
      const authorName = new Map(
        ((rewAuthors as Array<{ user_id: string; display_name: string }>) ?? []).map((a) => [
          a.user_id,
          a.display_name,
        ]),
      );

      winners = rews.map((r) => ({
        rank: r.rank,
        coins: r.coins,
        votes: r.votes,
        scene_id: r.scene_id,
        title: sceneMap.get(r.scene_id)?.title ?? 'Scène',
        thumbnail: sceneMap.get(r.scene_id)?.thumbnail ?? null,
        author: authorName.get(r.user_id) ?? 'Plushie',
      }));
    }

    return Response.json({
      scenes: views,
      week_end: weekEnd.toISOString(),
      winners,
    } satisfies CommunityListResponse);
  } catch (err) {
    return handleApiError(err);
  }
}
