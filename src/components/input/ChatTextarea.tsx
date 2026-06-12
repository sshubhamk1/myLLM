import { type KeyboardEvent, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled: boolean
  placeholder?: string
}

export default function ChatTextarea({ value, onChange, onSubmit, disabled, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) onSubmit()
    }
  }

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={placeholder ?? (disabled ? 'Waiting for response…' : 'Message MyLLM…')}
      rows={1}
      className={cn(
        'w-full resize-none bg-transparent text-sm text-neutral-100 placeholder-neutral-500',
        'max-h-[200px] overflow-y-auto py-2.5 pl-4 pr-2 leading-relaxed',
        'focus:outline-none',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    />
  )
}
