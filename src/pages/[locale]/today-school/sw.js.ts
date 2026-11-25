import type { APIRoute } from 'astro'
import { localeStaticPaths, type Locale } from '../../../lib/i18n'
import { appScope } from '../../../lib/today-school-app'

export const getStaticPaths = localeStaticPaths

// 오늘 학교 웹의 서비스 워커. 이 파일 위치(/<언어>/today-school/) 아래 페이지만 담당한다.
// 항상 네트워크를 먼저 쓰고(새 버전이 바로 보이게), 인터넷이 끊겼을 때만 저장해 둔 화면을 보여 준다.
// 나이스·중계 서버 응답은 다른 주소라 건드리지 않는다. 최근 시간표·급식은 앱이 기기에 따로 저장한다.
const worker = (start: string) => `
const CACHE = 'today-school-v1'
const START = ${JSON.stringify(start)}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(START)).catch(() => {}))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('today-school-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone()
          event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copy)))
        }
        return response
      })
      .catch(async () => (await caches.match(request)) || (request.mode === 'navigate' && (await caches.match(START))) || Response.error()),
  )
})
`

export const GET: APIRoute = ({ params }) =>
  new Response(worker(appScope(params.locale as Locale)), {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  })
