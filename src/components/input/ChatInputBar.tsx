import type { Attachment } from '@/types/chat'
import ChatTextarea from './ChatTextarea'
import SendButton from './SendButton'
import AttachButton from './AttachButton'
import AttachmentPreview from './AttachmentPreview'

interface Props {
  value: string
  onChange: (value: string) => void
  attachments: Attachment[]
  onAttach: (items: Attachment[]) => void
  onRemoveAttachment: (id: string) => void
  onSubmit: () => void
  onStop: () => void
  isStreaming: boolean
}

export default function ChatInputBar({
  value,
  onChange,
  attachments,
  onAttach,
  onRemoveAttachment,
  onSubmit,
  onStop,
  isStreaming,
}: Props) {
  const canSend = !isStreaming && (value.trim().length > 0 || attachments.length > 0)

  return (
    <div className="flex-shrink-0 pb-safe">
      <div className="relative">
        <div className="pointer-events-none absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-neutral-900 to-transparent" />
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-3">
        <div className="rounded-2xl border border-neutral-600 bg-neutral-800 shadow-lg focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-500">
          <AttachmentPreview attachments={attachments} onRemove={onRemoveAttachment} />
          <div className="flex items-end gap-1 pr-2">
            <div className="pb-2 pl-2">
              <AttachButton disabled={isStreaming} onAttach={onAttach} />
            </div>
            <ChatTextarea
              value={value}
              onChange={onChange}
              onSubmit={onSubmit}
              disabled={isStreaming}
            />
            <div className="pb-2">
              <SendButton
                isStreaming={isStreaming}
                onSend={onSubmit}
                onStop={onStop}
                disabled={!canSend}
              />
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-neutral-600">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}
