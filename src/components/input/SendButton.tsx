import { ArrowUp, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  isStreaming: boolean
  onSend: () => void
  onStop: () => void
  disabled: boolean
}

export default function SendButton({ isStreaming, onSend, onStop, disabled }: Props) {
  if (isStreaming) {
    return (
      <button
        onClick={onStop}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-200 text-neutral-900 transition-colors hover:bg-white"
        title="Stop generating"
      >
        <Square size={14} fill="currentColor" />
      </button>
    )
  }

  return (
    <button
      onClick={onSend}
      disabled={disabled}
      className={cn(
        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
        disabled
          ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
          : 'bg-neutral-200 text-neutral-900 hover:bg-white',
      )}
      title="Send message"
    >
      <ArrowUp size={16} />
    </button>
  )
}
