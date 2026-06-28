import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'hyot-blue': 'var(--hyot-blue)',
        'hyot-blue-dark': 'var(--hyot-blue-dark)',
        'hyot-purple': 'var(--hyot-purple)',
        'hyot-orange': 'var(--hyot-orange)',
        'hyot-teal': 'var(--hyot-teal)',
        'bg-surface-2': 'var(--bg-surface-2)',
        'bg-surface-3': 'var(--bg-surface-3)',
        'border-pixel': 'var(--border-pixel)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
      },
    },
  },
}

export default config
