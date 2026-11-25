import { path, t, categories, platformNames, type Locale } from './i18n'
import { getSoftware, displayName, tagline, latestAny, pageSlug, type Release, type Software } from './software'

// 홈 화면의 카드와 첫 화면 바로 가기가 함께 쓰는 도구 목록.
// 프로그램(src/content/software)에 웹에서만 쓰는 도구(시험용 시계)를 더해 한 줄로 세운다.
export type Tool = {
  key: string
  name: string
  tagline: string
  category: string
  platforms: string
  /** 카드를 누르면 여는 곳: 프로그램 소개. 웹 전용 도구는 도구 자체. */
  href: string
  /** 바로 가기를 누르면 여는 곳: 웹 버전이 있으면 웹 도구, 없으면 프로그램 소개. */
  launch: string
  /** 설치 없이 웹에서 바로 쓸 수 있는지 */
  web: boolean
  software?: Software
  /** software가 없을 때 쓰는 아이콘 주소 */
  icon?: string
  release?: Release
}

export async function getTools(locale: Locale): Promise<Tool[]> {
  const programs = (await getSoftware()).map((software): Tool => {
    const detail = path(locale, `software/${pageSlug(software)}`)
    return {
      key: software.id,
      name: displayName(software, locale),
      tagline: tagline(software, locale),
      category: categories[software.data.category][locale],
      platforms: software.data.platforms.map((platform) => platformNames[platform]).join(' · '),
      href: detail,
      launch: software.data.web ? path(locale, software.data.web) : detail,
      web: Boolean(software.data.web),
      software,
      release: latestAny(software),
    }
  })
  const clock: Tool = {
    key: 'clock',
    name: t(locale, 'nav.clock'),
    tagline: t(locale, 'clock.description'),
    category: categories.classroom[locale],
    platforms: platformNames.web,
    href: path(locale, 'clock'),
    launch: path(locale, 'clock'),
    web: true,
    icon: '/icons/clock.svg',
  }
  // 설치 없이 바로 쓸 수 있는 도구를 앞에 둔다. 휴대폰으로 들어온 사람도 맨 위에서 바로 쓸 수 있게.
  return [...programs.filter((tool) => tool.web), clock, ...programs.filter((tool) => !tool.web)]
}
