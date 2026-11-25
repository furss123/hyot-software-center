import type { APIRoute, GetStaticPaths } from 'astro'
import { getSoftware, sortedReleases, latestRelease, pageSlug, type Software } from '../../lib/software'

// 설치된 프로그램의 자동 업데이트 확인용 매니페스트: /updates/<slug>.json
// 이전 사이트와 같은 schemaVersion 1 형식으로 releases 정보에서 자동 생성된다.

export const getStaticPaths: GetStaticPaths = async () =>
  (await getSoftware()).map((software) => ({ params: { slug: software.id }, props: { software } }))

const asset = (a: Software['data']['releases'][number]['downloads'][number]) => ({
  type: a.type,
  filename: a.filename ?? a.url.split('/').pop(),
  url: a.url.startsWith('/') ? `https://hyot.dev${a.url}` : a.url,
  ...(typeof a.size === 'number' ? { size: a.size } : {}),
  ...(a.sha256 ? { sha256: a.sha256 } : {}),
  ...(a.arch ? { arch: a.arch } : {}),
})

export const GET: APIRoute = ({ props }) => {
  const s = props.software as Software
  const md = (lines: string[]) => lines.map((l) => `- ${l}`).join('\n')
  const body = {
    schemaVersion: 1,
    slug: s.id,
    name: { ko: s.data.name_ko ?? s.data.name, en: s.data.name },
    platforms: s.data.platforms,
    homepageUrl: `https://hyot.dev/ko/software/${pageSlug(s)}/`,
    latest: {
      stable: latestRelease(s, 'stable')?.version ?? null,
      beta: latestRelease(s, 'beta')?.version ?? null,
    },
    releases: sortedReleases(s).map((r) => {
      const assets = r.downloads.map(asset)
      return {
        version: r.version,
        channel: r.channel,
        releaseDate: r.date.toISOString().slice(0, 10),
        ...(r.tag ? { githubTag: r.tag } : {}),
        notes: { ko: md(r.notes), en: md(r.notes_en?.length ? r.notes_en : r.notes) },
        primaryAsset: assets.find((a) => a.type === 'installer') ?? assets[0] ?? null,
        assets,
      }
    }),
  }
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
