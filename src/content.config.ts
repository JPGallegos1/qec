import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const story = z.object({
  category: z.enum(['startup', 'indie', 'video', 'podcast', 'radar']),
  title: z.string(),
  summary: z.string(),
  sourceUrl: z.url().optional(),
  sponsored: z.boolean().default(false),
});

const issues = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/issues' }),
  schema: z.object({
    title: z.string(),
    issueNumber: z.number().int().nonnegative(),
    publishedAt: z.coerce.date(),
    dateLabel: z.string(),
    description: z.string(),
    readingMinutes: z.number().int().positive(),
    demo: z.boolean().default(false),
    draft: z.boolean().default(false),
    stories: z.array(story).max(12),
  }),
});

export const collections = { issues };
