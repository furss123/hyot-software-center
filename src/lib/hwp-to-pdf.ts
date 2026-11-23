type HwpPdfEngine = {
  (options: { module_or_path: URL }): Promise<unknown>
  registerPdfFont(bytes: Uint8Array): string
  hwpToPdf(bytes: Uint8Array): Uint8Array<ArrayBuffer>
}

const base = new URL('/moagyeol-hwp/0.2.2/', self.location.href)
const fontFiles = [
  'NanumMyeongjo-Regular.ttf',
  'NanumMyeongjo-Bold.ttf',
  'NanumGothic-Regular.ttf',
  'NanumGothic-Bold.ttf',
  'NotoSansMath-Regular.ttf',
  'NotoSansSymbols.ttf',
]

export async function loadHwpPdfEngine() {
  const engineUrl = new URL('rhwptopdf.umd.js', base).href
  await import(/* @vite-ignore */ engineUrl)
  const engine = (self as typeof self & { RhwpToPdf: HwpPdfEngine }).RhwpToPdf
  const [, fonts] = await Promise.all([
    engine({ module_or_path: new URL('rhwptopdf.umd_bg.wasm', base) }),
    Promise.all(fontFiles.map(async (name) => {
      const response = await fetch(new URL(name, base))
      if (!response.ok) throw new Error('Could not load the conversion font: ' + name)
      return new Uint8Array(await response.arrayBuffer())
    })),
  ])
  for (const font of fonts) {
    if (!engine.registerPdfFont(font)) throw new Error('Could not register a conversion font')
  }
  return engine
}
