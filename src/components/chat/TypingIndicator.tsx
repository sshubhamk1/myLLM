export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 rounded-full bg-neutral-400 animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}
