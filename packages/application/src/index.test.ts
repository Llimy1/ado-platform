import assert from 'node:assert/strict';
import test from 'node:test';
import { getReadinessSnapshot } from './index.js';

test('getReadinessSnapshot returns ready when the database check succeeds', async () => {
  const snapshot = await getReadinessSnapshot({ check: async () => undefined });

  assert.equal(snapshot.state, 'ready');
  assert.match(snapshot.checkedAt, /^\d{4}-\d{2}-\d{2}T/);
});

test('getReadinessSnapshot returns unavailable when the database check fails', async () => {
  const snapshot = await getReadinessSnapshot({
    check: async () => {
      throw new Error('database unavailable');
    }
  });

  assert.equal(snapshot.state, 'unavailable');
});
