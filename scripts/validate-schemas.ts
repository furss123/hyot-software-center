import fs from 'fs'
import path from 'path'
import { z } from 'zod'

const i18nString = z.object({ ko: z.string().min(1), en: z.string().min(1) })

const MonetizationSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(['adsense', 'sponsor', 'none']),
  adFreeDownloadPages: z.boolean(),
  lazyLoadAds: z.boolean(),
  positions: z.object({
    homeTop: z.boolean(),
    homeBottom: z.boolean(),
    softwareTop: z.boolean(),
    softwareBottom: z.boolean(),
    faq: z.boolean(),
    docs: z.boolean(),
    news: z.boolean(),
    about: z.boolean(),
  }),
})

const SiteConfigSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    tagline: i18nString.optional(),
    logo: z.string().optional(),
    favicon: z.string().optional(),
    url: z.string().url(),
    github: z.string().url().optional(),
  }),
  seo: z.object({
    defaultTitle: z.string(),
    titleTemplate: z.string(),
    description: i18nString.optional(),
    ogImage: z.string().optional(),
  }),
  i18n: z.object({
    defaultLocale: z.enum(['ko', 'en']),
    locales: z.array(z.enum(['ko', 'en'])).min(1),
  }),
  theme: z.object({
    defaultMode: z.enum(['dark', 'light', 'system']),
    accentColor: z.string().optional(),
  }),
  download: z.object({
    channels: z.array(z.enum(['stable', 'beta', 'legacy'])),
    showLegacy: z.boolean(),
    checksumAlgorithm: z.literal('sha256'),
  }),
  nav: z
    .array(
      z.object({
        label: i18nString,
        href: z.string(),
        external: z.boolean().optional(),
      }),
    )
    .optional(),
  footer: z
    .object({
      links: z
        .array(
          z.object({
            group: i18nString,
            items: z.array(
              z.object({
                label: i18nString,
                href: z.string(),
                external: z.boolean().optional(),
              }),
            ),
          }),
        )
        .optional(),
      copyright: i18nString.optional(),
    })
    .optional(),
  monetization: MonetizationSchema.optional(),
})

const MetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(['active', 'beta', 'deprecated', 'archived']),
  category: z.enum([
    'utility',
    'productivity',
    'system',
    'developer',
    'media',
    'security',
    'other',
  ]),
  tags: z.array(z.string()).max(10),
  featured: z.boolean(),
  name: i18nString,
  description: i18nString,
  shortDescription: i18nString,
  requirements: z.object({ os: z.string() }),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const ReleasesSchema = z.object({
  slug: z.string(),
  latest: z.object({ stable: z.string().nullable(), beta: z.string().nullable() }),
  releases: z.array(
    z.object({
      version: z.string().regex(/^\d+\.\d+\.\d+(-beta\.\d+|-legacy)?$/),
      channel: z.enum(['stable', 'beta', 'legacy']),
      releaseDate: z.string(),
      githubTag: z.string(),
      assets: z
        .array(
          z.object({
            type: z.enum(['installer', 'portable', 'checksum']),
            filename: z.string(),
            url: z.string().url(),
            sha256: z.string().regex(/^[a-f0-9]{64}$/),
          }),
        )
        .min(1),
    }),
  ),
})

let errors = 0

const siteConfigPath = path.join(process.cwd(), 'data', 'config', 'site.config.json')
if (fs.existsSync(siteConfigPath)) {
  const result = SiteConfigSchema.safeParse(
    JSON.parse(fs.readFileSync(siteConfigPath, 'utf-8')),
  )
  if (!result.success) {
    process.stderr.write(`site.config.json: ${JSON.stringify(result.error.flatten())}\n`)
    errors++
  }
}

const dataDir = path.join(process.cwd(), 'data', 'software')

if (fs.existsSync(dataDir)) {
  for (const slug of fs.readdirSync(dataDir)) {
    const metaPath = path.join(dataDir, slug, 'meta.json')
    const releasesPath = path.join(dataDir, slug, 'releases.json')

    if (fs.existsSync(metaPath)) {
      const result = MetaSchema.safeParse(JSON.parse(fs.readFileSync(metaPath, 'utf-8')))
      if (!result.success) {
        process.stderr.write(`meta.json [${slug}]: ${JSON.stringify(result.error.flatten())}\n`)
        errors++
      }
    }

    if (fs.existsSync(releasesPath)) {
      const result = ReleasesSchema.safeParse(
        JSON.parse(fs.readFileSync(releasesPath, 'utf-8')),
      )
      if (!result.success) {
        process.stderr.write(
          `releases.json [${slug}]: ${JSON.stringify(result.error.flatten())}\n`,
        )
        errors++
      }
    }
  }
}

if (errors > 0) {
  process.exit(1)
}

process.stdout.write('All schemas valid.\n')
