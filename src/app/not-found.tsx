import Link from 'next/link'

export default function RootNotFound(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-bg-base text-text-primary">
      <div className="text-8xl font-bold text-fill-tertiary mb-4">404</div>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-text-secondary mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/ko" className="text-accent hover:opacity-80">
        Go Home
      </Link>
    </div>
  )
}
