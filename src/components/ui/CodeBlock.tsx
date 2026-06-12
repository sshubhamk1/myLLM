import type { ComponentProps } from 'react'
import CopyButton from './CopyButton'

type CodeProps = ComponentProps<'code'> & { inline?: boolean }

export default function CodeBlock({ inline, className, children, ...props }: CodeProps) {
  const language = /language-(\w+)/.exec(className ?? '')?.[1] ?? ''
  const code = String(children).replace(/\n$/, '')

  if (inline) {
    return (
      <code
        className="rounded bg-neutral-700 px-1.5 py-0.5 font-mono text-sm text-neutral-200"
        {...props}
      >
        {children}
      </code>
    )
  }

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-neutral-700">
      <div className="flex items-center justify-between bg-neutral-800 px-4 py-2">
        <span className="font-mono text-xs text-neutral-400">
          {language || 'code'}
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto bg-neutral-950 p-4">
        <code className={cn('font-mono text-sm', className)} {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
