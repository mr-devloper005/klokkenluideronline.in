import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('border border-[var(--editable-border)] bg-white px-8 py-14 text-center shadow-[0_18px_50px_rgba(23,37,31,0.05)]', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[var(--magazine-accent-soft)] text-[var(--magazine-accent-deep)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="editable-display mt-5 text-4xl font-semibold tracking-[-0.03em] text-[var(--magazine-ink)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--magazine-ink)]/65">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 bg-[var(--magazine-accent-deep)] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:opacity-92">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} from the main workspace will appear here automatically. The page layout stays ready even when the feed is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
