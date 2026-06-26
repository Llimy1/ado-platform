import assert from 'node:assert/strict';
import test from 'node:test';
import { checkStateTransition, evaluateEvidenceGate, getReadinessSnapshot } from './index.js';

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

test('checkStateTransition allows a known Feature Unit transition', () => {
  const result = checkStateTransition({
    subjectType: 'feature_unit',
    from: 'draft',
    to: 'ready_for_human_review',
    transition: 'feature_unit_ready_for_human_review'
  });

  assert.equal(result.allowed, true);
});

test('checkStateTransition rejects an unknown Component Work jump', () => {
  const result = checkStateTransition({
    subjectType: 'component_work',
    from: 'draft',
    to: 'ready_for_pr',
    transition: 'component_work_ready_for_pr'
  });

  assert.equal(result.allowed, false);
  assert.match(result.reason, /cannot transition/);
});

test('evaluateEvidenceGate passes only valid evidence for the target', () => {
  const result = evaluateEvidenceGate({
    targetStateSubjectId: 'subject-1',
    requiredEvidenceTypes: ['component_work_spec', 'allowed_paths'],
    evidence: [
      {
        evidenceType: 'component_work_spec',
        targetStateSubjectId: 'subject-1',
        status: 'valid',
        producedBy: 'system'
      },
      {
        evidenceType: 'allowed_paths',
        targetStateSubjectId: 'subject-1',
        status: 'valid',
        producedBy: 'system'
      }
    ]
  });

  assert.equal(result.decision, 'passed');
});

test('evaluateEvidenceGate fails missing or stale evidence', () => {
  const result = evaluateEvidenceGate({
    targetStateSubjectId: 'subject-1',
    requiredEvidenceTypes: ['human_decision', 'verification_run'],
    evidence: [
      {
        evidenceType: 'human_decision',
        targetStateSubjectId: 'subject-1',
        status: 'stale',
        producedBy: 'human'
      }
    ]
  });

  assert.equal(result.decision, 'failed');
  assert.deepEqual(result.missingEvidenceTypes, ['verification_run']);
  assert.deepEqual(result.invalidEvidenceTypes, ['human_decision']);
});
