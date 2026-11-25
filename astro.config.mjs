import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// 사이트맵 lastmod용: 프로그램 폴더 이름 → 가장 최근 릴리스 날짜(YYYY-MM-DD).
// draft 프로그램은 사이트에 나오지 않으므로 뺀다.
const softwareDir = new URL('./src/content/software/', import.meta.url)
const releaseDates = Object.fromEntries(
  readdirSync(softwareDir, { withFileTypes: true }).flatMap((entry) => {
    const file = new URL(`${entry.name}/index.md`, softwareDir)
    if (!entry.isDirectory() || !existsSync(file)) return []
    const frontmatter = readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? ''
    if (/^draft:\s*true\b/m.test(frontmatter)) return []
    const dates = [...frontmatter.matchAll(/^\s+date:\s*['"]?(\d{4}-\d{2}-\d{2})/gm)].map((m) => m[1]).sort()
    return dates.length ? [[entry.name, dates.at(-1)]] : []
  }),
)
const newestRelease = Object.values(releaseDates).sort().at(-1)

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
  integrations: [
    sitemap({
      // `/`는 언어별 홈으로 보내는 리다이렉트 페이지라 사이트맵에서 뺀다.
      filter: (page) =>
        new URL(page).pathname !== '/' && !page.endsWith('/404/') && !/\/(ko|en)\/software\/$/.test(page),
      // /ko/…와 /en/… 짝을 hreflang으로 묶는다. (페이지 <head>의 hreflang 값과 같게)
      i18n: { defaultLocale: 'ko', locales: { ko: 'ko', en: 'en' } },
      // 언어별 홈은 가장 최근 릴리스 날짜, 프로그램 상세는 그 프로그램의 최근 릴리스 날짜.
      serialize(item) {
        const [, section, slug] = new URL(item.url).pathname.split('/').filter(Boolean)
        const date = !section ? newestRelease : section === 'software' ? releaseDates[slug] : undefined
        if (date) item.lastmod = date
        return item
      },
    }),
  ],
})
