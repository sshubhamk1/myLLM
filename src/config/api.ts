import type { Message } from '@/types/chat'

// export const BASE_URL = 'http://127.0.0.1:1234'
// export const BASE_URL = 'http://shubhapp.local:1234'
// export const BASE_URL = 'http://192.168.1.8:1234'
export const BASE_URL = `${window.location.protocol}//${window.location.hostname}:1234`
export const DEFAULT_MODEL = 'google/gemma-4-26b-a4b-qat'

export function buildChatRequest(messages: Message[]) {
  return {
    model: DEFAULT_MODEL,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: true,
  }
}
