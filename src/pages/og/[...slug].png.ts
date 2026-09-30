import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site, topics, getTopic } from '../../config';
import { renderOgImage, type OgImageOptions } from '../../lib/og';
import {
  assertUniqueSlugs,
  ogSlugForEssay,
  ogSlugForSite,
  ogSlugForTopic,
} from '../../lib/urls';

export async function getStaticPaths() {
  const essays = await getCollection('essays');

  const paths = [
    {
      params: { slug: ogSlugForSite },
      props: { title: site.tagline, label: '個人知識站', accent: '#f59e0b' } satisfies OgImageOptions,
    },
    ...topics.map((topic) => ({
      params: { slug: ogSlugForTopic(topic.slug) },
      props: {
        title: topic.name,
        label: '主題索引',
        accent: topic.color,
        mark: topic.mark,
      } satisfies OgImageOptions,
    })),
    ...essays.map((essay) => {
      const topic = getTopic(essay.data.topics[0]);
      return {
        params: { slug: ogSlugForEssay(essay.id) },
        props: {
          title: essay.data.title,
          label: topic?.name ?? site.name,
          accent: topic?.color ?? '#1d4ed8',
          mark: topic?.mark,
        } satisfies OgImageOptions,
      };
    }),
  ];

  assertUniqueSlugs(
    paths.map((entry) => entry.params.slug),
    'OG image slug',
  );

  return paths;
}

export async function GET(context: APIContext) {
  const png = await renderOgImage(context.props as OgImageOptions);

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
