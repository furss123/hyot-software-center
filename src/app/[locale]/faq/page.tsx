import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { Card } from '@/components/ui/Card'
import { AdSlot } from '@/components/ads/AdSlot'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = { title: 'FAQ' }

const faqs = {
  ko: [
    {
      q: '소프트웨어는 무료인가요?',
      a: '네, 모든 소프트웨어는 무료로 제공됩니다.',
    },
    {
      q: 'SHA256 체크섬은 어떻게 확인하나요?',
      a: 'PowerShell에서 Get-FileHash 명령어를 사용하세요: Get-FileHash .\\filename.exe -Algorithm SHA256',
    },
    {
      q: 'Windows 11에서 사용할 수 있나요?',
      a: '네, 모든 소프트웨어는 Windows 10 22H2 이상을 지원합니다.',
    },
  ],
  en: [
    {
      q: 'Is the software free?',
      a: 'Yes, all software is provided free of charge.',
    },
    {
      q: 'How do I verify the SHA256 checksum?',
      a: 'Use PowerShell: Get-FileHash .\\filename.exe -Algorithm SHA256',
    },
    {
      q: 'Is Windows 11 supported?',
      a: 'Yes, all software supports Windows 10 22H2 and later.',
    },
  ],
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function FaqPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const l = locale as Locale
  const items = faqs[l] ?? faqs.en

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-10">FAQ</h1>
      <div className="space-y-4">
        {items.map((item, i) => (
          <Card key={i} className="p-6">
            <h2 className="font-semibold text-text-primary mb-2">{item.q}</h2>
            <p className="text-text-secondary text-sm leading-relaxed">{item.a}</p>
          </Card>
        ))}
      </div>
      <AdSlot position="faq" className="mt-8" />
    </div>
  )
}
