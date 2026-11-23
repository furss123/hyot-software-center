import { pdfCopy } from './pdf-tools-copy'
import type { PdfMessage, PdfRequest } from './pdf-tools.worker'

type Tool = PdfRequest['type']
type RowAction = 'up' | 'down' | 'remove'

const root = document.querySelector<HTMLElement>('[data-pdf-tools]')!
const select = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!
const locale = document.documentElement.lang === 'en' ? 'en' : 'ko'
const copy = pdfCopy[locale]
const tools = select('[data-tools]')
const switches = root.querySelectorAll<HTMLButtonElement>('[data-tool]')
const fileInput = select<HTMLInputElement>('[data-files]')
const choose = select<HTMLButtonElement>('[data-choose]')
const clear = select<HTMLButtonElement>('[data-clear]')
const dropzone = select('[data-dropzone]')
const dropTitle = select('[data-drop-title]')
const fileHeading = select('#files-title')
const saveHeading = select('#save-title')
const orderHelp = select('[data-order-help]')
const fileList = select('[data-file-list]')
const list = select<HTMLOListElement>('[data-list]')
const template = select<HTMLTemplateElement>('[data-file-template]')
const levels = select<HTMLFieldSetElement>('[data-levels]')
const levelName = select('[data-level-name]')
const filename = select<HTMLInputElement>('#output-name')
const run = select<HTMLButtonElement>('[data-run]')
const cancel = select<HTMLButtonElement>('[data-cancel]')
const download = select<HTMLAnchorElement>('[data-download]')
const report = select('[data-report]')
const hwpNote = select('[data-hwp-note]')

const selections: Record<Tool, File[]> = { merge: [], compress: [], convert: [] }
const outputNames = { merge: copy.merge.defaultName, compress: copy.compress.defaultName, convert: '' }
const hwpExtension = /\.hwpx?$/i
const sizeNumber = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 })

let mode: Tool = 'merge'
let files = selections[mode]
let level = 3
let job: Worker | null = null
let resultUrl: string | null = null

function showReport(message: string, error = false) {
  report.textContent = message
  report.toggleAttribute('data-error', error)
}

function size(bytes: number) {
  if (bytes < 1024) return sizeNumber.format(bytes) + ' B'
  if (bytes < 1024 ** 2) return sizeNumber.format(bytes / 1024) + ' KB'
  return sizeNumber.format(bytes / 1024 ** 2) + ' MB'
}

function suggestedName() {
  if (mode === 'convert' && files[0]) return files[0].name.replace(hwpExtension, '') || copy.convert.defaultName
  return copy[mode].defaultName
}

