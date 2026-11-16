export const locales = ['ko', 'en'] as const
export type Locale = (typeof locales)[number]

export const ui = {
  ko: {
    'site.description': '교실 PC와 내 PC를 위해 만든 Windows·Android 프로그램을 무료로 받으세요.',
    'nav.software': '프로그램',
    'nav.changelog': '변경 내역',
    'nav.feedback': '제보·건의',
    'nav.theme': '화면 밝기 바꾸기',
    'nav.lang': 'English',
    'home.title': '필요해서 만든 프로그램을 무료로 나눕니다',
    'home.lead': '수업하는 교실 PC와 매일 쓰는 내 PC를 위해 직접 만든 도구들입니다. 회원가입 없이 바로 받아 쓰세요.',
    'home.programs': '프로그램',
    'home.updates': '최근 업데이트',
    'home.allUpdates': '전체 변경 내역 보기',
    'empty.software.title': '첫 프로그램을 준비하고 있습니다',
    'empty.software.body': '곧 이곳에 올라옵니다. 필요한 프로그램이 있다면 먼저 알려 주세요.',
    'empty.software.cta': '필요한 프로그램 건의하기',
    'empty.updates': '아직 기록된 업데이트가 없습니다.',
    'software.title': '프로그램',
    'software.lead': '모든 프로그램은 무료이며, 설치 파일은 GitHub 릴리스나 이 사이트에서 바로 받습니다.',
    'software.all': '전체',
    'software.back': '모든 프로그램',
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
    'software.report': '이 프로그램 문제 제보하기',
    'software.beta': '베타',
    'software.sha': 'SHA-256',
    'changelog.title': '변경 내역',
    'changelog.lead': '모든 프로그램의 새 버전과 고친 점을 날짜순으로 모았습니다.',
    'feedback.title': '제보·건의',
    'feedback.lead': '오류를 발견했거나 있었으면 하는 기능이 있다면 남겨 주세요. 모든 글을 직접 읽습니다.',
    'feedback.type': '종류',
    'feedback.type.bug': '오류 제보',
    'feedback.type.feature': '기능 건의',
    'feedback.type.other': '기타',
    'feedback.software': '프로그램',
    'feedback.software.none': '특정 프로그램 아님',
    'feedback.subject': '제목',
    'feedback.subject.ph': '한 줄로 요약해 주세요',
    'feedback.content': '내용',
    'feedback.content.ph': '어떤 상황에서 무엇이 일어났는지, 쓰고 있는 Windows 버전도 함께 적어 주시면 빨리 고칠 수 있습니다.',
    'feedback.contact': '답장 받을 연락처 (선택)',
    'feedback.contact.ph': '이메일 등',
    'feedback.submit': '보내기',
    'feedback.sending': '보내는 중',
    'feedback.sent': '보냈습니다. 확인하고 반영하겠습니다.',
    'feedback.error': '보내지 못했습니다. 인터넷 연결을 확인하고 다시 보내 주세요.',
    'feedback.required': '제목과 내용을 입력해 주세요.',
    'feedback.again': '하나 더 보내기',
    'notfound.title': '페이지를 찾을 수 없습니다',
    'notfound.body': '주소가 바뀌었거나 삭제된 페이지입니다.',
    'notfound.cta': '처음 화면으로',
    'footer.rights': 'HyoT. 모든 프로그램은 무료입니다.',
  },
  en: {
    'site.description': 'Free Windows and Android utilities made for classroom PCs and your own.',
    'nav.software': 'Software',
    'nav.changelog': 'Changelog',
    'nav.feedback': 'Feedback',
    'nav.theme': 'Switch light or dark',
    'nav.lang': '한국어',
    'home.title': 'Small tools, made because they were needed',
    'home.lead': 'Utilities built for classroom PCs and everyday desktops. Download them free, no sign-up.',
    'home.programs': 'Software',
    'home.updates': 'Recent updates',
    'home.allUpdates': 'See the full changelog',
    'empty.software.title': 'The first program is on its way',
    'empty.software.body': 'It will appear here soon. Tell us what you need in the meantime.',
    'empty.software.cta': 'Suggest a program',
    'empty.updates': 'No updates recorded yet.',
    'software.title': 'Software',
    'software.lead': 'Every program is free. Installers come straight from GitHub Releases or this site.',
    'software.all': 'All',
    'software.back': 'All software',
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
    'software.report': 'Report a problem with this program',
    'software.beta': 'Beta',
    'software.sha': 'SHA-256',
    'changelog.title': 'Changelog',
    'changelog.lead': 'New versions and fixes across every program, newest first.',
    'feedback.title': 'Feedback',
    'feedback.lead': 'Found a bug or want a feature? Every message is read.',
    'feedback.type': 'Type',
    'feedback.type.bug': 'Bug report',
    'feedback.type.feature': 'Feature request',
    'feedback.type.other': 'Other',
    'feedback.software': 'Program',
    'feedback.software.none': 'Not about a specific program',
    'feedback.subject': 'Subject',
    'feedback.subject.ph': 'Sum it up in one line',
    'feedback.content': 'Details',
    'feedback.content.ph': 'What happened, and when? Including your Windows version helps.',
    'feedback.contact': 'Contact for a reply (optional)',
    'feedback.contact.ph': 'Email or similar',
    'feedback.submit': 'Send',
    'feedback.sending': 'Sending',
    'feedback.sent': 'Sent. Thanks — it will be reviewed.',
    'feedback.error': 'Could not send. Check your connection and try again.',
    'feedback.required': 'Enter a subject and details.',
    'feedback.again': 'Send another',
    'notfound.title': 'Page not found',
    'notfound.body': 'The address changed or the page was removed.',
    'notfound.cta': 'Go to the home page',
    'footer.rights': 'HyoT. Every program is free.',
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
