import type { APIContext } from 'astro';
import { siteUrl } from '../config';

export function GET(_context: APIContext) {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
