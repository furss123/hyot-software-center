import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://hyot.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects: {
    '/ko/today-meal': '/ko/today-school/',
    '/en/today-meal': '/en/today-school/',
    '/ko/today-class': '/ko/today-school/',
    '/en/today-class': '/en/today-school/',
    '/ko/software/today-class': '/ko/software/today-meal/',
    '/en/software/today-class': '/en/software/today-meal/',
  },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') && !/\/(ko|en)\/software\/$/.test(page) })],
})
