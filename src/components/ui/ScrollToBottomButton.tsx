import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  visible: boolean
  onClick: () => void
}

export default function ScrollToBottomButton({ visible, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute bottom-4 right-4 z-10 flex h-8 w-8 items-center justify-center',
        'rounded-full border border-neutral-600 bg-neutral-800 text-neutral-300',
        'shadow-lg transition-all duration-200 hover:bg-neutral-700 hover:text-neutral-100',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
      )}
      title="Scroll to bottom"
    >
      <ArrowDown size={14} />
    </button>
  )
}
