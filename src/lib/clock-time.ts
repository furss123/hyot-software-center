// NICT publishes these HTTPS time sources at https://www.nict.go.jp/JST/JST5.html.
const timeServers = [
  'https://3fe5a5f690efc790d4764f1c528a4ebb89fa4168.nict.go.jp/cgi-bin/json',
  'https://67495dde3b39c2991829589f0101ab7a035eecf5.nict.go.jp/cgi-bin/json',
  'https://08a08e3a6edef4ba7a0c055a42d8e1ba2597f2b5.nict.go.jp/cgi-bin/json',
]

const maxRoundTrip = 1800

type ClockSample = { lower: number; upper: number }

async function readTime(url: string): Promise<ClockSample | undefined> {
  const start = performance.now()

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(maxRoundTrip),
    })
    if (!response.ok) return

    const body: unknown = await response.json()
    const end = performance.now()
    if (end - start > maxRoundTrip || !body || typeof body !== 'object' || !('st' in body)) return
    if (typeof body.st !== 'number' || !Number.isFinite(body.st) || body.st <= 0) return
    const serverTime = body.st * 1000
    if (serverTime > 8.64e15) return

    // The timestamp was generated between send and receipt. Allow 1 ms for its precision.
    return { lower: serverTime - end - 1, upper: serverTime - start + 1 }
  } catch {
    return undefined
  }
}

export async function getClockOffset(): Promise<number | undefined> {
  const samples = (await Promise.all(timeServers.map(readTime)))
    .filter((sample) => sample !== undefined)
    .sort((a, b) => (a.upper - a.lower) - (b.upper - b.lower))

  if (samples.length === 1) return (samples[0].lower + samples[0].upper) / 2

  // Start with the quickest responses and require overlapping time ranges.
  for (const [index, sample] of samples.entries()) {
    for (const other of samples.slice(index + 1)) {
      const lower = Math.max(sample.lower, other.lower)
      const upper = Math.min(sample.upper, other.upper)
      if (lower <= upper) return (lower + upper) / 2
    }
  }
}
