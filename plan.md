# LLM Chat Frontend — PLAN.md

## Overview

Production-grade ChatGPT/Gemini-style chat UI for an LM Studio backend.

| | |
|---|---|
| **Backend** | LM Studio at `http://127.0.0.1:1234` (OpenAI-compatible API) |
| **Streaming endpoint** | `POST /v1/chat/completions` with `"stream": true` |
| **Default model** | `google/gemma-4-26b-a4b-qat` |
| **Stack** | React + Vite + TypeScript + Tailwind CSS |
| **Chat history** | In-memory only (clears on refresh) |

---

## Tech Stack

```
npm packages:
  tailwindcss @tailwindcss/vite @tailwindcss/typography
  @microsoft/fetch-event-source          # SSE via POST
  react-markdown remark-gfm              # Markdown rendering
  rehype-highlight highlight.js          # Code syntax highlighting
  lucide-react                           # Icons
  clsx tailwind-merge                    # Utility class merging
```

> `@microsoft/fetch-event-source` is required because native `EventSource` only supports GET,
> but we need POST to send the message body.

---

## File Structure

```
src/
  types/chat.ts              # Role, Message, StreamState types
  config/api.ts              # BASE_URL, DEFAULT_MODEL, buildChatRequest()
  lib/utils.ts               # cn() helper (clsx + tailwind-merge)
  hooks/
    useSSEStream.ts          # Core streaming hook (fetchEventSource + AbortController)
    useAutoScroll.ts         # Auto-scroll-to-bottom with manual override
  components/
    chat/
      ChatPage.tsx           # Stateful orchestrator — owns messages[], streamingContent
      MessageList.tsx        # Scrollable list + live partial message during stream
      MessageItem.tsx        # Routes to UserMessage or AssistantMessage by role
      UserMessage.tsx        # Right-aligned bubble, plain text
      AssistantMessage.tsx   # Left-aligned, ReactMarkdown rendered, copy button
      StreamingCursor.tsx    # Blinking "|" appended while streaming
      TypingIndicator.tsx    # Three bouncing dots shown before first token arrives
    input/
      ChatInputBar.tsx       # Fixed-bottom bar with gradient fade above
      ChatTextarea.tsx       # Auto-resizing textarea, disabled while streaming
      SendButton.tsx         # ArrowUp icon → Square stop icon during stream
    ui/
      CopyButton.tsx         # Clipboard copy with Copy→Check icon flash
      CodeBlock.tsx          # Custom markdown code renderer: lang label + copy
      ScrollToBottomButton.tsx
  App.tsx
  main.tsx
  index.css                  # Tailwind import + @keyframes blink
```

---

## Streaming Architecture

### SSE chunk format (OpenAI-compatible, what LM Studio sends)
```
data: {"id":"...","choices":[{"delta":{"content":"hello"},"index":0}]}
data: [DONE]
```

### `useSSEStream.ts` — key logic
```
sendMessage(messages[]) →
  new AbortController() → stored in ref
  fetchEventSource(POST /v1/chat/completions, {
    body: { model, messages, stream: true },
    signal: abortController.signal,
    onmessage(ev) {
      if ev.data === '[DONE]' → onDone(); return
      token = JSON.parse(ev.data).choices[0]?.delta?.content ?? ''
      onToken(token)
    },
    onerror(err) { onError(err); throw err }  // throw prevents auto-retry
  })

stopStream() → abortController.abort() → onDone()
```

### `ChatPage.tsx` — state flow
```
state: messages[], streamingContent, isStreaming

submit →
  append user Message to messages[]
  set isStreaming=true, streamingContent=''
  call sendMessage()

onToken(t) → streamingContent += t

onDone() →
  push assistant Message(streamingContent) to messages[]
  clear streamingContent
  set isStreaming=false
```

### `MessageList.tsx` — live render during stream
```
if isStreaming && streamingContent === '' → show <TypingIndicator>
if isStreaming && streamingContent !== '' → show <AssistantMessage isStreaming={true}>
                                              └─ AssistantMessage appends <StreamingCursor>
```

