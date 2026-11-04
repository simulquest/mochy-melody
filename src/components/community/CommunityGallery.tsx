'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import SceneViewer3D from './SceneViewer3D';
import SceneCardCanvas from './SceneCardCanvas';
import BottomNav from '@/components/plush/BottomNav';
import LoadingScreen from '@/components/LoadingScreen';
import { apiGet, apiPost, formatTimeLeft } from '@/lib/market-client';
import type { CommunityListResponse, CommunitySceneView } from '@/lib/community/scenes';
import { MAX_COMMENT } from '@/lib/community/scenes';

// ---------------------------------------------------------------------------
// CommunityGallery — galerie des scènes publiées : classement de la semaine
// (votes), palmarès précédent, détail avec viewer 3D + commentaires.
// ---------------------------------------------------------------------------

interface CommentItem {
  id: string;
  content: string;
  created_at: string;
  author: { user_id: string; display_name: string; avatar_url: string | null } | null;
}

type ListResponse = CommunityListResponse & { needs_setup?: boolean };

/** Couleurs des médailles top 3 (icône fa-medal, or / argent / bronze). */
const MEDAL_COLORS = ['text-amber-300', 'text-slate-200', 'text-amber-600'];

export default function CommunityGallery() {
  const [sort, setSort] = useState<'top' | 'new'>('top');
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [detail, setDetail] = useState<CommunitySceneView | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  }, []);

  const load = useCallback(
    async (s: 'top' | 'new') => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiGet<ListResponse>(`/api/community/scenes?sort=${s}`);
        setData(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Chargement impossible');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load(sort);
  }, [load, sort]);

  // Horloge du compte à rebours (30 s suffit)
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const weekLeft = useMemo(
    () => (data ? new Date(data.week_end).getTime() - now : 0),
    [data, now],
  );

  /** Vote optimiste. */
  const toggleVote = useCallback(
    async (scene: CommunitySceneView) => {
      const voted = scene.my_vote;
      // Mise à jour optimiste de la liste + du détail
      const patch = (s: CommunitySceneView): CommunitySceneView =>
        s.id === scene.id
          ? {
              ...s,
              my_vote: !voted,
              votes_total: Math.max(0, s.votes_total + (voted ? -1 : 1)),
            }
          : s;
      setData((d) => (d ? { ...d, scenes: d.scenes.map(patch) } : d));
      setDetail((dt) => (dt ? patch(dt) : dt));
      try {
        await apiPost<{ voted: boolean; votes: number }>(
          `/api/community/scenes/${scene.id}/vote`,
        );
      } catch (err) {
        // Annulation + message
        setData((d) => (d ? { ...d, scenes: d.scenes.map(patch) } : d));
        setDetail((dt) => (dt ? patch(dt) : dt));
        showToast(err instanceof Error ? err.message : 'Vote impossible');
      }
    },
    [showToast],
  );

  // ----- État : migration SQL pas encore exécutée
  if (data?.needs_setup) {
    return (
      <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-theme-bg px-6 pb-24 text-center">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          <i className="fa-solid fa-helmet-safety text-4xl text-white/30" aria-hidden />
          <h1 className="mt-3 text-xl font-black tracking-tight text-white">
            La communauté arrive !
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Les studios de création sont prêts, la galerie s&apos;ouvrira
            dès que l&apos;infrastructure communautaire sera activée.
          </p>
        </div>
        <BottomNav active="community" />
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] w-full bg-theme-bg pb-32">
      <div className="mx-auto w-full max-w-2xl px-4 pt-5">
        {/* En-tête */}
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              <i className="fa-solid fa-earth-americas mr-2 text-fuchsia-300" aria-hidden />
              Communauté
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-white/50">
              Les mondes des joueurs, le Mochy au centre. Vote pour tes
              scènes préférées&nbsp;: le top 10 gagne des MochyCoins chaque
              semaine&nbsp;!
            </p>
          </div>
          <Link
            href="/community/studio"
            className="shrink-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110 active:scale-95"
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-1.5" aria-hidden />
            Mon studio
          </Link>
        </header>

        {/* Bandeau concours */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-300/20 bg-amber-400/[0.06] px-4 py-3">
          <p className="text-xs font-bold text-amber-200/90">
            <i className="fa-solid fa-trophy mr-1.5" aria-hidden />
            Récompenses dans {formatTimeLeft(Math.max(0, weekLeft))}
          </p>
          <p className="text-[11px] text-amber-100/50">1ʳᵉ : 500 · 2ᵉ : 300 · 3ᵉ : 200 · top 10 : 100</p>
        </div>

        {/* Palmarès précédent */}
        {data && data.winners.length > 0 && (
          <section className="mt-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
              Gagnants de la semaine passée
            </h2>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {data.winners.map((w) => (
                <Link
                  key={`${w.rank}-${w.scene_id}`}
                  href={`/community?scene=${w.scene_id}`}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-3.5 transition-colors hover:bg-white/10"
                >
                  {w.rank <= 3 ? (
                    <i
                      className={`fa-solid fa-medal text-base ${MEDAL_COLORS[w.rank - 1]}`}
                      aria-hidden
                    />
                  ) : (
                    <span className="text-[10px] font-black text-white/45">{w.rank}ᵉ</span>
                  )}
                  <span className="max-w-36 truncate text-xs font-bold text-white/80">
                    {w.title}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-300/80">
                    +{w.coins}
                    <i className="fa-solid fa-coins text-[9px]" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tri */}
        <div className="mt-4 flex gap-1.5">
          {(
            [
              { id: 'top', label: 'Top de la semaine', icon: 'fa-solid fa-fire' },
              { id: 'new', label: 'Nouvelles', icon: 'fa-solid fa-clock' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSort(t.id)}
              aria-pressed={sort === t.id}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                sort === t.id
                  ? 'border-fuchsia-300/40 bg-fuchsia-500/20 text-fuchsia-100'
                  : 'border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/10'
              }`}
            >
              <i className={`${t.icon} text-[11px]`} aria-hidden />
              {t.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {loading && !data ? (
          <LoadingScreen />
        ) : error ? (
          <div className="mt-8 text-center">
            <p role="alert" className="text-sm text-rose-200/90">{error}</p>
            <button
              type="button"
              onClick={() => void load(sort)}
              className="mt-3 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Réessayer
            </button>
          </div>
        ) : data && data.scenes.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <i className="fa-solid fa-palette text-4xl text-white/30" aria-hidden />
            <h2 className="mt-3 text-lg font-black text-white">Aucune scène publiée</h2>
            <p className="mt-1 text-sm text-white/55">
              Sois le premier à décorer ton monde et à décrocher la 1ʳᵉ place&nbsp;!
            </p>
            <Link
              href="/community/studio"
              className="mt-5 inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110 active:scale-95"
            >
              Créer ma scène
            </Link>
          </div>
        ) : (
          data && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.scenes.map((s) => (
                <SceneCard
                  key={s.id}
                  scene={s}
                  onOpen={() => setDetail(s)}
                  onVote={() => void toggleVote(s)}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Détail d'une scène */}
      <AnimatePresence>
        {detail && (
          <SceneDetail
            scene={detail}
            onClose={() => setDetail(null)}
            onVote={() => void toggleVote(detail)}
            onToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-32 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-white/15 bg-black/85 px-5 py-2.5 text-sm font-semibold text-white shadow-2xl backdrop-blur-xl"
        >
          {toast}
        </div>
      )}

      <BottomNav active="community" />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Carte de la galerie
// ---------------------------------------------------------------------------

function SceneCard({
  scene,
  onOpen,
  onVote,
}: {
  scene: CommunitySceneView;
  onOpen: () => void;
  onVote: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg shadow-black/30 transition-colors hover:border-white/20">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
        aria-label={`Ouvrir la scène ${scene.title}`}
      >
        {scene.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={scene.thumbnail}
            alt={`Scène « ${scene.title} » de ${scene.author.display_name}`}
            className="block aspect-[16/10] w-full object-cover"
            loading="lazy"
          />
        ) : (
          <SceneCardCanvas data={scene.data} plush={scene.plush} />
        )}
      </button>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <button type="button" onClick={onOpen} className="min-w-0 text-left">
          <p className="truncate text-sm font-bold text-white/90">{scene.title}</p>
          <p className="truncate text-[11px] text-white/45">
            par {scene.author.display_name}
          </p>
        </button>
        <button
          type="button"
          onClick={onVote}
          aria-pressed={scene.my_vote}
          aria-label={scene.my_vote ? 'Retirer mon vote' : 'Voter pour cette scène'}
          className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-black transition-all active:scale-90 ${
            scene.my_vote
              ? 'border-fuchsia-300/50 bg-fuchsia-500/25 text-fuchsia-100'
              : 'border-white/10 bg-white/[0.05] text-white/60 hover:bg-white/15'
          }`}
        >
          <i className="fa-solid fa-arrow-up text-[10px]" aria-hidden />
          {scene.votes_total}
        </button>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Modale de détail : viewer 3D + vote + commentaires
// ---------------------------------------------------------------------------

function SceneDetail({
  scene,
  onClose,
  onVote,
  onToast,
}: {
  scene: CommunitySceneView;
  onClose: () => void;
  onVote: () => void;
  onToast: (msg: string) => void;
}) {
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiGet<{ comments: CommentItem[] }>(`/api/community/scenes/${scene.id}/comments`)
      .then((res) => {
        if (!cancelled) setComments(res.comments);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });
    return () => {
      cancelled = true;
    };
  }, [scene.id]);

  const send = useCallback(async () => {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      const res = await apiPost<{ comment: CommentItem }>(
        `/api/community/scenes/${scene.id}/comments`,
        { content },
      );
      setComments((c) => [...(c ?? []), res.comment]);
      setDraft('');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Commentaire impossible');
    } finally {
      setSending(false);
    }
  }, [draft, onToast, scene.id, sending]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Scène ${scene.title}`}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-[#14111c]/97 p-4 shadow-2xl sm:rounded-3xl sm:p-5"
      >
        {/* En-tête */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black tracking-tight text-white">
              {scene.title}
            </h2>
            <p className="text-xs text-white/45">par {scene.author.display_name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/15 hover:text-white"
          >
            <i className="fa-solid fa-xmark" aria-hidden />
          </button>
        </div>

        {/* Viewer 3D interactif */}
        <div className="mt-3">
          <SceneViewer3D data={scene.data} plush={scene.plush} height="38dvh" />
        </div>

        {/* Vote */}
        <button
          type="button"
          onClick={onVote}
          aria-pressed={scene.my_vote}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-black transition-all active:scale-[0.98] ${
            scene.my_vote
              ? 'border-fuchsia-300/50 bg-fuchsia-500/25 text-fuchsia-100'
              : 'border-white/10 bg-white/[0.05] text-white/75 hover:bg-white/12'
          }`}
        >
          <i className="fa-solid fa-arrow-up" aria-hidden />
          {scene.my_vote ? 'Voté !' : 'Voter pour cette scène'} · {scene.votes_total}
        </button>

        {/* Commentaires */}
        <h3 className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
          Commentaires
        </h3>
        <div className="mt-2 space-y-2">
          {comments === null ? (
            <p className="py-3 text-center text-xs text-white/35">Chargement…</p>
          ) : comments.length === 0 ? (
            <p className="py-3 text-center text-xs text-white/35">
              Aucun commentaire — lance la discussion&nbsp;!
            </p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2"
              >
                <p className="text-[11px] font-bold text-white/60">
                  {c.author?.display_name ?? 'Plushie'}
                  <span className="ml-2 font-normal text-white/30">
                    {new Date(c.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </p>
                <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-snug text-white/85">
                  {c.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Saisie */}
        <div className="sticky bottom-0 mt-3 bg-gradient-to-t from-[#14111c] via-[#14111c] pt-2">
          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, MAX_COMMENT))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void send();
              }}
              placeholder="Écris un commentaire…"
              maxLength={MAX_COMMENT}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-fuchsia-300/40 focus:outline-none"
              aria-label="Nouveau commentaire"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={sending || draft.trim().length === 0}
              aria-label="Envoyer le commentaire"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110 active:scale-90 disabled:opacity-40"
            >
              <i className="fa-solid fa-paper-plane text-sm" aria-hidden />
            </button>
          </div>
          {draft.length > MAX_COMMENT - 60 && (
            <p className="mt-1 text-right text-[10px] text-white/30">
              {draft.length}/{MAX_COMMENT}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Fin
// ---------------------------------------------------------------------------
