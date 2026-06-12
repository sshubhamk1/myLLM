# MyLLM

A production-grade, ChatGPT-style chat interface for locally running LLMs via [LM Studio](https://lmstudio.ai). Streams responses token-by-token, supports multimodal input (images + documents), and works on both desktop and mobile browsers.

---

## Features

- **Streaming responses** — tokens render as they arrive via Server-Sent Events; input is locked until the stream completes
- **Stop generation** — cancel a stream mid-way and keep the partial response
- **Multimodal attachments** — attach images, PDFs, Word docs, or text files alongside your message
- **Markdown rendering** — assistant responses render bold, lists, tables, and fenced code blocks with syntax highlighting
- **Code blocks** — language label + one-click copy on every code block
- **Auto-scroll** — follows the stream to the bottom; a scroll-to-bottom button appears if you scroll up mid-stream
- **Mobile-first** — respects iOS/Android safe areas (notch, Dynamic Island, home indicator), uses `dvh` units, and prevents iOS auto-zoom on input focus
- **Network access** — backend URL resolves dynamically from `window.location.hostname`, so the app works when accessed from other devices on the same network

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| Icons | lucide-react |
| SSE streaming | `@microsoft/fetch-event-source` |
| Markdown | react-markdown + remark-gfm |
| Syntax highlight | rehype-highlight + highlight.js |
| PDF parsing | pdfjs-dist (lazy-loaded) |
| DOCX parsing | mammoth (lazy-loaded) |

---

## Prerequisites

- **Node.js** 18+
- **LM Studio** running locally with a model loaded and the local server started (`Developer` tab → `Start Server`)

LM Studio exposes an OpenAI-compatible API on port `1234` by default.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (accessible on your local network)
npm run dev
```

Open `http://localhost:5174` in your browser (or `http://<your-machine-ip>:5174` from another device on the same network).

### Production build

```bash
npm run build    # type-check + bundle
npm run preview  # serve the dist/ folder locally
```

---

## Configuration

All backend config lives in one file: `src/config/api.ts`

```ts
// Backend URL — dynamically resolves to the same host the page is served from
export const BASE_URL = `${window.location.protocol}//${window.location.hostname}:1234`

// Model to use — must match exactly what is loaded in LM Studio
export const DEFAULT_MODEL = 'google/gemma-4-26b-a4b-qat'
```

**To point at a fixed IP** (e.g. when testing from a different subnet), comment out the dynamic line and uncomment one of the alternatives:

```ts
// export const BASE_URL = 'http://127.0.0.1:1234'      // localhost only
// export const BASE_URL = 'http://192.168.1.8:1234'     // fixed LAN IP
// export const BASE_URL = 'http://shubhapp.local:1234'  // mDNS hostname
export const BASE_URL = `${window.location.protocol}//${window.location.hostname}:1234`
```

---

## Supported Attachments

| Type | Extensions | How it's sent to the model |
|---|---|---|
| Images | jpg, jpeg, png, gif, webp | Base64 `image_url` — OpenAI multimodal format |
| PDF | pdf | Text extracted (all pages) via pdfjs-dist |
| Word document | docx, doc | Text extracted via mammoth |
| Plain text | txt, md, csv, json, xml, yaml, yml | Raw text content |

> **Note:** Image understanding requires a vision-capable model (e.g. Gemma 4, LLaVA). Text/document files are converted to text before sending, so any model can read them.

Attachment size limit: **20 MB per file**. PDF and DOCX parsers are lazy-loaded — they're only downloaded the first time a user attaches one.

---

## Project Structure

```
src/
├── config/
│   └── api.ts                  # Backend URL, model name, request builder
├── types/
│   └── chat.ts                 # Message, Attachment, Role, StreamState types
├── lib/
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
├── hooks/
│   ├── useSSEStream.ts         # Core streaming hook — wraps fetchEventSource
│   └── useAutoScroll.ts        # Auto-scroll with manual-override detection
└── components/
    ├── chat/
    │   ├── ChatPage.tsx        # Root stateful component — owns all chat state
    │   ├── MessageList.tsx     # Scrollable message container
    │   ├── MessageItem.tsx     # Routes to UserMessage or AssistantMessage
    │   ├── UserMessage.tsx     # Right-aligned bubble with attachment previews
    │   ├── AssistantMessage.tsx# Left-aligned, markdown-rendered response
    │   ├── StreamingCursor.tsx # Blinking cursor shown at end of live stream
    │   └── TypingIndicator.tsx # Three dots shown before first token arrives
    ├── input/
    │   ├── ChatInputBar.tsx    # Fixed bottom bar — composes all input controls
    │   ├── ChatTextarea.tsx    # Auto-resizing textarea (16px font to avoid iOS zoom)
    │   ├── SendButton.tsx      # Send / Stop toggle button
    │   ├── AttachButton.tsx    # Paperclip — opens file picker, reads files
    │   └── AttachmentPreview.tsx # Staged attachment chips/thumbnails before send
    └── ui/
        ├── CodeBlock.tsx       # Custom markdown code renderer with copy button
        ├── CopyButton.tsx      # Clipboard copy with Check flash
        └── ScrollToBottomButton.tsx
```

---

## How Streaming Works

The app uses `POST /v1/chat/completions` with `"stream": true`, which returns an OpenAI-compatible SSE stream:

```
data: {"choices":[{"delta":{"content":"Hello"},"index":0}]}
data: {"choices":[{"delta":{"content":" world"},"index":0}]}
data: [DONE]
```

`useSSEStream` (`src/hooks/useSSEStream.ts`) handles this with `fetchEventSource` from `@microsoft/fetch-event-source`. The native `EventSource` API only supports GET — this library supports POST with an `AbortSignal` for cancellation.

**State flow in `ChatPage`:**

```
user submits
  → append user Message to messages[]
  → isStreaming = true, streamingContent = ''
  → call sendMessage(messages)
      ↓
  onToken(t)  →  streamingContent += t  (re-renders live)
      ↓
  onDone()    →  push final assistant Message, clear streamingContent, isStreaming = false
```

The live partial response is rendered as a separate `<AssistantMessage isStreaming={true}>` below the committed messages. On `onDone` it gets promoted to a proper message in the list.

---

## Multimodal Message Format

When the user attaches images, the message `content` field becomes an array (OpenAI vision format):

```json
{
  "role": "user",
  "content": [
    { "type": "text", "text": "What's in this image?" },
    { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,..." } }
  ]
}
```

For text/PDF/DOCX attachments the extracted text is prepended to the message as a labelled code block:

```
[File: report.pdf]
```
<extracted text here>
```

User's question here
```

This keeps the message content as a plain string, compatible with all models.

---

## Mobile Notes

The app is designed to work correctly on iOS Safari and Android Chrome:

- `viewport-fit=cover` + `env(safe-area-inset-*)` — content respects the notch, Dynamic Island, and home indicator
- `height: 100dvh` — uses the dynamic viewport height so the layout collapses correctly when the mobile browser toolbar appears/disappears
- `overscroll-behavior: none` on body — prevents rubber-band scroll leaking outside the chat
- `text-base` (16px) on the textarea — prevents iOS Safari from auto-zooming when the input is focused
- `-webkit-overflow-scrolling: touch` on the message list — enables momentum scrolling on iOS

---

## Troubleshooting

**"Error: Failed to fetch" or network error**
- Make sure LM Studio's local server is running (`Developer` tab → `Start Server`)
- Check that the model is loaded and the server shows `Running` status
- If accessing from another device, ensure both are on the same network and the `BASE_URL` in `api.ts` resolves correctly

**Model doesn't understand images**
- Image understanding requires a multimodal/vision model. Switch to a vision-capable model in LM Studio (e.g. a Gemma, LLaVA, or Qwen-VL variant)

**PDF/DOCX text looks garbled**
- Scanned PDFs (image-only) have no embedded text — pdfjs-dist can only extract text from PDFs with a proper text layer
- Password-protected files cannot be read

**iOS keyboard covers the input**
- This is expected on older iOS versions. The `dvh` units and `flex` layout should handle it on iOS 15.4+ (Safari 15.4+)
