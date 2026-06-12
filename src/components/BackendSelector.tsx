import { useState } from 'react'
import { Wifi } from 'lucide-react'
import { BASE_URL } from '@/config/api'
import { cn } from '@/lib/utils'

type OptionId = 'default' | 'local' | 'custom'

interface Option {
  id: OptionId
  label: string
  description: string
  url?: string
}

const OPTIONS: Option[] = [
  {
    id: 'default',
    label: 'Default',
    description: 'Same host as this page',
    url: BASE_URL,
  },
  {
    id: 'local',
    label: 'Local Network',
    description: 'mDNS hostname',
    url: 'http://shubhapp.local:1234',
  },
  {
    id: 'custom',
    label: 'Custom',
    description: 'Enter a backend URL manually',
  },
]

interface Props {
  onSelect: (url: string) => void
}

export default function BackendSelector({ onSelect }: Props) {
  const [selected, setSelected] = useState<OptionId>('default')
  const [customUrl, setCustomUrl] = useState('')

  const resolvedUrl =
    selected === 'custom'
      ? customUrl.trim()
      : OPTIONS.find(o => o.id === selected)!.url!

  const canConnect = selected !== 'custom' || customUrl.trim().startsWith('http')

  const handleConnect = () => {
    if (!canConnect) return
    onSelect(resolvedUrl)
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-neutral-900 px-4 pt-safe pb-safe">
      {/* Logo + title */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white shadow-lg">
          AI
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-100">MyLLM</h1>
          <p className="mt-1 text-sm text-neutral-400">Choose your LM Studio backend</p>
        </div>
      </div>

      {/* Options */}
      <div className="w-full max-w-sm space-y-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={cn(
              'w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-150',
              selected === opt.id
                ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500'
                : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600',
            )}
          >
            <div className="flex items-center gap-3">
              {/* Radio dot */}
              <div className={cn(
                'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                selected === opt.id
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-neutral-500',
              )}>
                {selected === opt.id && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-neutral-100">{opt.label}</span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-400">{opt.description}</p>
                {opt.url && (
                  <p className="mt-0.5 truncate font-mono text-xs text-neutral-500">{opt.url}</p>
                )}
              </div>
            </div>

            {/* Custom URL input — inlined inside the card */}
            {opt.id === 'custom' && selected === 'custom' && (
              <div className="mt-3" onClick={e => e.stopPropagation()}>
                <input
                  type="url"
                  value={customUrl}
                  onChange={e => setCustomUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleConnect()}
                  placeholder="http://192.168.1.x:1234"
                  autoFocus
                  className={cn(
                    'w-full rounded-lg border bg-neutral-900 px-3 py-2',
                    'font-mono text-sm text-neutral-100 placeholder-neutral-600',
                    'border-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500',
                  )}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Connect button */}
      <div className="mt-6 w-full max-w-sm">
        <button
          onClick={handleConnect}
          disabled={!canConnect}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-150',
            canConnect
              ? 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98]'
              : 'cursor-not-allowed bg-neutral-700 text-neutral-500',
          )}
        >
          <Wifi size={16} />
          Connect
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-neutral-600">
        Make sure LM Studio's local server is running
      </p>
    </div>
  )
}
