import type { APIRoute } from 'astro'
import { localeStaticPaths, type Locale } from '../../../lib/i18n'
import { appCopy, appIcons, appScope } from '../../../lib/today-school-app'

export const getStaticPaths = localeStaticPaths

export const GET: APIRoute = async ({ params }) => {
  const locale = params.locale as Locale
  const icons = await appIcons()
  const scope = appScope(locale)
  const manifest = {
    name: appCopy[locale].name,
    short_name: appCopy[locale].name,
    description: appCopy[locale].description,
    lang: locale,
    start_url: scope,
    scope,
    display: 'standalone',
    background_color: '#f6f5ef',
    theme_color: '#19382a',
    icons: [
      { src: icons[192], sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: icons[512], sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  })
}
