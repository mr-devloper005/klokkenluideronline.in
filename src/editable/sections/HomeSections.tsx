import Link from 'next/link'
import { ArrowRight, CalendarDays, ChevronRight, MessageSquare, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

type HomePost = SitePost & { taskKey?: TaskKey; route?: string }

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'
function getExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Feature'
}

function dateOf(post?: SitePost | null) {
  const value = post?.publishedAt || post?.createdAt || ''
  if (!value) return 'Latest update'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Latest update'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function dedupePosts(posts: HomePost[]) {
  const seen = new Set<string>()
  const out: HomePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function enrichPosts(primaryTask: TaskKey, primaryRoute: string, posts: SitePost[], timeSections: HomeTimeSection[]) {
  const sectionMapped = timeSections.flatMap((section) =>
    section.posts.map((post) => ({
      ...post,
      taskKey: primaryTask,
      route: section.href || primaryRoute,
    }))
  )

  return dedupePosts([
    ...posts.map((post) => ({ ...post, taskKey: primaryTask, route: primaryRoute })),
    ...sectionMapped,
  ])
}

function HomeCardMeta({ post }: { post: SitePost }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-white/82">
      <span>{SITE_CONFIG.name}</span>
      <span className="h-1 w-1 rounded-full bg-white/60" />
      <span>{dateOf(post)}</span>
    </div>
  )
}

function FeaturedOverlayCard({ post, href, className = '' }: { post: SitePost; href: string; className?: string }) {
  return (
    <Link href={href} className={`group relative block min-h-[300px] overflow-hidden ${className}`}>
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,10,0.08)_0%,rgba(7,11,10,0.85)_76%)]" />
      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
        <span className="w-fit bg-[var(--magazine-accent-deep)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white">
          {categoryOf(post)}
        </span>
        <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[0.95] text-white sm:text-5xl lg:text-[3.4rem]">
          {post.title}
        </h2>
        <HomeCardMeta post={post} />
      </div>
    </Link>
  )
}

function SmallOverlayCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative block min-h-[240px] overflow-hidden">
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,14,14,0.15)_20%,rgba(11,14,14,0.88)_100%)]" />
      <div className="relative flex h-full flex-col justify-end p-5">
        <span className="w-fit bg-[var(--magazine-accent)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
          {categoryOf(post)}
        </span>
        <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">{post.title}</h3>
        <p className="mt-2 text-xs text-white/78">{SITE_CONFIG.name} — {dateOf(post)}</p>
      </div>
    </Link>
  )
}

function CompactEditorialCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid gap-6 border-b border-[var(--editable-border)] py-6 sm:grid-cols-[248px_minmax(0,1fr)]">
      <div className="aspect-[4/3] overflow-hidden bg-[#dfe5db]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--magazine-accent)]">{categoryOf(post)}</p>
        <h3 className="mt-3 text-3xl font-semibold leading-[1.05] text-[var(--magazine-ink)]">{post.title}</h3>
        <p className="mt-3 text-sm font-semibold text-[var(--magazine-ink)]/76">{SITE_CONFIG.name} — {dateOf(post)}</p>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[var(--magazine-ink)]/76">{getExcerpt(post, 150)}</p>
      </div>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block bg-white">
      <div className="aspect-[5/4] overflow-hidden bg-[#e2e7dc]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="px-6 py-5 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--magazine-accent)]">{categoryOf(post)}</p>
        <h3 className="mx-auto mt-3 max-w-xl text-4xl font-semibold leading-[1.02] text-[var(--magazine-ink)]">{post.title}</h3>
        <p className="mt-4 text-sm text-[var(--magazine-ink)]/62">{dateOf(post)} — By {SITE_CONFIG.name}</p>
      </div>
    </Link>
  )
}

