import { getImage } from 'astro:assets'
import icon from '../content/software/today-meal/icon.png'
import type { Locale } from './i18n'

// 오늘 학교 웹을 휴대폰·PC 홈 화면에 설치(PWA)할 때 쓰는 정보.
// 매니페스트와 서비스 워커는 /<언어>/today-school/ 아래에 있어야 그 페이지만 담당한다.

export const appScope = (locale: Locale) => `/${locale}/today-school/`

export const appCopy = {
  ko: { name: '오늘 학교', description: '우리 반 시간표와 학교 급식을 한 화면에서 확인하세요.' },
  en: { name: 'School Today', description: 'Your class timetable and school meals in one view.' },
} as const

/** 홈 화면 아이콘 PNG들 (원본 512px에서 줄인다) */
export async function appIcons() {
  const sizes = [180, 192, 512]
  const images = await Promise.all(sizes.map((size) => getImage({ src: icon, width: size, height: size, format: 'png' })))
  return Object.fromEntries(sizes.map((size, i) => [size, images[i].src])) as Record<180 | 192 | 512, string>
}
