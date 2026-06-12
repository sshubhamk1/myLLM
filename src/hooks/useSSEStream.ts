import { useRef, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { buildChatRequest } from '@/config/api'
import type { Message } from '@/types/chat'

interface Callbacks {
  onToken: (token: string) => void
  onDone: () => void
  onError: (err: Error) => void
  baseUrl: string
}

export function useSSEStream({ onToken, onDone, onError, baseUrl }: Callbacks) {
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = async (messages: Message[]) => {
    abortRef.current = new AbortController()
    setIsStreaming(true)

    try {
      await fetchEventSource(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildChatRequest(messages)),
        signal: abortRef.current.signal,
        openWhenHidden: true,
        onmessage(ev) {
          if (ev.data === '[DONE]') {
            setIsStreaming(false)
            onDone()
            return
          }
          try {
            const token = JSON.parse(ev.data)?.choices?.[0]?.delta?.content
            if (token) onToken(token)
          } catch {
            // non-JSON line, skip
          }
        },
        onerror(err) {
          setIsStreaming(false)
          onError(err instanceof Error ? err : new Error(String(err)))
          throw err // prevent auto-retry
        },
        onclose() {
          setIsStreaming(false)
          onDone()
        },
      })
    } catch (err) {
      // console.log(err)
      if ((err as Error)?.name === 'AbortError') return
      setIsStreaming(false)
      onError(err instanceof Error ? err : new Error(String(err)))
    }

  }

  const stopStream = () => {
    abortRef.current?.abort()
    setIsStreaming(false)
    onDone()
  }

  return { sendMessage, stopStream, isStreaming }
}
