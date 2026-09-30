import assert from 'node:assert/strict';
import test from 'node:test';
import {
  absoluteUrl,
  assertUniqueSlugs,
  ogImageForEssayId,
  ogImageForSite,
  ogImageForTopic,
  ogSlugForEssay,
  ogSlugForSite,
  ogSlugForTopic,
  publicPath,
  routePath,
} from './urls.ts';

test('essay OG slugs stay under essay/ so they cannot collide with site or topics', () => {
  const slugs = [
    ogSlugForSite,
    ogSlugForTopic('programming'),
    ogSlugForEssay('site'),
    ogSlugForEssay('notes/keep-scripts-near-the-mess'),
    ogSlugForEssay('topic-programming'),
  ];

  assert.deepEqual(slugs, [
    'site',
    'topic-programming',
    'essay/site',
    'essay/notes/keep-scripts-near-the-mess',
    'essay/topic-programming',
  ]);
  assertUniqueSlugs(slugs, 'OG image slug');
  assert.equal(ogImageForSite(), 'https://eddielincursor.github.io/ippage/og/site.png');
  assert.equal(ogImageForTopic('finance'), 'https://eddielincursor.github.io/ippage/og/topic-finance.png');
  assert.equal(
    ogImageForEssayId('notes/nested'),
    'https://eddielincursor.github.io/ippage/og/essay/notes/nested.png',
  );
});

test('public paths include the GitHub Pages base exactly once', () => {
  assert.equal(publicPath('/essays/site/'), '/ippage/essays/site/');
  assert.equal(absoluteUrl('/essays/site/'), 'https://eddielincursor.github.io/ippage/essays/site/');
  assert.equal(routePath('/ippage/essays/site/'), '/essays/site/');
});

test('assertUniqueSlugs throws when two images would share a filename', () => {
  assert.throws(
    () => assertUniqueSlugs(['site', 'site'], 'OG image slug'),
    /OG image slug collision: site/,
  );
});
