export function AdminSelect({
  label,
  options,
  ...props
}: {
  label: string
  options: { value: string; label: string }[]
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={{ fontSize: '0.75rem', color: '#A0A0A0', fontWeight: 500 }}>{label}</label>
      <select
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
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
