import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { getAllNewsAdmin } from '@/lib/content'

export default function ContentNewsPage() {
  const items = getAllNewsAdmin()

  return (
    <div>
      <a href="/content" style={{ fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← Back to Content
      </a>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>News</h1>
        <a href="/content/news/new" style={{ textDecoration: 'none' }}>
          <AdminButton variant="primary">Add News</AdminButton>
        </a>
      </div>
      <AdminCard>
        <table>
          <thead>
            <tr>
              <th>Slug</th>
              <th>Title</th>
              <th>Date</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug}>
                <td style={{ fontFamily: 'monospace' }}>{item.slug}</td>
                <td>{item.title.en}</td>
                <td>{item.date}</td>
                <td>{item.published ? 'Yes' : 'No'}</td>
                <td>
                  <a href={`/content/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                    <AdminButton variant="secondary">Edit</AdminButton>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  )
}
