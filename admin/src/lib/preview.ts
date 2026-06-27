export const previewUrl = (path: string): string => {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://furss123.github.io/hyot-software-center'
  return `${base}/ko${path}`
}
