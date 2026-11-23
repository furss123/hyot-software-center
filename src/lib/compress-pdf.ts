import { PDFDict, PDFName, PDFNumber, PDFRawStream, PDFRef, type PDFDocument } from 'pdf-lib'

export const compressionLevels = [
  { quality: 0.94, longestEdge: 3300 },
  { quality: 0.86, longestEdge: 2550 },
  { quality: 0.74, longestEdge: 1920 },
  { quality: 0.57, longestEdge: 1440 },
  { quality: 0.40, longestEdge: 1024 },
] as const

const name = PDFName.of
const image = name('Image')
const gray = name('DeviceGray')
const rgb = name('DeviceRGB')
const jpeg = name('DCTDecode')
const flate = name('FlateDecode')

function integer(dict: PDFDict, key: string, fallback = 0) {
  const value = dict.lookup(name(key))
  return value instanceof PDFNumber ? value.asNumber() : fallback
}

function paeth(left: number, above: number, corner: number) {
  const p = left + above - corner
  const a = Math.abs(p - left)
  const b = Math.abs(p - above)
  const c = Math.abs(p - corner)
  if (a <= b && a <= c) return left
  return b <= c ? above : corner
}

function unfilterRows(bytes: Uint8Array, stride: number, height: number, colors: number) {
  const pixels = new Uint8Array(stride * height)
  for (let y = 0; y < height; y += 1) {
    const row = y * stride
    const input = y * (stride + 1)
    const filter = bytes[input]
    if (filter > 4) return null
    for (let x = 0; x < stride; x += 1) {
      const offset = row + x
      const left = x >= colors ? pixels[offset - colors] : 0
      const above = y > 0 ? pixels[offset - stride] : 0
      const corner = y > 0 && x >= colors ? pixels[offset - stride - colors] : 0
      let prediction = 0
      switch (filter) {
        case 1: prediction = left; break
        case 2: prediction = above; break
        case 3: prediction = (left + above) >> 1; break
        case 4: prediction = paeth(left, above, corner); break
      }
      pixels[offset] = bytes[input + 1 + x] + prediction
    }
  }
  return pixels
}

async function inflateImage(contents: Uint8Array, expected: number) {
  const blob = new Blob([Uint8Array.from(contents)])
  const reader = blob.stream().pipeThrough(new DecompressionStream('deflate')).getReader()
  const bytes = new Uint8Array(expected)
  let offset = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) return offset === expected ? bytes : null
      if (offset + value.length > expected) {
        await reader.cancel()
        return null
      }
      bytes.set(value, offset)
      offset += value.length
    }
  } finally {
    reader.releaseLock()
  }
}

async function decodeFlate(stream: PDFRawStream, width: number, height: number, colors: number) {
  const params = stream.dict.lookup(name('DecodeParms'))
  if (params !== undefined && !(params instanceof PDFDict)) return null
  const predictor = params ? integer(params, 'Predictor', 1) : 1
  const hasRows = predictor >= 10 && predictor <= 15
  if (predictor !== 1 && !hasRows) return null
  if (hasRows && params && (
    integer(params, 'Columns', 1) !== width ||
    integer(params, 'Colors', 1) !== colors ||
    integer(params, 'BitsPerComponent', 8) !== 8
  )) return null

  const stride = width * colors
  const bytes = await inflateImage(stream.contents, (stride + Number(hasRows)) * height)
  const samples = bytes && hasRows ? unfilterRows(bytes, stride, height, colors) : bytes
  if (!samples) return null
  const pixels = new ImageData(width, height)
  for (let i = 0, j = 0; i < samples.length; i += colors, j += 4) {
    pixels.data[j] = samples[i]
    pixels.data[j + 1] = colors === 1 ? samples[i] : samples[i + 1]
    pixels.data[j + 2] = colors === 1 ? samples[i] : samples[i + 2]
    pixels.data[j + 3] = 255
  }
  return pixels
}

