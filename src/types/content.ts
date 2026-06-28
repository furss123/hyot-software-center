import type { I18nString } from './software'

export interface NewsItem {
  slug: string
  title: I18nString
  summary: I18nString
  date: string
  published: boolean
  tags: string[]
  content: string
}
