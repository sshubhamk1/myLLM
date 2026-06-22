import { useState } from 'react'
import { Cpu } from 'lucide-react'
import { DEFAULT_MODEL } from '@/config/api'
import { cn } from '@/lib/utils'

type OptionId = 'default' | 'custom'

interface Props {
  onSelect: (model: string) => void
}

export default function ModelSelector({ onSelect }: Props) {
  const [selected, setSelected] = useState<OptionId>('default')
  const [customModel, setCustomModel] = useState('')

  const resolvedModel = selected === 'custom' ? customModel.trim() : DEFAULT_MODEL
  const canConnect = selected !== 'custom' || customModel.trim().length > 0

  const handleConnect = () => {
    if (!canConnect) return
    onSelect(resolvedModel)
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-neutral-900 px-4 pt-safe pb-safe">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white shadow-lg">
          AI
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-100">MyLLM</h1>
          <p className="mt-1 text-sm text-neutral-400">Choose a model</p>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {/* Default option */}
        <button
          onClick={() => setSelected('default')}
          className={cn(
            'w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-150',
            selected === 'default'
              ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500'
              : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600',
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              selected === 'default'
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-neutral-500',
            )}>
              {selected === 'default' && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-neutral-100">Default</span>
              <p className="mt-0.5 truncate font-mono text-xs text-neutral-500">{DEFAULT_MODEL}</p>
            </div>
          </div>
        </button>

        {/* Custom option */}
        <button
          onClick={() => setSelected('custom')}
          className={cn(
            'w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-150',
            selected === 'custom'
              ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500'
              : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600',
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              selected === 'custom'
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-neutral-500',
            )}>
              {selected === 'custom' && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-neutral-100">Custom</span>
              <p className="mt-0.5 text-xs text-neutral-400">Enter a model name manually</p>
            </div>
          </div>

          {selected === 'custom' && (
            <div className="mt-3" onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={customModel}
                onChange={e => setCustomModel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleConnect()}
                placeholder="e.g. meta-llama/Llama-3.1-8B-Instruct"
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
      </div>

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
          <Cpu size={16} />
          Continue
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-neutral-600">
        Model name must match exactly what is loaded in LM Studio
      </p>
    </div>
  )
}
