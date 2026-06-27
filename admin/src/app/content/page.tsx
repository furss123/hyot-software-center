import { AdminCard } from '@/components/ui/AdminCard'
import { countNewsItems } from '@/lib/data'
import { readFaqItems } from '@/lib/content'

export default function ContentPage() {
  const newsCount = countNewsItems()
  const faqCount = readFaqItems().length

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Content</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <a href="/content/news" style={{ textDecoration: 'none' }}>
          <AdminCard>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>News</h2>
            <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>{newsCount} items</p>
          </AdminCard>
        </a>
        <a href="/content/faq" style={{ textDecoration: 'none' }}>
          <AdminCard>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>FAQ</h2>
            <p style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>{faqCount} items</p>
          </AdminCard>
        </a>
      </div>
    </div>
  )
}
