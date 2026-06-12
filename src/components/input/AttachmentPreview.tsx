import { X, FileText } from 'lucide-react'
import type { Attachment } from '@/types/chat'

interface Props {
  attachments: Attachment[]
  onRemove: (id: string) => void
}

export default function AttachmentPreview({ attachments, onRemove }: Props) {
  if (attachments.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-3 pt-3">
      {attachments.map(att => (
        <div key={att.id} className="group relative flex-shrink-0">
          {att.type === 'image' ? (
            <img
              src={att.data}
              alt={att.name}
              className="h-16 w-16 rounded-lg object-cover border border-neutral-600"
            />
          ) : (
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-600 bg-neutral-700 px-2.5 py-2 max-w-[160px]">
              <FileText size={14} className="flex-shrink-0 text-neutral-400" />
              <span className="truncate text-xs text-neutral-200">{att.name}</span>
            </div>
          )}
          <button
            onClick={() => onRemove(att.id)}
            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-400"
            title="Remove"
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  )
}
