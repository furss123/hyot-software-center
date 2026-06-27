import { createClient } from '@supabase/supabase-js'

import { getSiteConfig } from './content/config'

export function getSupabaseClient() {
  const config = getSiteConfig()
  if (!config.feedback?.supabaseUrl || !config.feedback?.supabaseAnonKey) {
    throw new Error('Supabase config missing')
  }
  return createClient(config.feedback.supabaseUrl, config.feedback.supabaseAnonKey)
}

export interface FeedbackRow {
  id: string
  type: 'bug' | 'feature' | 'other'
  software: string | null
  title: string
  content: string
  contact: string | null
  created_at: string
  status: 'unread' | 'reviewing' | 'done' | 'dismissed'
}
