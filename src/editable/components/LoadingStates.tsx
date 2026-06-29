import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-[var(--magazine-accent-soft)]', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8', className)} aria-live="polite" aria-busy="true">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--magazine-accent)]">{label}</p>
      <PulseBlock className="mt-6 h-12 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-8 grid gap-[2px] bg-[var(--editable-border)] lg:grid-cols-[1.15fr_0.85fr]">
        <PulseBlock className="min-h-[320px] bg-white" />
        <div className="grid gap-[2px] md:grid-cols-3 lg:grid-cols-1">
          <PulseBlock className="min-h-[180px] bg-white" />
          <PulseBlock className="min-h-[180px] bg-white" />
          <PulseBlock className="min-h-[180px] bg-white" />
        </div>
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-2 xl:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border border-[var(--editable-border)] bg-white p-4">
          <PulseBlock className="h-52 w-full" />
          <PulseBlock className="mt-5 h-4 w-24" />
          <PulseBlock className="mt-4 h-9 w-5/6" />
          <PulseBlock className="mt-3 h-9 w-4/6" />
          <PulseBlock className="mt-5 h-4 w-full" />
          <PulseBlock className="mt-2 h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8', className)} aria-live="polite" aria-busy="true">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--magazine-accent)]">{label}</p>
        <PulseBlock className="mt-5 h-12 w-3/4" />
        <PulseBlock className="mt-4 h-10 w-5/6" />
        <PulseBlock className="mt-7 h-[360px] w-full bg-white" />
        <PulseBlock className="mt-7 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
      <div className="border border-[var(--editable-border)] bg-white p-6">
        <PulseBlock className="h-40 w-full" />
        <PulseBlock className="mt-5 h-4 w-28" />
        <PulseBlock className="mt-3 h-8 w-4/5" />
        <PulseBlock className="mt-6 h-11 w-full" />
      </div>
    </div>
  )
}
