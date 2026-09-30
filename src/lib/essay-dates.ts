import fs from 'node:fs';
import path from 'node:path';

const ESSAY_DIR = path.join(process.cwd(), 'src/content/essays');

function frontmatterBlock(source: string): string {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? '';
}

function frontmatterDate(source: string, key: string): string | undefined {
  const block = frontmatterBlock(source);
  const match = block.match(new RegExp(`^${key}:\\s*(\\S+)`, 'm'));
  return match?.[1];
}

function walkMarkdown(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdown(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
  }

  return files;
}

/**
 * 建置時給 sitemap 用的 lastmod。astro.config 讀不到 content collection，
 * 所以直接從 Markdown frontmatter 取 updatedDate，沒有就退回 pubDate。
 */
export function essayLastmod(dir = ESSAY_DIR): Map<string, Date> {
  const dates = new Map<string, Date>();

  for (const file of walkMarkdown(dir)) {
    const source = fs.readFileSync(file, 'utf-8');
    const raw = frontmatterDate(source, 'updatedDate') ?? frontmatterDate(source, 'pubDate');
    if (!raw) continue;

    const date = new Date(raw);
    if (Number.isNaN(date.valueOf())) continue;

    const id = path.relative(dir, file).replace(/\\/g, '/').replace(/\.md$/, '');
    dates.set(`/essays/${id}/`, date);
  }

  return dates;
}
