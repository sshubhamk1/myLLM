import { useState } from 'react'
import BackendSelector from '@/components/BackendSelector'
import ModelSelector from '@/components/ModelSelector'
import ChatPage from '@/components/chat/ChatPage'

export default function App() {
  const [baseUrl, setBaseUrl] = useState<string | null>(null)
  const [model, setModel] = useState<string | null>(null)

  if (!baseUrl) return <BackendSelector onSelect={setBaseUrl} />
  if (!model) return <ModelSelector onSelect={setModel} />
  return <ChatPage baseUrl={baseUrl} model={model} />
}
