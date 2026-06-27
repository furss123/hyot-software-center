'use client'

export default function FeedbackPage(): React.JSX.Element {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>건의함</h1>
        <a
          href="https://formspree.io/forms/maqgjyyo/submissions"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.875rem', color: '#60CDFF' }}
        >
          새 탭에서 열기 →
        </a>
      </div>
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          height: 'calc(100vh - 140px)',
        }}
      >
        <iframe
          src="https://formspree.io/forms/maqgjyyo/submissions"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: '#fff',
          }}
          title="건의함"
        />
      </div>
    </div>
  )
}
