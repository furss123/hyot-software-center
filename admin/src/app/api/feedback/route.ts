import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = 'https://pwzjuwxeabpiyxnmurqx.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3emp1d3hlYWJwaXl4bm11cnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjI4MjMsImV4cCI6MjA5ODEzODgyM30.H7lbU_wwUp0DFHEQz-DSRX-hByl_Y7Jfq2YEtMF8rAk'

function getClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY)
}

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message, data: [] }, { status: 502 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'fetch_failed', data: [] }, { status: 500 })
  }
}

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { id?: string; status?: string }
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 })
    }

    const supabase = getClient()
    const { error } = await supabase.from('feedback').update({ status }).eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }
}
