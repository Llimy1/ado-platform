import assert from 'node:assert/strict';
import test from 'node:test';
import { loadEnvironment } from './index.js';

test('loadEnvironment applies local development defaults', () => {
  const environment = loadEnvironment({
    ADO_DATABASE_URL: 'postgres://ado:ado@localhost:5432/ado_platform'
  });

  assert.equal(environment.ADO_API_PORT, 3001);
  assert.equal(environment.ADO_CONTROL_ORIGIN, 'http://localhost:3000');
  assert.equal(environment.ADO_API_ENV, 'development');
});

test('loadEnvironment rejects an invalid database URL', () => {
  assert.throws(() => loadEnvironment({ ADO_DATABASE_URL: 'not-a-url' }));
});
