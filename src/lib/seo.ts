import { getImage } from 'astro:assets'
import type { ImageMetadata } from 'astro'
import type { Software } from './software'

const SITE = 'https://hyot.dev'

/** 공유 미리보기(og:image)용 이미지. 원본을 키우지 않고 최대 1200px 폭 JPEG로 만든다. */
export async function ogImageFor(image?: ImageMetadata): Promise<string | undefined> {
  if (!image) return undefined
  const result = await getImage({ src: image, width: Math.min(1200, image.width), format: 'jpeg', quality: 82 })
  return new URL(result.src, SITE).href
}

export const publisher = { '@type': 'Organization', name: 'hyot.dev', url: `${SITE}/` }

// schema.org applicationCategory 값 (Google이 권장하는 이름)
const applicationCategory: Record<Software['data']['category'], string> = {
  classroom: 'EducationalApplication',
  system: 'UtilitiesApplication',
  document: 'UtilitiesApplication',
  media: 'MultimediaApplication',
  image: 'DesignApplication',
  etc: 'UtilitiesApplication',
}

export const categoryType = (category: Software['data']['category']) => applicationCategory[category]

export const free = { '@type': 'Offer', price: 0, priceCurrency: 'KRW' }

export const absolute = (path: string) => (path.startsWith('http') ? path : new URL(path, SITE).href)

/** 설치 없이 브라우저에서 쓰는 도구(웹 도구 페이지)의 구조화 데이터 */
export const webApplication = (app: {
  name: string
  description: string
  path: string
  category: Software['data']['category']
  image?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: app.name,
  description: app.description,
  url: absolute(app.path),
  applicationCategory: categoryType(app.category),
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  ...(app.image ? { image: app.image } : {}),
  inLanguage: 'ko',
  isAccessibleForFree: true,
  offers: free,
  publisher,
})
