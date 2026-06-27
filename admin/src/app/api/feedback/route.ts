import { NextResponse } from 'next/server'

type FormspreeSubmission = {
  _id?: string
  _date?: string
  유형?: string
  프로그램?: string
  제목?: string
  내용?: string
  연락처?: string
}

export async function GET(): Promise<NextResponse> {
  const apiKey = process.env.FORMSPREE_API_KEY
  const formId = process.env.FORMSPREE_FORM_ID ?? 'maqgjyyo'

  if (!apiKey) {
    return NextResponse.json({ error: 'no_key', submissions: [] })
  }

  try {
    const res = await fetch(`https://formspree.io/api/0/forms/${formId}/submissions`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'fetch_failed', submissions: [] }, { status: res.status })
    }

    const data = (await res.json()) as { submissions?: FormspreeSubmission[] }
    const submissions = (data.submissions ?? []).sort((a, b) =>
      (b._date ?? '').localeCompare(a._date ?? ''),
    )

    return NextResponse.json({ submissions })
  } catch {
    return NextResponse.json({ error: 'fetch_failed', submissions: [] }, { status: 500 })
  }
}
