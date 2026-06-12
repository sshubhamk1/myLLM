import { useState } from 'react'
import BackendSelector from '@/components/BackendSelector'
import ChatPage from '@/components/chat/ChatPage'

export default function App() {
  const [baseUrl, setBaseUrl] = useState<string | null>(null)

  if (!baseUrl) {
    return <BackendSelector onSelect={setBaseUrl} />
  }

  return <ChatPage baseUrl={baseUrl} />
}
