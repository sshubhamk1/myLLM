import { useCallback, useEffect, useRef, useState } from 'react'

export function useAutoScroll(dependency: unknown) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const userScrolledUp = useRef(false)

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    userScrolledUp.current = false
    setShowScrollButton(false)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      const threshold = 100
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
      userScrolledUp.current = !atBottom
      setShowScrollButton(!atBottom)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (userScrolledUp.current) return
    const el = containerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [dependency])

  return { containerRef, showScrollButton, scrollToBottom }
}
