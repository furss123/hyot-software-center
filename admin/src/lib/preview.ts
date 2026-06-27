const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://furss123.github.io/hyot-software-center'

export function previewUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}/ko${normalized}`
}
