import { forwardRef } from 'react'
import type { Message } from '@/types/chat'
import MessageItem from './MessageItem'
import AssistantMessage from './AssistantMessage'
import TypingIndicator from './TypingIndicator'

interface Props {
  messages: Message[]
  streamingContent: string
  isStreaming: boolean
}

const MessageList = forwardRef<HTMLDivElement, Props>(
  ({ messages, streamingContent, isStreaming }, ref) => {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 && !isStreaming && (
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                AI
              </div>
              <h2 className="text-xl font-semibold text-neutral-200">How can I help you?</h2>
              <p className="mt-1 text-sm text-neutral-500">Ask me anything</p>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}

            {isStreaming && streamingContent === '' && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                  AI
                </div>
                <TypingIndicator />
              </div>
            )}

            {isStreaming && streamingContent !== '' && (
              <AssistantMessage content={streamingContent} isStreaming={true} />
            )}
          </div>

          <div className="h-4" />
        </div>
      </div>
    )
  },
)

MessageList.displayName = 'MessageList'

export default MessageList
