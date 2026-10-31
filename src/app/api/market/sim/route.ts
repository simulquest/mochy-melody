import { NextRequest } from 'next/server';
import { apiError, handleApiError } from '@/lib/market';
import {
  getSimStatus,
  startSim,
  stopSim,
  extendSim,
  wipeSim,
  runSimTick,
} from '@/lib/sim/market-sim';

// ---------------------------------------------------------------------------
// Administration du marché simulé — protégé par le secret header
// `x-sim-secret` (env MARKET_SIM_SECRET). Jamais utilisé par le client.
//
// GET  /api/market/sim             → état de la simulation
// POST /api/market/sim {action}    → start | stop | extend | wipe | tick
// ---------------------------------------------------------------------------

export const dynamic = 'force-dynamic';

function checkSecret(req: NextRequest): boolean {
  const secret = process.env.MARKET_SIM_SECRET;
  if (!secret) return false;
  return req.headers.get('x-sim-secret') === secret;
}

function unauthorized(): Response {
  return apiError('Secret marché simulé manquant ou invalide (MARKET_SIM_SECRET)', 401);
}

export async function GET(req: NextRequest) {
  try {
    if (!checkSecret(req)) return unauthorized();
    const status = await getSimStatus();
    return Response.json({ status });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!checkSecret(req)) return unauthorized();

    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      days?: number;
      backfillDays?: number;
    };

    switch (body.action) {
      case 'start': {
        const result = await startSim({
          days: body.days ? Number(body.days) : undefined,
          backfillDays: body.backfillDays !== undefined ? Number(body.backfillDays) : undefined,
        });
        return Response.json(result);
      }
      case 'stop':
        return Response.json(await stopSim());
      case 'extend':
        return Response.json(await extendSim());
      case 'wipe':
        return Response.json(await wipeSim());
      case 'tick': {
        const result = await runSimTick(true);
        return Response.json(result);
      }
      default:
        return apiError("action inconnue (start | stop | extend | wipe | tick)");
    }
  } catch (err) {
    return handleApiError(err);
  }
}
