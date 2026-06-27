type Variant = 'primary' | 'secondary' | 'danger'

export function AdminButton({
  children,
  variant = 'secondary',
  onClick,
  disabled,
  type = 'button',
}: {
  children: React.ReactNode
  variant?: Variant
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const styles: Record<Variant, React.CSSProperties> = {
    primary: { background: '#0078D4', color: '#fff' },
    secondary: {
      background: 'rgba(255,255,255,0.06)',
      color: '#F0F0F0',
      border: '1px solid rgba(255,255,255,0.08)',
    },
    danger: { background: '#C42B1C', color: '#fff' },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}
