import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { basePath, siteOrigin } from './src/config';
import { essayLastmod } from './src/lib/essay-dates';
import { routePath } from './src/lib/urls';

const lastmod = essayLastmod();

/**
 * 字型刻意不自架也不外連：中文字型動輒數 MB，Google Fonts 的 Noto Sans TC 會拆成上百個
 * unicode-range 子集，自架會讓每頁多出約 300KB CSS。改用系統黑體，讀者不需下載任何字型。
 * 社群分享圖仍用 @fontsource/noto-sans-tc，但那只在建置時跑。
 */
export default defineConfig({
  site: siteOrigin,
  base: basePath,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      serialize(item) {
        const date = lastmod.get(routePath(new URL(item.url).pathname));
        return date ? { ...item, lastmod: date.toISOString() } : item;
      },
    }),
  ],
});
