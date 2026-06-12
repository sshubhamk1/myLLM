import { FileText } from 'lucide-react'
import type { Attachment } from '@/types/chat'

interface Props {
  content: string
  attachments?: Attachment[]
}

export default function UserMessage({ content, attachments }: Props) {
  const images = attachments?.filter(a => a.type === 'image') ?? []
  const files = attachments?.filter(a => a.type === 'file') ?? []

  return (
    <div className="flex justify-end message-appear">
      <div className="max-w-[70%] space-y-2">
        {images.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2">
            {images.map(img => (
              <img
                key={img.id}
                src={img.data}
                alt={img.name}
                className="max-h-48 max-w-xs rounded-xl object-cover border border-neutral-600"
              />
            ))}
          </div>
        )}
        {files.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2">
            {files.map(f => (
              <div
                key={f.id}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-600 bg-neutral-700 px-2.5 py-1.5 max-w-[200px]"
              >
                <FileText size={13} className="flex-shrink-0 text-neutral-400" />
                <span className="truncate text-xs text-neutral-200">{f.name}</span>
              </div>
            ))}
          </div>
        )}
        {content && (
          <div className="rounded-2xl rounded-br-md bg-neutral-700 px-4 py-3 text-neutral-100 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>
        )}
      </div>
    </div>
  )
}
