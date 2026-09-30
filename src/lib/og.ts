import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { site } from '../config';

const require = createRequire(import.meta.url);

const FONT_DIR = path.join(
  path.dirname(require.resolve('@fontsource/noto-sans-tc/package.json')),
  'files',
);

type SatoriFont = { name: string; data: Buffer; weight: 400 | 700; style: 'normal' };

/**
 * Noto Sans TC 以 unicode 區段拆成上百個檔案，而 satori 只會在同名字型裡找一次字。
 * 因此每個區段給不同名字，再用 fontFamily 後備清單讓 satori 逐字往下找。
 */
async function loadFamily(weight: 400 | 700) {
  const files = (await fs.readdir(FONT_DIR))
    .filter((file) => file.endsWith(`-${weight}-normal.woff`))
    .sort((a, b) => subsetIndex(a) - subsetIndex(b));

  const fonts: SatoriFont[] = await Promise.all(
    files.map(async (file, index) => ({
      name: `NotoTC${weight}_${index}`,
      data: await fs.readFile(path.join(FONT_DIR, file)),
      weight,
      style: 'normal' as const,
    })),
  );

  return { fonts, family: fonts.map((font) => font.name).join(', ') };
}

function subsetIndex(file: string) {
  const match = file.match(/-(\d+)-\d+-normal\.woff$/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

export type OgImageOptions = {
  title: string;
  label: string;
  accent: string;
  mark?: string;
};

let fontsPromise: Promise<{ fonts: SatoriFont[]; family: string }> | undefined;

async function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = (async () => {
      const regular = await loadFamily(400);
      const bold = await loadFamily(700);
      return {
        fonts: [...regular.fonts, ...bold.fonts],
        family: `${bold.family}, ${regular.family}`,
      };
    })();
  }
  return fontsPromise;
}

export async function renderOgImage(options: OgImageOptions): Promise<Buffer> {
  const { fonts, family } = await loadFonts();
  const titleSize = options.title.length > 28 ? 52 : 64;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0f2744',
          color: '#f8fafc',
          padding: '68px',
          fontFamily: family,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                color: options.accent,
                fontSize: '28px',
                fontWeight: 700,
              },
              children: [
                ...(options.mark
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '68px',
                            height: '68px',
                            borderRadius: '18px',
                            background: options.accent,
                            color: '#0f2744',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '34px',
                            fontWeight: 700,
                          },
                          children: options.mark,
                        },
                      },
                    ]
                  : []),
                options.label,
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                lineHeight: 1.28,
                letterSpacing: '-0.03em',
              },
              children: options.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '28px',
                color: '#cbd5e1',
              },
              children: [
                { type: 'div', props: { children: site.name } },
                { type: 'div', props: { children: site.author } },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630, fonts },
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
