import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { essayLastmod } from './essay-dates.ts';

test('essayLastmod reads nested folders and ignores dates in the body', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'essay-dates-'));

  try {
    fs.mkdirSync(path.join(dir, 'notes'));
    fs.writeFileSync(
      path.join(dir, 'notes', 'nested.md'),
      `---
title: Nested
pubDate: 2026-02-01
updatedDate: 2026-08-20
---

The body mentions pubDate: 1999-01-01 and should not win.
`,
    );
    fs.writeFileSync(
      path.join(dir, 'only-pub.md'),
      `---
title: Pub only
pubDate: 2026-03-03
---

Hello.
`,
    );

    const dates = essayLastmod(dir);

    assert.equal(dates.get('/essays/notes/nested/')?.toISOString().slice(0, 10), '2026-08-20');
    assert.equal(dates.get('/essays/only-pub/')?.toISOString().slice(0, 10), '2026-03-03');
    assert.equal(dates.size, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
