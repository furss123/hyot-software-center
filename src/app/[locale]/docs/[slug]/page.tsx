import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'

import { getAllDocSlugs, getDocBySlug } from '@/lib/content/docs'
import { AdSlot } from '@/components/ads/AdSlot'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const slugs = getAllDocSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const doc = getDocBySlug(slug)
  if (!doc) return {}
  const l = locale as Locale
  return {
    title: doc.frontmatter.title[l] ?? doc.frontmatter.title.en,
  }
}

export default async function DocDetailPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const l = locale as Locale

  const doc = getDocBySlug(slug)
  if (!doc) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-neutral dark:prose-invert">
      <h1 className="text-3xl font-bold text-text-primary mb-8">
        {doc.frontmatter.title[l] ?? doc.frontmatter.title.en}
      </h1>
      <div className="prose mt-8">
        <MDXRemote source={doc.content} />
      </div>
      <AdSlot position="docs" className="mt-8" />
    </article>
  )
}
