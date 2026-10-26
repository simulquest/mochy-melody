'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  apiGet,
  type MeResponse,
  type ListingView,
  type CardStats,
} from '@/lib/market-client';

/** Charge les données du tableau de bord (solde, inventaire, ventes, enchères). */
export function useMe() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    apiGet<MeResponse>('/api/market/me')
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Erreur');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

/** Charge la liste des enchères (active/sold/…), avec polling optionnel. */
export function useListings(
  params: {
    status?: string;
    sort?: string;
    cardId?: string;
    rarity?: string;
    mine?: boolean;
    pollMs?: number;
  } = {},
) {
  const [listings, setListings] = useState<ListingView[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const { status = 'active', sort = 'ending_soon', cardId, rarity, mine, pollMs = 0 } = params;

  const load = useCallback(() => {
    const sp = new URLSearchParams({ status, sort });
    if (cardId) sp.set('cardId', cardId);
    if (rarity) sp.set('rarity', rarity);
    if (mine) sp.set('mine', 'true');
    apiGet<{ listings: ListingView[]; total: number }>(`/api/market/listings?${sp.toString()}`)
      .then((res) => {
        setListings(res.listings);
        setTotal(res.total);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Erreur');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [status, sort, cardId, rarity, mine]);

  useEffect(() => {
    load();
  }, [load]);

  // Polling pour garder les prix/temps restants à jour.
  useEffect(() => {
    if (!pollMs) return;
    timer.current = setInterval(load, pollMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [load, pollMs]);

  return { listings, total, loading, error, reload: load };
}

/** Charge les stats de cours de toutes les cartes. */
export function useCards() {
  const [cards, setCards] = useState<CardStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    apiGet<{ cards: CardStats[] }>('/api/market/cards')
      .then((res) => {
        setCards(res.cards);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Erreur');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { cards, loading, error, reload: load };
}
