export const locales = ['ko', 'en'] as const
export type Locale = (typeof locales)[number]

export const ui = {
  ko: {
    'site.description': '일상에 필요한 무료 Windows·Android 유틸리티와 웹 도구',
    'nav.label': '주 메뉴',
    'nav.clockWeb': '시험용 시계',
    'home.titleFirst': '일상에 필요한',
    'home.titleSecond': '무료 유틸리티',
    'home.description': '한글 PDF 변환, 시간표·급식 확인, 시험용 시계, PC 최적화, 파일 검색까지. 설치해서 쓰는 도구와 웹에서 바로 쓰는 도구를 한곳에 모았습니다.',
    'home.browse': '유틸리티 둘러보기',
    'home.catalog': '모든 유틸리티',
    'home.launcher': '바로 가기',
    'home.tileUse': '바로 쓰기',
    'home.tileDownload': '다운로드',
    'home.noInstall': '설치 없이 사용',
    'home.suggestTitle': '필요한 도구가 있나요?',
    'home.suggestBody': '만들어 줬으면 하는 도구나 고쳤으면 하는 점을 알려 주세요.',
    'home.suggestMail': '메일 보내기',
    'home.suggestIssue': 'GitHub에 남기기',
    'nav.all': '유틸리티',
    'software.useWeb': '웹에서 바로 쓰기',
    'software.overview': '프로그램 소개',
    'software.screenshots': '사용 화면',
    'software.openScreenshot': '원본 크기로 보기',
    'nav.clock': '시험용 시계',
    'nav.school': '오늘 학교',
    'nav.pdf': '모아결 PDF',
    'nav.theme': '화면 밝기 바꾸기',
    'nav.lang': 'English',
    'clock.description': '한국 표준시를 초 단위로 보여주는 시험장용 전체 화면 시계',
    'clock.size': '크기',
    'clock.zone': '한국 표준시, UTC+9',
    'clock.smaller': '시계 크기 줄이기',
    'clock.larger': '시계 크기 키우기',
    'clock.fullscreen': '전체 화면',
    'clock.exitFullscreen': '전체 화면 닫기',
    'clock.requiresJs': '시계를 보려면 JavaScript를 켜 주세요.',
    'clock.syncing': '표준시 동기화 중',
    'clock.synced': 'NICT 표준시 동기화됨',
    'clock.deviceTime': '기기 시간 사용 중',
    'clock.lastSync': '마지막 표준시 동기화 기준',
    'empty.software.title': '아직 올라온 유틸리티가 없습니다',
    'software.all': '전체',
    'software.back': '모든 유틸리티',
    'software.download': '다운로드',
    'software.noDownload': '아직 내려받을 수 있는 파일이 없습니다.',
    'software.info': '정보',
    'software.version': '최신 버전',
    'software.updated': '업데이트',
    'software.platform': '지원 환경',
    'software.category': '분류',
    'software.requirements': '필요한 환경',
    'software.source': '소스 코드',
    'software.beta': '베타',
    'software.history': '업데이트 내역',
    'seo.home': '한글 PDF 변환, 학교 시간표·급식, 시험 시계 무료 도구',
    'seo.pdf': '한글(HWP) PDF 변환, PDF 합치기·용량 줄이기',
    'seo.school': '우리 반 시간표와 학교 급식 한 화면에',
    'seo.clock': '한국 표준시 초 단위 전체 화면 시계',
    'software.sha': 'SHA-256',
    'notfound.title': '페이지를 찾을 수 없습니다',
    'notfound.body': '주소가 바뀌었거나 삭제된 페이지입니다.',
    'notfound.cta': '처음 화면으로',
    'footer.label': '사이트 정보',
    'footer.privacy': '개인정보처리방침',
    'footer.contact': '문의',
    'privacy.description': 'hyot.dev와 웹 도구가 어떤 정보를 어디에서 처리하는지 설명합니다.',
    'privacy.effective': '시행일',
  },
  en: {
    'site.description': 'Free Windows and Android utilities and web tools for everyday tasks',
    'nav.label': 'Main menu',
    'nav.clockWeb': 'Exam clock',
    'home.titleFirst': 'Free tools',
    'home.titleSecond': 'for everyday use',
    'home.description': 'Hangul to PDF, school timetables and meals, an exam clock, PC optimization and file search. Desktop apps and browser tools, all in one place.',
    'home.browse': 'Explore utilities',
    'home.catalog': 'All utilities',
    'home.launcher': 'Quick launch',
    'home.tileUse': 'Open now',
    'home.tileDownload': 'Download',
    'home.noInstall': 'No install needed',
    'home.suggestTitle': 'Need another tool?',
    'home.suggestBody': 'Tell us which tool you would like next, or what should work better.',
    'home.suggestMail': 'Send email',
    'home.suggestIssue': 'Open a GitHub issue',
    'nav.all': 'Utilities',
    'software.useWeb': 'Use in your browser',
    'software.overview': 'About the app',
    'software.screenshots': 'Screenshots',
    'software.openScreenshot': 'View full size',
    'nav.clock': 'Exam clock',
    'nav.school': 'School Today',
    'nav.pdf': 'Moagyeol PDF',
    'nav.theme': 'Switch light or dark',
    'nav.lang': '한국어',
    'clock.description': 'A full-screen clock for exam rooms showing Korea Standard Time to the second',
    'clock.size': 'Size',
    'clock.zone': 'Korea Standard Time, UTC+9',
    'clock.smaller': 'Decrease clock size',
    'clock.larger': 'Increase clock size',
    'clock.fullscreen': 'Full screen',
    'clock.exitFullscreen': 'Exit full screen',
    'clock.requiresJs': 'Turn on JavaScript to see the clock.',
    'clock.syncing': 'Synchronizing standard time',
    'clock.synced': 'Synchronized with NICT',
    'clock.deviceTime': 'Using device time',
    'clock.lastSync': 'Using last standard time sync',
    'empty.software.title': 'No utilities yet',
    'software.all': 'All',
    'software.back': 'All utilities',
    'software.download': 'Download',
    'software.noDownload': 'No files to download yet.',
    'software.info': 'Details',
    'software.version': 'Latest version',
    'software.updated': 'Updated',
    'software.platform': 'Platforms',
    'software.category': 'Category',
    'software.requirements': 'Requirements',
    'software.source': 'Source code',
    'software.beta': 'Beta',
    'software.history': 'Release history',
    'seo.home': 'Free tools for HWP to PDF, school timetables and exam clocks',
    'seo.pdf': 'Convert HWP to PDF, merge and compress PDFs online',
    'seo.school': 'Class timetable and school meals in one view',
    'seo.clock': 'Full-screen Korea Standard Time clock',
    'software.sha': 'SHA-256',
    'notfound.title': 'Page not found',
    'notfound.body': 'The address changed or the page was removed.',
    'notfound.cta': 'Go to the home page',
    'footer.label': 'Site information',
    'footer.privacy': 'Privacy policy',
    'footer.contact': 'Contact',
    'privacy.description': 'What information hyot.dev and its web tools handle, and where.',
    'privacy.effective': 'Effective',
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
