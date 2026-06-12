import { useRef } from 'react'
import { Paperclip } from 'lucide-react'
import type { Attachment } from '@/types/chat'
import { cn } from '@/lib/utils'

const ACCEPT_ATTR = [
  '.jpg,.jpeg,.png,.gif,.webp',
  '.pdf',
  '.doc,.docx',
  '.txt,.md,.csv,.json,.xml,.yaml,.yml',
].join(',')

const MAX_SIZE_MB = 20

interface Props {
  disabled: boolean
  onAttach: (attachments: Attachment[]) => void
}

export default function AttachButton({ disabled, onAttach }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    const results: Attachment[] = []

    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) continue

      try {
        const att = await readAttachment(file)
        if (att) results.push(att)
      } catch {
        // skip unreadable files silently
      }
    }

    if (results.length > 0) onAttach(results)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
          disabled
            ? 'text-neutral-600 cursor-not-allowed'
            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700',
        )}
        title="Attach image, PDF, or document"
      >
        <Paperclip size={16} />
      </button>
    </>
  )
}

async function readAttachment(file: File): Promise<Attachment | null> {
  const id = Date.now().toString() + Math.random().toString(36).slice(2)

  if (file.type.startsWith('image/')) {
    const data = await readAsDataUrl(file)
    return { id, type: 'image', name: file.name, mimeType: file.type, data }
  }

  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const data = await extractPdfText(file)
    return { id, type: 'file', name: file.name, mimeType: file.type, data }
  }

  const isDocx =
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  const isDoc =
    file.type === 'application/msword' || file.name.endsWith('.doc')

  if (isDocx || isDoc) {
    const data = await extractDocxText(file)
    return { id, type: 'file', name: file.name, mimeType: file.type, data }
  }

  // plain text / csv / json / md / yaml / xml
  if (
    file.type.startsWith('text/') ||
    file.type === 'application/json' ||
    file.type === 'application/xml'
  ) {
    const data = await readAsText(file)
    return { id, type: 'file', name: file.name, mimeType: file.type, data }
  }

  return null
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

async function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

async function extractPdfText(file: File): Promise<string> {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
  if (!GlobalWorkerOptions.workerSrc) {
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString()
  }

  const arrayBuffer = await readAsArrayBuffer(file)
  const pdf = await getDocument({ data: arrayBuffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(pageText)
  }

  return pages.join('\n\n')
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth')
  const arrayBuffer = await readAsArrayBuffer(file)
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}
