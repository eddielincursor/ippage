import { getCollection, type CollectionEntry } from 'astro:content';
import { getTopic, type Topic } from '../config';
import { formatDate } from './dates';
import {
  absoluteUrl,
  essayPath,
  ogImageForEssayId,
  ogImageForSite,
  ogImageForTopic,
  ogImageUrl,
} from './urls';

export type Essay = CollectionEntry<'essays'>;

export { formatDate, absoluteUrl, ogImageUrl, ogImageForSite, ogImageForTopic };

export async function getEssays(): Promise<Essay[]> {
  const essays = await getCollection('essays');
  return essays.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getEssaysByTopic(slug: string): Promise<Essay[]> {
  const essays = await getEssays();
  return essays.filter((essay) => essay.data.topics.includes(slug));
}

/** 同主題的其他文章，主題排序愈前面權重愈高。 */
export async function getRelatedEssays(essay: Essay, limit = 3): Promise<Essay[]> {
  const essays = await getEssays();
  const related = essays
    .filter((other) => other.id !== essay.id)
    .map((other) => ({
      essay: other,
      shared: other.data.topics.filter((slug) => essay.data.topics.includes(slug)).length,
    }))
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.shared - a.shared);

  return related.slice(0, limit).map((entry) => entry.essay);
}

/** 以發布時間相鄰的前後篇，給文章頁的上一篇／下一篇。 */
export async function getAdjacentEssays(essay: Essay) {
  const essays = await getEssays();
  const index = essays.findIndex((other) => other.id === essay.id);

  return {
    newer: index > 0 ? essays[index - 1] : undefined,
    older: index >= 0 && index < essays.length - 1 ? essays[index + 1] : undefined,
  };
}

export function essayTopics(essay: Essay): Topic[] {
  return essay.data.topics.map((slug) => {
    const topic = getTopic(slug);
    if (!topic) {
      throw new Error(`Unknown topic "${slug}" in ${essay.id}`);
    }
    return topic;
  });
}

export function essayUrl(essay: Essay): string {
  return essayPath(essay.id);
}

export function ogImageForEssay(essay: Essay): string {
  return ogImageForEssayId(essay.id);
}

/** 中文以字數估算，英數以詞數估算。 */
export function readingMinutes(essay: Essay): number {
  const body = essay.body ?? '';
  const cjk = (body.match(/[\u3400-\u9fff]/g) ?? []).length;
  const words = (body.match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 350 + words / 220));
}