async function reduceImage(stream: PDFRawStream, settings: (typeof compressionLevels)[number]) {
  const dict = stream.dict
  const space = dict.lookup(name('ColorSpace'))
  const filter = dict.lookup(name('Filter'))
  const width = integer(dict, 'Width')
  const height = integer(dict, 'Height')
  if (
    (space !== rgb && space !== gray) ||
    (filter !== jpeg && filter !== flate) ||
    integer(dict, 'BitsPerComponent') !== 8 ||
    !Number.isSafeInteger(width) || !Number.isSafeInteger(height) ||
    width < 1 || height < 1 || width * height > 24_000_000 ||
    ['Mask', 'SMask', 'Decode', 'ImageMask'].some((key) => dict.has(name(key))) ||
    (filter === jpeg && dict.has(name('DecodeParms')))
  ) return null

  const scale = Math.min(1, settings.longestEdge / Math.max(width, height))
  const newWidth = Math.max(1, Math.round(width * scale))
  const newHeight = Math.max(1, Math.round(height * scale))
  const canvas = new OffscreenCanvas(newWidth, newHeight)
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) return null
  context.imageSmoothingQuality = 'high'

  if (filter === jpeg) {
    const blob = new Blob([Uint8Array.from(stream.contents)], { type: 'image/jpeg' })
    const bitmap = await createImageBitmap(blob, {
      imageOrientation: 'none',
      colorSpaceConversion: 'none',
      resizeWidth: newWidth,
      resizeHeight: newHeight,
      resizeQuality: 'high',
    })
    try {
      context.drawImage(bitmap, 0, 0, newWidth, newHeight)
    } finally {
      bitmap.close()
    }
  } else {
    const pixels = await decodeFlate(stream, width, height, space === gray ? 1 : 3)
    if (!pixels) return null
    if (scale === 1) {
      context.putImageData(pixels, 0, 0)
    } else {
      const bitmap = await createImageBitmap(pixels, {
        resizeWidth: newWidth,
        resizeHeight: newHeight,
        resizeQuality: 'high',
      })
      try {
        context.drawImage(bitmap, 0, 0, newWidth, newHeight)
      } finally {
        bitmap.close()
      }
    }
  }

  const smaller = await canvas.convertToBlob({ type: 'image/jpeg', quality: settings.quality })
  if (smaller.type !== 'image/jpeg' || smaller.size >= stream.getContentsSize()) return null

  const replacement = dict.clone()
  replacement.set(name('Filter'), jpeg)
  replacement.set(name('ColorSpace'), rgb)
  replacement.set(name('Width'), PDFNumber.of(newWidth))
  replacement.set(name('Height'), PDFNumber.of(newHeight))
  replacement.delete(name('DecodeParms'))
  return PDFRawStream.of(replacement, new Uint8Array(await smaller.arrayBuffer()))
}

export async function compressPdf(
  pdf: PDFDocument,
  source: ArrayBuffer,
  level: number,
  progress: (index: number, total: number) => void,
  writing: () => void,
) {
  const objects = pdf.context.enumerateIndirectObjects()
  // Rewriting the PDF would invalidate any existing signature.
  if (objects.some(([, object]) => object instanceof PDFDict && object.has(name('ByteRange')))) {
    return { buffer: source, signed: true }
  }

  const images = objects.filter((entry): entry is [PDFRef, PDFRawStream] => {
    const [, object] = entry
    return object instanceof PDFRawStream && object.dict.lookup(name('Subtype')) === image
  })
  const masks = new Set<PDFRef>()
  for (const [, stream] of images) {
    for (const key of ['Mask', 'SMask']) {
      const mask = stream.dict.get(name(key))
      if (mask instanceof PDFRef) masks.add(mask)
    }
  }
  const candidates = images.filter(([ref]) => !masks.has(ref))
  const settings = compressionLevels[level - 1] ?? compressionLevels[2]
  for (const [index, [ref, stream]] of candidates.entries()) {
    progress(index + 1, candidates.length)
    try {
      const smaller = await reduceImage(stream, settings)
      if (smaller) pdf.context.assign(ref, smaller)
    } catch {
      // Keep the image if the browser cannot decode or re-encode it.
    }
  }

  writing()
  const optimized = await pdf.save({ addDefaultPage: false, updateFieldAppearances: false })
  return {
    buffer: optimized.byteLength < source.byteLength ? optimized.buffer as ArrayBuffer : source,
    signed: false,
  }
}
