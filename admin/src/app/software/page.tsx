import { AdminButton } from '@/components/ui/AdminButton'
import { AdminCard } from '@/components/ui/AdminCard'
import { getAllSlugs, readMeta } from '@/lib/data'

export default function SoftwareListPage() {
  const items = getAllSlugs()
    .map((slug) => readMeta(slug))
    .filter((m) => m !== null)

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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Software</h1>
        <a href="/software/new" style={{ textDecoration: 'none' }}>
          <AdminButton variant="primary">Add New</AdminButton>
        </a>
      </div>
      <AdminCard className="">
        <table>
          <thead>
            <tr>
              <th>Slug</th>
              <th>Name</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Category</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug}>
                <td style={{ fontFamily: 'monospace' }}>{item.slug}</td>
                <td>{item.name.en}</td>
                <td>{item.status}</td>
                <td>{item.featured ? 'Yes' : 'No'}</td>
                <td>{item.category}</td>
                <td>
                  <a href={`/software/${item.slug}`} style={{ textDecoration: 'none' }}>
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
