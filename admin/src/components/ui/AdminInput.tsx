export function AdminInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={{ fontSize: '0.75rem', color: '#A0A0A0', fontWeight: 500 }}>{label}</label>
      <input
        {...props}
        style={{
          background: '#242424',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '0.5rem 0.75rem',
          color: '#F0F0F0',
          fontSize: '0.875rem',
          outline: 'none',
        }}
      />
    </div>
  )
}
