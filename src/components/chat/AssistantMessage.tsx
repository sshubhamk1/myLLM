import type React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import CopyButton from '@/components/ui/CopyButton'
import CodeBlock from '@/components/ui/CodeBlock'
import StreamingCursor from './StreamingCursor'

interface Props {
  content: string
  isStreaming?: boolean
}

export default function AssistantMessage({ content, isStreaming }: Props) {
  return (
    <div className="group flex items-start gap-3 message-appear">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
        AI
      </div>
      <div className="flex-1 min-w-0">
        <div className="prose prose-invert prose-neutral max-w-none text-sm leading-relaxed prose-p:my-2 prose-pre:my-0 prose-pre:p-0 prose-pre:bg-transparent">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code: CodeBlock as React.ComponentType<React.ComponentProps<'code'>>,
            }}
          >
            {content}
          </ReactMarkdown>
          {isStreaming && <StreamingCursor />}
        </div>
        {!isStreaming && content && (
          <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <CopyButton text={content} />
          </div>
        )}
      </div>
    </div>
  )
}
