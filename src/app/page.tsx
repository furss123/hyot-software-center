import type { Metadata } from 'next'
import { defaultLocale } from '@/i18n/config'

// 이 사이트는 output:'export'(정적 내보내기, GitHub Pages)로 빌드되므로
// next/navigation의 redirect()는 실제 서버 리다이렉트를 만들지 못하고
// 빈 에러 페이지 + JS 하이드레이션 이후에만 동작하는 문제가 있었다.
// (방문자가 hyot.dev 루트로 들어오면 목록이 안 보이는 원인)
// 대신 inline <script>로 즉시 이동 + 수동 링크로 정적 호스팅에서도
// 항상 작동하도록 한다. RootLayout이 이미 <html>/<body>를 감싸므로
// 여기서는 body 안에 들어갈 내용만 반환한다.
const target = `/${defaultLocale}/`

export const metadata: Metadata = {
  alternates: { canonical: target },
}

export default function RootPage(): React.JSX.Element {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(target)});`,
        }}
      />
      <p>
        이동 중입니다… 자동으로 이동하지 않으면 <a href={target}>여기를 눌러주세요</a>.
      </p>
    </>
  )
}
