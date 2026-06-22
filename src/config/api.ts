import type { Message } from '@/types/chat'

// export const BASE_URL = 'http://127.0.0.1:1234'
// export const BASE_URL = 'http://shubhapp.local:1234'
// export const BASE_URL = 'http://192.168.1.8:1234'
export const BASE_URL = `${window.location.protocol}//${window.location.hostname}:1234`
export const DEFAULT_MODEL = 'google/gemma-4-26b-a4b-qat'

type TextPart = { type: 'text'; text: string }
type ImagePart = { type: 'image_url'; image_url: { url: string } }

function buildContent(msg: Message): string | (TextPart | ImagePart)[] {
  const images = msg.attachments?.filter(a => a.type === 'image') ?? []
  const textFiles = msg.attachments?.filter(a => a.type === 'file') ?? []

  let text = msg.content
  if (textFiles.length > 0) {
    const block = textFiles
      .map(f => `[File: ${f.name}]\n\`\`\`\n${f.data}\n\`\`\``)
      .join('\n\n')
    text = block + (text ? '\n\n' + text : '')
  }

  if (images.length === 0) return text

  const parts: (TextPart | ImagePart)[] = []
  if (text) parts.push({ type: 'text', text })
  for (const img of images) {
    parts.push({ type: 'image_url', image_url: { url: img.data } })
  }
  return parts
}

export function buildChatRequest(messages: Message[], model: string = DEFAULT_MODEL) {
  return {
    model,
    messages: messages.map(m => ({ role: m.role, content: buildContent(m) })),
    stream: true,
  }
}
