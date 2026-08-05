// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://qec.jpgallegos20.workers.dev',
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare({
    imageService: 'compile'
  }),

  integrations: [sitemap()]
});
