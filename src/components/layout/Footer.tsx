export function Footer(): React.JSX.Element {
  const year = new Date().getFullYear()
  return (
    <footer className="py-5 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="dot-divider mb-5" aria-hidden="true" />
        <p className="text-center text-xs text-text-tertiary">
          © {year} HyoT. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
