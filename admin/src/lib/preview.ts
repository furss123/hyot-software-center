export const previewUrl = (path: string): string => {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hyot.dev'
  return `${base}/ko${path}`
}
