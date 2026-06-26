import type { ReadinessSnapshot } from '@ado/domain';
export interface DatabaseHealthPort { check(): Promise<void>; }
export async function getReadinessSnapshot(database: DatabaseHealthPort): Promise<ReadinessSnapshot> {
  try { await database.check(); return { state: 'ready', checkedAt: new Date().toISOString() }; }
  catch { return { state: 'unavailable', checkedAt: new Date().toISOString() }; }
}