function HorizontalStory({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid gap-6 py-6 sm:grid-cols-[292px_minmax(0,1fr)]">
      <div className="aspect-[16/10] overflow-hidden bg-[#dde4d6]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--magazine-accent)]">{categoryOf(post)}</p>
        <h3 className="mt-3 text-[2rem] font-semibold leading-[1.02] text-[var(--magazine-ink)]">{post.title}</h3>
        <p className="mt-3 text-sm font-semibold text-[var(--magazine-ink)]/76">By {SITE_CONFIG.name} — {dateOf(post)}</p>
        <p className="mt-4 text-[15px] leading-7 text-[var(--magazine-ink)]/74">{getExcerpt(post, 140)}</p>
      </div>
    </Link>
  )
}

function SidebarPanel() {
  return (
    <aside className="space-y-8">
      <div className="border border-[var(--editable-border)] bg-white p-8 shadow-[0_20px_50px_rgba(19,32,28,0.06)]">
        <h3 className="editable-display text-4xl font-semibold text-[var(--magazine-ink)]">Subscribe to Updates</h3>
        <p className="mt-4 text-center text-base leading-8 text-[var(--magazine-ink)]/72">
          Get practical reading picks, visual features, and new discoveries from {SITE_CONFIG.name}.
        </p>
        <form action="/signup" className="mt-7 space-y-4">
          <input
            type="email"
            placeholder="Your email address.."
            className="h-12 w-full border border-[var(--editable-border)] bg-[var(--magazine-paper)] px-4 text-sm outline-none placeholder:text-[var(--magazine-ink)]/40"
          />
          <button className="flex h-12 w-full items-center justify-center bg-[var(--magazine-accent-deep)] text-sm font-extrabold uppercase tracking-[0.16em] text-white transition hover:opacity-92">
            Subscribe
          </button>
          <label className="flex items-start gap-3 text-sm leading-6 text-[var(--magazine-ink)]/58">
            <input type="checkbox" className="mt-1 h-4 w-4 border border-[var(--editable-border)]" />
            By signing up, you agree to our terms and privacy policy agreement.
          </label>
        </form>
      </div>

      <div className="border border-[var(--editable-border)] bg-[#eff3ea] p-7">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--magazine-accent)]">Search the archive</p>
        <form action="/search" className="mt-4 flex border border-[var(--editable-border)] bg-white">
          <input name="q" type="search" placeholder="Search by topic" className="h-12 min-w-0 flex-1 px-4 text-sm outline-none placeholder:text-[var(--magazine-ink)]/42" />
          <button className="flex w-14 items-center justify-center bg-[var(--magazine-accent-deep)] text-white" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>
    </aside>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = enrichPosts(primaryTask, primaryRoute, posts, timeSections)
  const [feature, sideTop, sideBottomLeft, sideBottomRight] = feed

  if (!feature) return null

  return (
    <section className="bg-[var(--magazine-paper)]">
      <div className={`${container} py-6`}>
        <div className="grid gap-[2px] overflow-hidden bg-[var(--editable-border)] lg:grid-cols-[1.25fr_1fr]">
          <FeaturedOverlayCard
            post={feature}
            href={postHref(feature.taskKey || primaryTask, feature, feature.route || primaryRoute)}
            className="min-h-[420px] bg-white lg:min-h-[550px]"
          />

          <div className="grid gap-[2px] bg-[var(--editable-border)]">
            {sideTop ? <SmallOverlayCard post={sideTop} href={postHref(sideTop.taskKey || primaryTask, sideTop, sideTop.route || primaryRoute)} /> : <div className="min-h-[240px] bg-white" />}
            <div className="grid gap-[2px] md:grid-cols-2">
              {sideBottomLeft ? <SmallOverlayCard post={sideBottomLeft} href={postHref(sideBottomLeft.taskKey || primaryTask, sideBottomLeft, sideBottomLeft.route || primaryRoute)} /> : <div className="min-h-[240px] bg-white" />}
              {sideBottomRight ? <SmallOverlayCard post={sideBottomRight} href={postHref(sideBottomRight.taskKey || primaryTask, sideBottomRight, sideBottomRight.route || primaryRoute)} /> : <div className="min-h-[240px] bg-white" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = enrichPosts(primaryTask, primaryRoute, posts, timeSections).slice(4, 8)
  if (!feed.length) return null

  return (
    <section className="bg-white">
      <div className={`${container} py-14`}>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="border-r-0 border-[var(--editable-border)] lg:border-r lg:pr-8">
            {feed.slice(0, 3).map((post) => (
              <CompactEditorialCard
                key={post.slug || post.id}
                post={post}
                href={postHref(post.taskKey || primaryTask, post, post.route || primaryRoute)}
              />
            ))}
          </div>

          <div className="lg:pl-4">
            {feed[3] ? (
              <ImageFirstCard post={feed[3]} href={postHref(feed[3].taskKey || primaryTask, feed[3], feed[3].route || primaryRoute)} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = enrichPosts(primaryTask, primaryRoute, posts, timeSections)
  const editorial = feed.slice(8, 14)
  if (!editorial.length) return null

  return (
    <section className="bg-white">
      <div className={`${container} py-8`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="mb-6 flex items-center gap-5">
              <h2 className="editable-display text-4xl font-semibold text-[var(--magazine-ink)]">
                Mixed <span className="text-[var(--magazine-accent)]">List</span>
              </h2>
              <span className="h-px flex-1 bg-[var(--editable-border)]" />
            </div>

            <div className="divide-y divide-[var(--editable-border)]">
              {editorial.map((post) => (
                <HorizontalStory
                  key={post.slug || post.id}
                  post={post}
                  href={postHref(post.taskKey || primaryTask, post, post.route || primaryRoute)}
                />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link href={primaryRoute} className="inline-flex items-center gap-2 border border-[var(--editable-border)] bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--magazine-ink)] transition hover:border-[var(--magazine-accent)] hover:text-[var(--magazine-accent-deep)]">
                Load more <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <SidebarPanel />
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = enrichPosts(primaryTask, primaryRoute, posts, timeSections)
  const strips = [
    { title: 'Fresh Reading', items: feed.slice(14, 18) },
    { title: 'Editor Picks', items: feed.slice(18, 22) },
  ].filter((section) => section.items.length)

  if (!strips.length) return null

  return (
    <>
      {strips.map((section, index) => (
        <section key={section.title} className={index % 2 === 0 ? 'bg-[#f3f5ef]' : 'bg-white'}>
          <div className={`${container} py-14`}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--magazine-accent)]">
                  <span className="inline-flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" /> Curated section</span>
                </p>
                <h2 className="editable-display mt-3 text-4xl font-semibold text-[var(--magazine-ink)]">{section.title}</h2>
              </div>
              <Link href={primaryRoute} className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--magazine-accent-deep)]">
                Browse all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {section.items.map((post) => (
                <Link
                  key={post.slug || post.id}
                  href={postHref(post.taskKey || primaryTask, post, post.route || primaryRoute)}
                  className="group overflow-hidden border border-[var(--editable-border)] bg-white shadow-[0_18px_45px_rgba(23,37,31,0.05)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#dfe6d7]">
                    <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--magazine-accent)]">{categoryOf(post)}</p>
                    <h3 className="mt-3 text-[1.65rem] font-semibold leading-[1.04] text-[var(--magazine-ink)]">{post.title}</h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--magazine-ink)]/72">{getExcerpt(post, 110)}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--magazine-accent-deep)]">
                      Continue reading <MessageSquare className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--magazine-accent-deep)]">
      <div className={`${container} py-16 text-center`}>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">Stay in the loop</p>
        <h2 className="editable-display mx-auto mt-4 max-w-3xl text-5xl font-semibold leading-[0.96] text-white">
          Discover thoughtful updates, useful listings, and image-led stories in one place.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/82">
          Explore the latest additions, move across categories, and keep a clean reading rhythm on every screen.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white px-7 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--magazine-accent-deep)]">
            Subscribe now
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 border border-white/28 px-7 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
