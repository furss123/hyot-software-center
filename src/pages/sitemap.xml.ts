import type { APIRoute } from 'astro'

// 예전에 Google Search Console에 제출한 주소(/sitemap.xml)와, 이 주소를 먼저 찾는 검색엔진(네이버·Bing)을 위해
// @astrojs/sitemap이 만드는 sitemap-index.xml과 같은 내용을 이 주소로도 제공한다.
export const GET: APIRoute = ({ site }) => {
  const child = new URL('/sitemap-0.xml', site).href
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    `<sitemap><loc>${child}</loc></sitemap>` +
    '</sitemapindex>'
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
