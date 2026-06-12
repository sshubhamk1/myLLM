import type { Message } from '@/types/chat'
import UserMessage from './UserMessage'
import AssistantMessage from './AssistantMessage'

interface Props {
  message: Message
}

export default function MessageItem({ message }: Props) {
  if (message.role === 'user') {
    return <UserMessage content={message.content} attachments={message.attachments} />
  }
  return <AssistantMessage content={message.content} />
}
