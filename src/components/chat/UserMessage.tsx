interface Props {
  content: string
}

export default function UserMessage({ content }: Props) {
  return (
    <div className="flex justify-end message-appear">
      <div className="max-w-[70%] rounded-2xl rounded-br-md bg-neutral-700 px-4 py-3 text-neutral-100 text-sm leading-relaxed whitespace-pre-wrap break-words">
        {content}
      </div>
    </div>
  )
}
