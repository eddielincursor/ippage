import assert from 'node:assert/strict';
import test from 'node:test';
import { stringifyJsonLd } from './json-ld.ts';

test('stringifyJsonLd escapes </script> so JSON-LD cannot break out of the tag', () => {
  const json = stringifyJsonLd({
    headline: 'A </script><img src=x onerror=alert(1)> title',
  });
  const html = `<script type="application/ld+json">${json}</script>`;

  assert.equal(json.includes('<'), false);
  assert.match(json, /\\u003c\/script>/);
  assert.equal(html.includes('</script><img'), false);
  assert.equal((html.match(/<\/script>/g) ?? []).length, 1);
});
