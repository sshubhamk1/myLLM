export type Role = 'user' | 'assistant'

export interface Attachment {
  id: string
  type: 'image' | 'file'
  name: string
  mimeType: string
  /** base64 data URL for images; raw text content for text files */
  data: string
}

export interface Message {
  id: string
  role: Role
  content: string
  attachments?: Attachment[]
  createdAt: Date
}

export interface StreamState {
  isStreaming: boolean
  error: string | null
}
