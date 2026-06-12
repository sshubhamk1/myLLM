import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  text: string
  className?: string
}

export default function CopyButton({ text, className }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors',
        'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700',
        copied && 'text-emerald-400 hover:text-emerald-400',
        className,
      )}
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
