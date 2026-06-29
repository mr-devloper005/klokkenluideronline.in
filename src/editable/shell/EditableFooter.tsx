'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const footerLinks = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Write For Us', href: '/create' },
  { label: 'Guest Post', href: '/create' },
  { label: 'About Us', href: '/about' },
  { label: 'Search', href: '/search' },
  { label: 'Join Us', href: '/signup' },
]

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto flex max-w-[var(--editable-container)] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-12 w-auto object-contain" />
              <p className="editable-display text-3xl font-semibold text-white">{SITE_CONFIG.name.split('.')[0]}</p>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-7 text-white/64">
              Clean reading, visual discovery, and practical updates gathered into one magazine-style experience.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-white/70">{SITE_CONFIG.name} © {year}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-white/86 transition hover:text-white">
                {item.label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="text-left text-white/86 transition hover:text-white">
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
