'use client';

import { useEffect, useState } from 'react';
import type { HealthResponse } from '@ado/contracts';

type HealthView = { kind: 'loading' } | { kind: 'ready'; value: HealthResponse } | { kind: 'unavailable'; message: string };
const apiOrigin = process.env.NEXT_PUBLIC_ADO_API_ORIGIN ?? 'http://localhost:3001';

export function HealthPanel() {
  const [view, setView] = useState<HealthView>({ kind: 'loading' });
  async function refresh(): Promise<void> {
    setView({ kind: 'loading' });
    try {
      const response = await fetch(`${apiOrigin}/v1/health`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Health endpoint returned ${response.status}`);
      setView({ kind: 'ready', value: await response.json() as HealthResponse });
    } catch (error) { setView({ kind: 'unavailable', message: error instanceof Error ? error.message : 'Unknown health error' }); }
  }
  useEffect(() => { void refresh(); }, []);
  if (view.kind === 'loading') return <p aria-live="polite">API health is loading.</p>;
  if (view.kind === 'unavailable') return <div><p role="alert">API is unavailable: {view.message}</p><button onClick={() => void refresh()}>Retry health check</button></div>;
  return <div><p className={view.value.status === 'ready' ? 'ready' : 'unavailable'}>API status: {view.value.status}</p><p>Checked at: {view.value.checkedAt}</p><button onClick={() => void refresh()}>Refresh</button></div>;
}
