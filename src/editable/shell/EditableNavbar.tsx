'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const utilityLinks = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Write For Us', href: '/create' },
  { label: 'Guest Post', href: '/create' },
  { label: 'About Us', href: '/about' },
  { label: 'Search', href: '/search' },
  { label: 'Join Us', href: '/signup' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const taskLinks = useMemo(
    () =>
      SITE_CONFIG.tasks
        .filter((task) => task.enabled && task.key !== 'listing' && task.key !== 'image')
        .slice(0, 6)
        .map((task) => ({ label: task.label, href: task.route })),
    []
  )

  const navItems = [
    { label: 'Home', href: '/' },
    ...taskLinks,
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-md">
      <div className="bg-[var(--magazine-accent-deep)] text-white">
        <div className="mx-auto flex max-w-[var(--editable-container)] items-center justify-between gap-4 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] sm:px-6 lg:px-8">
          <div className="hidden flex-wrap items-center gap-5 lg:flex">
            {utilityLinks.map((item) => (
              <Link key={item.href} href={item.href} className="opacity-90 transition hover:opacity-100">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[98px] items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--editable-border)] bg-white/70 text-[var(--magazine-ink)] lg:h-12 lg:w-12"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="mx-auto flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-14 w-auto object-contain sm:h-16" />
              <span className="editable-display text-[2.4rem] font-semibold leading-none text-[var(--magazine-accent-deep)] sm:text-[3rem]">
                {SITE_CONFIG.name.split('.')[0]}
              </span>
            </div>
            <span className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.34em] text-[var(--magazine-accent)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="hidden h-11 w-11 items-center justify-center border border-[var(--editable-border)] bg-white/70 text-[var(--magazine-ink)] transition hover:border-[var(--magazine-accent)] md:inline-flex"
            >
              <Search className="h-4 w-4" />
            </Link>
            {session ? (
              <Link
                href="/create"
                className="hidden items-center gap-2 border border-[var(--magazine-ink)] bg-white px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--magazine-ink)] transition hover:bg-[var(--magazine-accent-deep)] hover:text-white sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Publish
              </Link>
            ) : (
              <Link
                href="/signup"
                className="hidden border border-[var(--editable-border)] bg-white px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--magazine-ink)] transition hover:border-[var(--magazine-accent)] sm:inline-flex"
              >
                Subscribe
              </Link>
            )}
          </div>
        </div>

        <nav className="hidden items-center justify-center gap-4 border-t border-[var(--editable-border)] lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-6 py-5 text-[0.98rem] font-semibold transition ${
                  active ? 'text-[var(--magazine-ink)]' : 'text-[var(--magazine-ink)]/78 hover:text-[var(--magazine-accent-deep)]'
                }`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-4 bottom-0 h-[3px] bg-[var(--magazine-accent)]" /> : null}
              </Link>
            )
          })}
        </nav>

        {open ? (
          <div className="border-t border-[var(--editable-border)] py-4 lg:hidden">
            <form action="/search" className="mb-4 flex items-center gap-2 border border-[var(--editable-border)] bg-white px-4 py-3">
              <Search className="h-4 w-4 text-[var(--magazine-accent-deep)]" />
              <input
                name="q"
                type="search"
                placeholder="Search stories, visuals, and listings"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--magazine-ink)]/45"
              />
            </form>

            <div className="grid gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 text-sm font-semibold ${
                      active ? 'bg-[var(--magazine-accent-soft)] text-[var(--magazine-accent-deep)]' : 'text-[var(--magazine-ink)]/82'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}

              {session ? (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-semibold text-[var(--magazine-ink)]/82">
                    Create
                  </Link>
                  <button type="button" onClick={logout} className="px-4 py-3 text-left text-sm font-semibold text-[var(--magazine-ink)]/82">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--magazine-ink)]/82">
                    <LogIn className="h-4 w-4" /> Login
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--magazine-ink)]/82">
                    <UserPlus className="h-4 w-4" /> Sign up
                  </Link>
                </>
              )}

              <div className="mt-3 flex flex-wrap gap-2 px-4">
                {utilityLinks.slice(0, 4).map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-full border border-[var(--editable-border)] px-3 py-1.5 text-xs font-semibold text-[var(--magazine-ink)]/70">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
