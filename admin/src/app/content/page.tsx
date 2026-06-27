import { AdminCard } from '@/components/ui/AdminCard'
import { countNewsItems } from '@/lib/data'
import { readFaqItems } from '@/lib/content'
import { t } from '@/lib/i18n'

export default function ContentPage() {
  const newsCount = countNewsItems()
  const faqCount = readFaqItems().length

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.content.title}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <a href="/content/news" style={{ textDecoration: 'none' }}>
          <AdminCard>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t.content.news}</h2>
            <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>
              {newsCount}
              {t.content.newsCount}
            </p>
          </AdminCard>
        </a>
        <a href="/content/faq" style={{ textDecoration: 'none' }}>
          <AdminCard>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t.content.faq}</h2>
            <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>
              {faqCount}
              {t.content.faqCount}
            </p>
          </AdminCard>
        </a>
      </div>
    </div>
  )
}