---

## UI Design

### Color palette (dark, ChatGPT-inspired)

| Element | Tailwind |
|---|---|
| Page background | `bg-neutral-900` |
| User message bubble | `bg-neutral-700 rounded-2xl rounded-br-md` |
| Input bar | `bg-neutral-800 border border-neutral-600 rounded-2xl` |
| Primary text | `text-neutral-100` |
| Secondary text | `text-neutral-400` |
| Code block bg | `bg-neutral-950` |
| Code block header | `bg-neutral-800` |

### Layout
```
h-screen flex flex-col bg-neutral-900
├── Header (h-14, border-b border-neutral-800) — title centered
├── MessageList (flex-1 overflow-y-auto)
│   └── max-w-3xl mx-auto px-4 py-6, gap-6 between messages
└── Input area (sticky bottom)
    ├── gradient fade (bg-gradient-to-t from-neutral-900, h-12)
    └── max-w-3xl mx-auto px-4 pb-4
```

### Animations

| Animation | Mechanism |
|---|---|
| Streaming cursor | `@keyframes blink` — opacity 0↔1, `step-end`, 1s |
| Typing dots | `animate-bounce` + staggered `animation-delay` (0/150/300ms) |
| Copy button | Copy→Check icon swap, reverts after 2s |
| Message appear | `fade-in` + `slide-in-from-bottom-2` on mount |

**Font:** Inter (Google Fonts), `system-ui` fallback
**Markdown:** `prose prose-invert prose-neutral max-w-none` via `@tailwindcss/typography`

---

## Execution Phases

### Phase 0 — Setup
- [x] Write PLAN.md to project root
- [ ] Create task tracking

### Phase 1 — Scaffold
- `npm create vite@latest . -- --template react-ts && npm install`
- Install all dependencies
- Configure Tailwind v4 plugin in `vite.config.ts`
- `@import "tailwindcss"` in `index.css`
- Add Inter font to `index.html`
- **Verify:** `npm run dev` → dark blank page, zero console errors

### Phase 2 — Foundation files
- `src/types/chat.ts` — Role, Message, StreamState
- `src/lib/utils.ts` — `cn()` helper
- `src/config/api.ts` — BASE_URL, DEFAULT_MODEL, `buildChatRequest()`

### Phase 3 — Static UI
- All chat + input components (no streaming logic yet)
- Hardcode 2-3 messages in `ChatPage` to verify layout
- **Verify:** right/left alignment, markdown renders, code blocks show lang + copy

### Phase 4 — Streaming
- `useSSEStream.ts`
- Wire into `ChatPage.tsx` — replace hardcoded messages with real state+stream flow
- `StreamingCursor.tsx`, `TypingIndicator.tsx`
- **Verify:** tokens stream in, cursor blinks, input disabled during stream, stop button aborts

### Phase 5 — Polish
- `useAutoScroll.ts` + `ScrollToBottomButton.tsx`
- Message appear animations
- Send↔Stop button icon transition
- Empty input submit guard
- **Verify:** all edge cases (stop mid-stream, scroll up mid-stream, resize)

### Phase 6 — Build check
- `npm run build` — zero TS errors
- `npm run preview` — smoke test production build

---

## Verification Checklist

- [ ] Dark page renders, no console errors
- [ ] Messages left/right aligned correctly
- [ ] Markdown + code blocks render with syntax highlighting
- [ ] Tokens stream progressively to UI
- [ ] Streaming cursor visible during stream
- [ ] Typing indicator shown before first token arrives
- [ ] Input disabled + grayed out during stream
- [ ] Stop button aborts stream, preserves partial content
- [ ] New message can be sent after stop/done
- [ ] Auto-scroll tracks to bottom during stream
- [ ] ScrollToBottom button appears on manual scroll-up mid-stream
- [ ] Empty input submit blocked
- [ ] `npm run build` passes cleanly
