import { basePath, siteOrigin } from '../config';

/** 站內連結。GitHub Pages 專案站會加上 /ippage。 */
export function publicPath(pathname: string): string {
  const base = basePath.replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (path === '/') return `${base}/`;
  return `${base}${path}`;
}

/** 把含 base 的 pathname 還原成 sitemap 用的站內路徑。 */
export function routePath(pathname: string): string {
  const base = basePath.replace(/\/$/, '');
  let path = pathname;
  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length) || '/';
  }
  if (!path.startsWith('/')) path = `/${path}`;
  if (!path.endsWith('/')) path = `${path}/`;
  return path;
}

export function absoluteUrl(pathname: string): string {
  return new URL(publicPath(pathname), `${siteOrigin}/`).href;
}

export function essayPath(id: string): string {
  return publicPath(`/essays/${id}/`);
}

export const ogSlugForSite = 'site';

export function ogSlugForTopic(slug: string): string {
  return `topic-${slug}`;
}

/** 文章分享圖走 `essay/` 前綴，避免與 `site`、`topic-*` 撞名，也支援子資料夾。 */
export function ogSlugForEssay(id: string): string {
  return `essay/${id}`;
}

export function ogImageUrl(slug: string): string {
  return absoluteUrl(`/og/${slug}.png`);
}

export function ogImageForSite(): string {
  return ogImageUrl(ogSlugForSite);
}

export function ogImageForTopic(slug: string): string {
  return ogImageUrl(ogSlugForTopic(slug));
}

export function ogImageForEssayId(id: string): string {
  return ogImageUrl(ogSlugForEssay(id));
}

export function assertUniqueSlugs(slugs: string[], label: string): void {
  const seen = new Set<string>();

  for (const slug of slugs) {
    if (seen.has(slug)) {
      throw new Error(`${label} collision: ${slug}`);
    }
    seen.add(slug);
  }
}
