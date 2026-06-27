export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={className ?? ''}
      style={{
        background: '#1A1A1A',
        borderColor: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
      }}
    >
      {children}
    </div>
  )
}
