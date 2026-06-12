import { useCallback, useRef, useState } from 'react'
import type { Message } from '@/types/chat'
import { useSSEStream } from '@/hooks/useSSEStream'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import MessageList from './MessageList'
import ChatInputBar from '@/components/input/ChatInputBar'
import ScrollToBottomButton from '@/components/ui/ScrollToBottomButton'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [streamingContent, setStreamingContent] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const pendingMessagesRef = useRef<Message[]>([])
  const streamingContentRef = useRef('')

  const { sendMessage, stopStream, isStreaming } = useSSEStream({
    onToken: useCallback((token: string) => {
      streamingContentRef.current += token
      setStreamingContent(streamingContentRef.current)
    }, []),
    onDone: useCallback(() => {
      const content = streamingContentRef.current
      if (content) {
        const assistantMsg: Message = {
          // id: crypto.randomUUID(),
          id: Date.now().toString(),
          role: 'assistant',
          content,
          createdAt: new Date(),
        }
        setMessages((prev) => [...prev, assistantMsg])
      }
      streamingContentRef.current = ''
      setStreamingContent('')
    }, []),
    onError: useCallback((err: Error) => {
      setError(err.message)
      streamingContentRef.current = ''
      setStreamingContent('')
    }, []),
  })

  const { containerRef, showScrollButton, scrollToBottom } = useAutoScroll(streamingContent)

  const handleSubmit = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isStreaming) return

    const userMsg: Message = {
      // id: crypto.randomUUID(),
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      createdAt: new Date(),
    }

    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    pendingMessagesRef.current = nextMessages
    setInputValue('')
    setError(null)
    streamingContentRef.current = ''
    setStreamingContent('')

    sendMessage(nextMessages)
  }

  const handleStop = () => {
    stopStream()
  }

  return (
    <div className="flex h-screen flex-col bg-neutral-900">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-center border-b border-neutral-800 bg-neutral-900 h-14 px-4">
        <span className="text-base font-semibold text-neutral-200 tracking-wide">MyLLM</span>
      </header>

      {/* Message area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <MessageList
          ref={containerRef}
          messages={messages}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
        />
        <ScrollToBottomButton visible={showScrollButton} onClick={scrollToBottom} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-auto mb-2 max-w-3xl px-4 w-full">
          <div className="rounded-lg border border-red-800 bg-red-950 px-4 py-2 text-sm text-red-300">
            Error: {error}{' '}
            <button
              onClick={() => setError(null)}
              className="ml-2 underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInputBar
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        onStop={handleStop}
        isStreaming={isStreaming}
      />
    </div>
  )
}
