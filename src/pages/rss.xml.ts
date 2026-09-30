import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site, siteOrigin } from '../config';
import { essayUrl, getEssays } from '../lib/essays';

export async function GET(context: APIContext) {
  const essays = await getEssays();

  return rss({
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    site: context.site ?? siteOrigin,
    items: essays.map((essay) => ({
      title: essay.data.title,
      description: essay.data.description,
      pubDate: essay.data.pubDate,
      link: essayUrl(essay),
    })),
    customData: `<language>zh-Hant</language>`,
  });
}
