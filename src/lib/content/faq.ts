import fs from 'fs'
import path from 'path'

import type { I18nString } from '@/types'

export interface FaqItem {
  id: string
  order: number
  question: I18nString
  answer: I18nString
  category: string
}

export function getAllFaq(): FaqItem[] {
  const p = path.join(process.cwd(), 'data', 'content', 'faq', 'items.json')
  if (!fs.existsSync(p)) return []
  const raw = JSON.parse(fs.readFileSync(p, 'utf-8')) as FaqItem[]
  return raw.sort((a, b) => a.order - b.order)
}
