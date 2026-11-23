/// <reference lib="webworker" />

import { EncryptedPDFError, PDFDocument } from 'pdf-lib'
import { compressPdf } from './compress-pdf'

export type PdfRequest = { type: 'merge'; files: File[] } | { type: 'compress'; file: File; level: number }
export type PdfMessage =
  | { type: 'progress'; index: number; total: number }
  | { type: 'writing' }
  | { type: 'done'; buffer: ArrayBuffer; pageCount: number; signed?: boolean }
  | { type: 'error'; filename?: string; reason: 'encrypted' | 'unreadable' | 'failed' | 'unsupported' }

const worker = self as unknown as DedicatedWorkerGlobalScope
const encryptedMessage = new EncryptedPDFError().message
const send = (message: PdfMessage) => worker.postMessage(message)
const progress = (index: number, total: number) => send({ type: 'progress', index, total })
const writing = () => send({ type: 'writing' })

function done(buffer: ArrayBuffer, pageCount: number, signed?: boolean) {
  const result: PdfMessage = { type: 'done', buffer, pageCount, signed }
  worker.postMessage(result, [buffer])
}

async function readPdf(buffer: ArrayBuffer, filename: string) {
  try {
    const pdf = await PDFDocument.load(buffer, { updateMetadata: false })
    if (pdf.getPageCount()) return pdf
  } catch (error) {
    const encrypted = error instanceof Error && error.message === encryptedMessage
    send({ type: 'error', filename, reason: encrypted ? 'encrypted' : 'unreadable' })
    return null
  }
  send({ type: 'error', filename, reason: 'unreadable' })
  return null
}

async function merge(files: File[]) {
  const merged = await PDFDocument.create()
  for (const [index, file] of files.entries()) {
    progress(index + 1, files.length)
    const pdf = await readPdf(await file.arrayBuffer(), file.name)
    if (!pdf) return
    const pages = await merged.copyPages(pdf, pdf.getPageIndices())
    for (const page of pages) merged.addPage(page)
  }
  writing()
  const bytes = await merged.save()
  done(bytes.buffer as ArrayBuffer, merged.getPageCount())
}

async function compress(file: File, level: number) {
  if (typeof OffscreenCanvas === 'undefined' || typeof OffscreenCanvas.prototype.convertToBlob !== 'function') {
    send({ type: 'error', reason: 'unsupported' })
    return
  }
  const buffer = await file.arrayBuffer()
  const pdf = await readPdf(buffer, file.name)
  if (!pdf) return
  const result = await compressPdf(pdf, buffer, level, progress, writing)
  done(result.buffer, pdf.getPageCount(), result.signed)
}

worker.addEventListener('message', async ({ data }: MessageEvent<PdfRequest>) => {
  try {
    if (data.type === 'merge') await merge(data.files)
    else await compress(data.file, data.level)
  } catch {
    send({ type: 'error', reason: 'failed' })
  }
})
