import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { topics } from './config';

const topicSlugs = topics.map((topic) => topic.slug) as [string, ...string[]];

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    topics: z.array(z.enum(topicSlugs)).min(1),
  }),
});

export const collections = { essays };
