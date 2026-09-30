import assert from 'node:assert/strict';
import test from 'node:test';
import { formatDate } from './dates.ts';

test('formatDate keeps the YAML calendar day even if the machine is UTC-8', () => {
  const previous = process.env.TZ;
  process.env.TZ = 'America/Los_Angeles';

  try {
    assert.equal(formatDate(new Date('2026-01-15T00:00:00.000Z')), '2026/1/15');
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});
