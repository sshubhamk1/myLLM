import { useRef } from 'react'
import { Paperclip } from 'lucide-react'
import type { Attachment } from '@/types/chat'
import { cn } from '@/lib/utils'

const ACCEPTED = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'text/plain', 'text/markdown', 'text/csv', 'application/json',
  'text/xml', 'application/xml', 'text/yaml',
]
const ACCEPT_ATTR = '.jpg,.jpeg,.png,.gif,.webp,.txt,.md,.csv,.json,.xml,.yaml,.yml'
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
      if (!ACCEPTED.some(t => file.type.startsWith(t.split('/')[0]) && file.type === t) &&
          !file.type.startsWith('image/') && !file.type.startsWith('text/') &&
          file.type !== 'application/json' && file.type !== 'application/xml') {
        continue
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) continue

      const isImage = file.type.startsWith('image/')
      const data = await readFile(file, isImage)

      results.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        type: isImage ? 'image' : 'file',
        name: file.name,
        mimeType: file.type,
        data,
      })
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
        title="Attach file or image"
      >
        <Paperclip size={16} />
      </button>
    </>
  )
}

function readFile(file: File, asDataUrl: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    if (asDataUrl) {
      reader.readAsDataURL(file)
    } else {
      reader.readAsText(file)
    }
  })
}
