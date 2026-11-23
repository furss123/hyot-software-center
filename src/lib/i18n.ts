export const locales = ['ko', 'en'] as const
export type Locale = (typeof locales)[number]

export const ui = {
  ko: {
    'site.description': 'HyoT 유틸리티',
    'nav.clock': '시계',
    'nav.theme': '화면 밝기 바꾸기',
    'nav.lang': 'English',
    'clock.description': '한국 표준시를 초 단위로 보여주는 시험장용 전체 화면 시계',
    'clock.size': '크기',
    'clock.smaller': '시계 크기 줄이기',
    'clock.larger': '시계 크기 키우기',
    'clock.light': '라이트 모드',
    'clock.dark': '다크 모드',
    'clock.fullscreen': '전체 화면',
    'clock.exitFullscreen': '전체 화면 닫기',
    'clock.requiresJs': '시계를 보려면 JavaScript를 켜 주세요.',
    'empty.software.title': '아직 올라온 유틸리티가 없습니다',
    'software.all': '전체',
    'software.back': '모든 유틸리티',
    'software.download': '내려받기',
    'software.downloadFor': '용 내려받기',
    'software.noDownload': '아직 내려받을 수 있는 파일이 없습니다.',
    'software.otherFiles': '다른 파일',
    'software.info': '정보',
    'software.version': '최신 버전',
    'software.updated': '업데이트',
    'software.platform': '지원 환경',
    'software.category': '분류',
    'software.requirements': '필요한 환경',
    'software.source': '소스 코드',
    'software.history': '변경 내역',
    'software.beta': '베타',
    'software.sha': 'SHA-256',
    'notfound.title': '페이지를 찾을 수 없습니다',
    'notfound.body': '주소가 바뀌었거나 삭제된 페이지입니다.',
    'notfound.cta': '처음 화면으로',
  },
  en: {
    'site.description': 'HyoT utilities',
    'nav.clock': 'Clock',
    'nav.theme': 'Switch light or dark',
    'nav.lang': '한국어',
    'clock.description': 'A full-screen clock for exam rooms showing Korea Standard Time to the second',
    'clock.size': 'Size',
    'clock.smaller': 'Decrease clock size',
    'clock.larger': 'Increase clock size',
    'clock.light': 'Light mode',
    'clock.dark': 'Dark mode',
    'clock.fullscreen': 'Full screen',
    'clock.exitFullscreen': 'Exit full screen',
    'clock.requiresJs': 'Turn on JavaScript to see the clock.',
    'empty.software.title': 'No utilities yet',
    'software.all': 'All',
    'software.back': 'All utilities',
    'software.download': 'Download',
    'software.downloadFor': 'Download for ',
    'software.noDownload': 'No files to download yet.',
    'software.otherFiles': 'Other files',
    'software.info': 'Details',
    'software.version': 'Latest version',
    'software.updated': 'Updated',
    'software.platform': 'Platforms',
    'software.category': 'Category',
    'software.requirements': 'Requirements',
    'software.source': 'Source code',
    'software.history': 'Changelog',
    'software.beta': 'Beta',
    'software.sha': 'SHA-256',
    'notfound.title': 'Page not found',
    'notfound.body': 'The address changed or the page was removed.',
    'notfound.cta': 'Go to the home page',
  },
} as const

export type UiKey = keyof (typeof ui)['ko']

export const t = (locale: Locale, key: UiKey): string => ui[locale][key] ?? ui.ko[key]

export const categories = {
  classroom: { ko: '교실', en: 'Classroom' },
  system: { ko: '시스템', en: 'System' },
  media: { ko: '미디어', en: 'Media' },
  document: { ko: '문서', en: 'Documents' },
  image: { ko: '이미지', en: 'Images' },
  etc: { ko: '기타', en: 'Other' },
} as const

export const platformNames = {
  windows: 'Windows',
  android: 'Android',
  web: 'Web',
} as const

export const assetNames = {
  installer: { ko: '설치 파일', en: 'Installer' },
  portable: { ko: '포터블(압축)', en: 'Portable (zip)' },
  msi: { ko: 'MSI 설치 파일', en: 'MSI installer' },
  apk: { ko: 'APK', en: 'APK' },
  store: { ko: '스토어', en: 'Store' },
  other: { ko: '파일', en: 'File' },
} as const

/** `/ko/software/` 형태의 경로를 만든다 */
export const path = (locale: Locale, p = ''): string => {
  const clean = p.replace(/^\/+|\/+$/g, '')
  return clean ? `/${locale}/${clean}/` : `/${locale}/`
}

export const otherLocale = (locale: Locale): Locale => (locale === 'ko' ? 'en' : 'ko')

export const formatDate = (d: Date, locale: Locale): string => {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return locale === 'ko' ? `${y}.${m}.${day}` : `${y}-${m}-${day}`
}

export const formatSize = (size?: number | string): string | undefined => {
  if (size === undefined) return undefined
  if (typeof size === 'string') return size
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
  return `${Math.max(1, Math.round(size / 1024))} KB`
}

export const localeStaticPaths = () => locales.map((locale) => ({ params: { locale } }))
