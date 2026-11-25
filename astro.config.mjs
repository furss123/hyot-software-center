import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// 사이트맵 lastmod용: 소개 페이지 주소 이름(page_slug, 없으면 폴더 이름) → 가장 최근 릴리스 날짜.
// draft 프로그램은 사이트에 나오지 않으므로 뺀다.
const softwareDir = new URL('./src/content/software/', import.meta.url)
const releaseDates = Object.fromEntries(
  readdirSync(softwareDir, { withFileTypes: true }).flatMap((entry) => {
    const file = new URL(`${entry.name}/index.md`, softwareDir)
    if (!entry.isDirectory() || !existsSync(file)) return []
    const frontmatter = readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? ''
    if (/^draft:\s*true\b/m.test(frontmatter)) return []
    const slug = frontmatter.match(/^page_slug:\s*['"]?([\w-]+)/m)?.[1] ?? entry.name
    const dates = [...frontmatter.matchAll(/^\s+date:\s*['"]?(\d{4}-\d{2}-\d{2})/gm)].map((m) => m[1]).sort()
    return dates.length ? [[slug, dates.at(-1)]] : []
  }),
)
const newestRelease = Object.values(releaseDates).sort().at(-1)

// 예전 주소 → 지금 주소. 소개 페이지 주소를 바꿀 때 여기에 남겨 북마크와 검색 결과가 깨지지 않게 한다.
const moved = {
  'today-meal': 'today-school',
  'today-class': 'today-school',
  'software/today-meal': 'software/today-school',
  'software/today-class': 'software/today-school',
  'software/hwp2pdf': 'software/moagyeol-pdf',
}
const redirects = Object.fromEntries(
  ['ko', 'en'].flatMap((locale) =>
    Object.entries(moved).map(([from, to]) => [`/${locale}/${from}`, `/${locale}/${to}/`]),
  ),
)

export default defineConfig({
  site: 'https://hyot.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects,
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