function updateDownloadName() {
  const name = (filename.value.trim() || suggestedName())
    .replace(/[<>:"\/\\|?*\u0000-\u001f]/g, '_')
    .replace(/(?:\.pdf)+$/i, '')
    .replace(/[. ]+$/, '')
  download.download = (name || copy[mode].defaultName) + '.pdf'
}

function discardResult() {
  if (resultUrl) URL.revokeObjectURL(resultUrl)
  resultUrl = null
  download.removeAttribute('href')
}

function minimumFiles() {
  return mode === 'merge' ? 2 : 1
}

function render() {
  const busy = job !== null
  const merging = mode === 'merge'
  const converting = mode === 'convert'
  const labels = copy[mode]
  for (const button of switches) {
    button.disabled = busy
    button.setAttribute('aria-pressed', String(button.dataset.tool === mode))
  }
  fileHeading.textContent = labels.files
  dropTitle.textContent = labels.drop
  saveHeading.textContent = labels.save
  orderHelp.hidden = !merging
  list.setAttribute('aria-label', labels.order)
  fileInput.multiple = merging
  fileInput.accept = converting ? '.hwp,.hwpx' : '.pdf,application/pdf'
  filename.placeholder = suggestedName()
  levels.hidden = mode !== 'compress'
  levels.disabled = busy
  hwpNote.hidden = !converting
  choose.disabled = busy
  if (converting) {
    choose.textContent = files.length ? copy.replaceHwp : copy.chooseHwp
  } else {
    choose.textContent = !merging && files.length ? copy.replaceFile : copy.choose
  }
  clear.disabled = busy
  clear.hidden = files.length === 0 || !merging
  fileList.hidden = files.length === 0
  dropzone.toggleAttribute('data-compact', files.length > 0)
  run.disabled = busy || files.length < minimumFiles()
  run.hidden = resultUrl !== null
  run.textContent = busy ? labels.working : labels.action
  cancel.hidden = !busy
  download.hidden = resultUrl === null
  download.textContent = labels.download

  const rows = document.createDocumentFragment()
  files.forEach((file, index) => {
    const row = template.content.cloneNode(true) as DocumentFragment
    const name = row.querySelector<HTMLElement>('[data-name]')!
    const position = row.querySelector<HTMLElement>('[data-position]')!
    name.textContent = file.name
    name.title = file.name
    position.textContent = String(index + 1)
    position.hidden = !merging
    row.querySelector('[data-size]')!.textContent = size(file.size)
    for (const button of row.querySelectorAll<HTMLButtonElement>('[data-action]')) {
      const action = button.dataset.action as RowAction
      button.hidden = !merging && action !== 'remove'
      button.disabled = busy || (action === 'up' && index === 0) ||
        (action === 'down' && index === files.length - 1)
      button.setAttribute('aria-label', copy.fileAction(file.name, copy[action]))
      button.addEventListener('click', () => changeOrder(index, action))
    }
    rows.append(row)
  })
  list.replaceChildren(rows)
}

function selectionChanged(notice = '') {
  discardResult()
  render()
  const labels = copy[mode]
  const message = files.length < minimumFiles() ? labels.minimum : labels.ready(files.length)
  showReport(notice ? notice + ' ' + message : message, Boolean(notice))
}

function changeOrder(index: number, action: RowAction) {
  const [file] = files.splice(index, 1)
  let target = index
  if (action === 'remove') {
    target = Math.min(index, files.length - 1)
  } else {
    target = action === 'up' ? index - 1 : index + 1
    files.splice(target, 0, file)
  }
  selectionChanged()
  const row = list.children[target]
  const next = row?.querySelector<HTMLButtonElement>('[data-action="' + action + '"]:not(:disabled)') ??
    row?.querySelector<HTMLButtonElement>('button:not(:disabled):not([hidden])') ?? choose
  next.focus()
}

function addFiles(selection: FileList) {
  if (job) return
  const selected = Array.from(selection)
  const converting = mode === 'convert'
  const invalid = converting ? copy.invalidHwp : copy.invalidType
  const accepted = selected.filter((file) => converting
    ? hwpExtension.test(file.name)
    : /\.pdf$/i.test(file.name) || file.type === 'application/pdf')
  if (!accepted.length) {
    if (selected.length) showReport(invalid, true)
    return
  }

  let notice = accepted.length !== selected.length ? invalid : ''
  if (mode === 'merge') {
    for (const file of accepted) files.push(file)
  } else {
    files.splice(0, files.length, accepted[0])
    if (accepted.length > 1) notice = converting ? copy.singleHwp : copy.single
  }
  selectionChanged(notice)
}

function switchTool(next: Tool) {
  if (job || mode === next) return
  outputNames[mode] = filename.value
  mode = next
  files = selections[mode]
  filename.value = outputNames[mode]
  selectionChanged()
}

for (const button of switches) {
  button.addEventListener('click', () => switchTool(button.dataset.tool as Tool))
}
window.addEventListener('hashchange', () => {
  if (location.hash === '#hwp') switchTool('convert')
})
levels.addEventListener('change', () => {
  const checked = levels.querySelector<HTMLInputElement>('input:checked')!
  level = Number(checked.value)
  levelName.textContent = copy.levelNames[level - 1]
  selectionChanged()
})
choose.addEventListener('click', () => fileInput.click())
fileInput.addEventListener('change', () => {
  if (fileInput.files) addFiles(fileInput.files)
  fileInput.value = ''
})
clear.addEventListener('click', () => {
  files.length = 0
  selectionChanged()
  choose.focus()
})

function isFileDrag(event: DragEvent) {
  return event.dataTransfer?.types.includes('Files') ?? false
}

let dragDepth = 0
dropzone.addEventListener('dragenter', (event) => {
  if (!isFileDrag(event)) return
  event.preventDefault()
  dragDepth += 1
  dropzone.toggleAttribute('data-dragging', job === null)
})
dropzone.addEventListener('dragleave', () => {
  dragDepth = Math.max(0, dragDepth - 1)
  if (!dragDepth) dropzone.removeAttribute('data-dragging')
})
dropzone.addEventListener('dragover', (event) => {
  if (isFileDrag(event) && event.dataTransfer) event.dataTransfer.dropEffect = job ? 'none' : 'copy'
})
dropzone.addEventListener('drop', (event) => {
  if (event.dataTransfer?.files.length) addFiles(event.dataTransfer.files)
})
// Keep a file dropped outside the target from replacing the PDF tool.
window.addEventListener('dragover', (event) => {
  if (isFileDrag(event)) event.preventDefault()
})
window.addEventListener('drop', (event) => {
  if (isFileDrag(event)) event.preventDefault()
  dragDepth = 0
  dropzone.removeAttribute('data-dragging')
})

function stopJob() {
  job?.terminate()
  job = null
}

function reportResult(message: Extract<PdfMessage, { type: 'done' }>) {
  if (mode === 'merge') return copy.merge.complete(message.pageCount)
  if (mode === 'convert') return copy.convert.complete(message.pageCount)
  if (message.signed) return copy.signed
  const original = files[0].size
  const reduced = message.buffer.byteLength
  if (original === reduced) return copy.unchanged(size(original))
  const difference = 1 - reduced / original
  const displayedPercent = difference < 0.001 ? '<0.1%' : percent.format(difference)
  const [before, after] = size(original) === size(reduced)
    ? [sizeNumber.format(original) + ' B', sizeNumber.format(reduced) + ' B']
    : [size(original), size(reduced)]
  return copy.reduced(before, after, displayedPercent)
}

run.addEventListener('click', () => {
  if (job || files.length < minimumFiles()) return

  try {
    const worker = new Worker(new URL('./pdf-tools.worker.ts', import.meta.url), { type: 'module' })
    job = worker
    render()
    showReport(copy[mode].working)

    const fail = () => {
      if (job !== worker) return
      stopJob()
      render()
      showReport(copy.failed, true)
    }
    worker.addEventListener('error', fail)
    worker.addEventListener('messageerror', fail)
    worker.addEventListener('message', (event: MessageEvent<PdfMessage>) => {
      if (job !== worker) return
      const message = event.data
      if (message.type === 'progress') {
        if (mode !== 'convert') showReport(copy[mode].progress(message.index, message.total))
        return
      }
      if (message.type === 'writing') {
        showReport(copy[mode].writing)
        return
      }

      const focusInActions = document.activeElement === cancel || document.activeElement === document.body
      stopJob()
      if (message.type === 'done') {
        resultUrl = URL.createObjectURL(new Blob([message.buffer], { type: 'application/pdf' }))
        download.href = resultUrl
        updateDownloadName()
        showReport(reportResult(message))
      } else {
        showReport(message.filename ? message.filename + ' · ' + copy[message.reason] : copy[message.reason], true)
      }
      render()
      if (focusInActions) (message.type === 'done' ? download : run).focus({ preventScroll: true })
    })
    let request: PdfRequest
    if (mode === 'merge') request = { type: mode, files }
    else if (mode === 'compress') request = { type: mode, file: files[0], level }
    else request = { type: mode, file: files[0] }
    worker.postMessage(request)
  } catch {
    stopJob()
    render()
    showReport(copy.failed, true)
  }
})

cancel.addEventListener('click', () => {
  stopJob()
  render()
  showReport(copy.cancelled)
  run.focus()
})
filename.addEventListener('input', updateDownloadName)
window.addEventListener('pagehide', (event) => {
  if (event.persisted) return
  stopJob()
  discardResult()
})

if (location.hash === '#hwp') switchTool('convert')
tools.hidden = false
