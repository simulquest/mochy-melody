'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import SceneViewer3D from './SceneViewer3D';
import SceneCardCanvas from './SceneCardCanvas';
import BottomNav from '@/components/plush/BottomNav';
import LoadingScreen from '@/components/LoadingScreen';
import { apiGet, apiPost } from '@/lib/market-client';
import type { CommunityListResponse, CommunitySceneView } from '@/lib/community/scenes';
import { MAX_COMMENT } from '@/lib/community/scenes';

// ---------------------------------------------------------------------------
// CommunityGallery — galerie des scènes publiées : classement de la semaine
// (votes), détail avec viewer 3D + commentaires. Une modale éphémère annonce
// les récompenses au démarrage puis disparaît (place maximale à la galerie).
// ---------------------------------------------------------------------------

interface CommentItem {
  id: string;
  content: string;
  created_at: string;
  author: { user_id: string; display_name: string; avatar_url: string | null } | null;
}

type ListResponse = CommunityListResponse & { needs_setup?: boolean };

/** Durée d'affichage de la modale récompenses au démarrage (ms). */
const REWARDS_MODAL_MS = 10000;
/** Intervalle de décompte de la modale (ms). */
const REWARDS_TICK_MS = 100;

export default function CommunityGallery() {
  const [sort, setSort] = useState<'top' | 'new'>('top');
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<CommunitySceneView | null>(null);
  const [confirmDel, setConfirmDel] = useState<CommunitySceneView | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // Modale récompenses : visible au démarrage de la section, puis disparaît.
  // Maintenir le doigt appuyé sur la modale met le décompte en pause ;
  // le relâchement le relance. La croix ferme immédiatement.
  const [showRewards, setShowRewards] = useState(true);
  const [rewardsPaused, setRewardsPaused] = useState(false);
  const [rewardsLeft, setRewardsLeft] = useState(REWARDS_MODAL_MS);

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

  // Décompte de la modale récompenses (en pause tant que le doigt est posé)
  useEffect(() => {
    if (!showRewards || rewardsPaused) return;
    const id = window.setInterval(() => {
      setRewardsLeft((left) => Math.max(0, left - REWARDS_TICK_MS));
    }, REWARDS_TICK_MS);
    return () => clearInterval(id);
  }, [showRewards, rewardsPaused]);

  useEffect(() => {
    if (showRewards && rewardsLeft === 0) setShowRewards(false);
  }, [showRewards, rewardsLeft]);

  /** Supprime sa propre scène (définitif : votes + commentaires perdus). */
  const doDelete = useCallback(async () => {
    if (!confirmDel || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/community/scene', { method: 'DELETE', cache: 'no-store' });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || 'Suppression impossible');
      setDetail(null);
      setConfirmDel(null);
      showToast('Scène supprimée');
      void load(sort);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Suppression impossible');
    } finally {
      setDeleting(false);
    }
  }, [confirmDel, deleting, load, showToast, sort]);

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
        {/* En-tête compact — aucun texte, place maximale à la galerie */}
        <header className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight text-white">
            <i className="fa-solid fa-earth-americas mr-2 text-fuchsia-300" aria-hidden />
            Communauté
          </h1>
          <Link
            href="/community/studio"
            className="shrink-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110 active:scale-95"
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-1.5" aria-hidden />
            Mon studio
          </Link>
        </header>

        {/* Tri */}
        <div className="mt-3 flex gap-1.5">
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
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.scenes.map((s) => (
                <SceneCard
                  key={s.id}
                  scene={s}
                  onOpen={() => setDetail(s)}
                  onVote={() => void toggleVote(s)}
                  onAskDelete={setConfirmDel}
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
            onAskDelete={setConfirmDel}
            onToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Confirmation de suppression de sa propre scène */}
      <AnimatePresence>
        {confirmDel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              if (!deleting) setConfirmDel(null);
            }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Supprimer ta scène"
          >
            <motion.div
              initial={{ scale: 0.9, y: 18, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs rounded-3xl border border-white/12 bg-[#17121f] p-5 shadow-2xl shadow-black/60"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-500/15">
                  <i className="fa-solid fa-trash text-lg text-rose-200" aria-hidden />
                </span>
                <p className="min-w-0 text-sm font-black text-white">
                  Supprimer « {confirmDel.title} » ?
                </p>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-white/55">
                Ta scène sort de la galerie avec ses votes et ses commentaires.
                Action définitive — tu pourras en recréer une au studio.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDel(null)}
                  disabled={deleting}
                  className="flex-1 rounded-full border border-white/15 bg-white/[0.06] py-2.5 text-sm font-bold text-white/75 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => void doDelete()}
                  disabled={deleting}
                  className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-red-500 py-2.5 text-sm font-black text-white shadow-lg shadow-rose-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-xs" aria-hidden />
                      Suppression…
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-trash text-xs" aria-hidden />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
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

      {/* Modale récompenses — au démarrage, disparaît automatiquement */}
      <AnimatePresence>
        {showRewards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowRewards(false)}
            className="fixed inset-0 z-[160] flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Récompenses hebdomadaires"
          >
            <motion.div
              initial={{ scale: 0.85, y: 18, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={() => setRewardsPaused(true)}
              onPointerUp={() => setRewardsPaused(false)}
              onPointerLeave={() => setRewardsPaused(false)}
              onPointerCancel={() => setRewardsPaused(false)}
              className="relative w-full max-w-xs select-none overflow-hidden rounded-3xl border border-amber-300/25 bg-[#1a1424]/95 px-6 pb-7 pt-6 text-center shadow-2xl shadow-black/60"
            >
              {/* Croix : ferme la modale et skippe le décompte */}
              <button
                type="button"
                onClick={() => setShowRewards(false)}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label="Fermer"
                className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.07] text-white/50 transition-all hover:bg-white/15 hover:text-white active:scale-90"
              >
                <i className="fa-solid fa-xmark text-xs" aria-hidden />
              </button>
              <i className="fa-solid fa-trophy text-3xl text-amber-300" aria-hidden />
              <p className="mt-3 text-lg font-black leading-tight text-white">
                Les 3 premiers gagnent des MochyCoins
              </p>
              <p className="mt-2 text-sm font-black text-amber-200/90">
                1ᵉʳ : 500 · 2ᵉ : 300 · 3ᵉ : 200
              </p>
              <p className="mt-1.5 text-[11px] font-semibold text-white/45">
                Top 10 : 100 MochyCoins chaque semaine
              </p>
              {/* Barre de progression : suit le décompte réel (figée en pause) */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: rewardsLeft / REWARDS_MODAL_MS }}
                transition={{ duration: REWARDS_TICK_MS / 1000, ease: 'linear' }}
                className="absolute inset-x-0 bottom-0 h-1 origin-left bg-gradient-to-r from-amber-300 via-fuchsia-400 to-fuchsia-500"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
  onAskDelete,
}: {
  scene: CommunitySceneView;
  onOpen: () => void;
  onVote: () => void;
  onAskDelete: (scene: CommunitySceneView) => void;
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
      {/* Gestion de sa propre scène : modifier au studio / supprimer */}
      {scene.mine && (
        <div className="flex items-center justify-between border-t border-white/[0.05] px-3 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
            Ta scène
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="/community/studio"
              aria-label="Modifier ta scène au studio"
              title="Modifier au studio"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/60 transition-all hover:bg-white/15 hover:text-white active:scale-90"
            >
              <i className="fa-solid fa-pen text-[10px]" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => onAskDelete(scene)}
              aria-label="Supprimer ta scène"
              title="Supprimer"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-rose-300/20 bg-rose-500/10 text-rose-300/90 transition-all hover:bg-rose-500/25 active:scale-90"
            >
              <i className="fa-solid fa-trash text-[10px]" aria-hidden />
            </button>
          </div>
        </div>
      )}
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
  onAskDelete,
  onToast,
}: {
  scene: CommunitySceneView;
  onClose: () => void;
  onVote: () => void;
  onAskDelete: (scene: CommunitySceneView) => void;
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

        {/* Gestion de sa propre scène */}
        {scene.mine && (
          <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <span className="text-[11px] font-semibold text-white/45">C’est ta scène</span>
            <div className="flex items-center gap-1.5">
              <Link
                href="/community/studio"
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-white/70 transition-all hover:bg-white/10 active:scale-95"
              >
                <i className="fa-solid fa-pen text-[10px]" aria-hidden />
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onAskDelete(scene)}
                className="flex items-center gap-1.5 rounded-full border border-rose-300/25 bg-rose-500/15 px-3 py-1.5 text-xs font-bold text-rose-200 transition-all hover:bg-rose-500/25 active:scale-95"
              >
                <i className="fa-solid fa-trash text-[10px]" aria-hidden />
                Supprimer
              </button>
            </div>
          </div>
        )}

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
