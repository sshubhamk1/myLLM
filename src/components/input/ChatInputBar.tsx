import ChatTextarea from './ChatTextarea'
import SendButton from './SendButton'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  isStreaming: boolean
}

export default function ChatInputBar({ value, onChange, onSubmit, onStop, isStreaming }: Props) {
  return (
    <div className="flex-shrink-0">
      <div className="relative">
        <div className="pointer-events-none absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-neutral-900 to-transparent" />
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-5">
        <div className="flex items-end gap-2 rounded-2xl border border-neutral-600 bg-neutral-800 pr-2 shadow-lg focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-500">
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
              disabled={!value.trim()}
            />
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-neutral-600">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}
