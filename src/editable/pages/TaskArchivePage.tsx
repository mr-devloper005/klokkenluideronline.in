import Link from 'next/link'
import { ArrowRight, ChevronDown, Search } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail) || asText(content.logo)
  return [...media, ...images, ...(image && isUrl(image) ? [image] : [])].filter(Boolean)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const label = taskConfig?.label || task
  const featured = posts[0]
  const secondary = posts.slice(1, 4)
  const listPosts = posts.slice(4)
  const page = pagination.page || 1
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--magazine-paper)] text-[var(--magazine-ink)]">
        <header className="border-b border-[var(--editable-border)] bg-white">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--magazine-accent)]">{label} archive</p>
            <h1 className="editable-display mt-4 max-w-4xl text-5xl font-semibold leading-[0.98] sm:text-6xl">
              {voice?.headline || `Browse ${label}`}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--magazine-ink)]/70">
              {voice?.description || `Explore the latest ${label.toLowerCase()} in a clean magazine layout with search-ready browsing and safe fallbacks for every post.`}
            </p>

            <div className="mt-9 flex flex-col gap-4 border-t border-[var(--editable-border)] pt-6 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-semibold text-[var(--magazine-ink)]/72">
                {posts.length} {posts.length === 1 ? 'story' : 'stories'} • {categoryLabel}
              </p>
              <form action={basePath} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-12 appearance-none border border-[var(--editable-border)] bg-[var(--magazine-paper)] pl-4 pr-11 text-sm font-semibold outline-none"
                    aria-label="Filter category"
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--magazine-ink)]/55" />
                </div>
                <button className="h-12 bg-[var(--magazine-accent-deep)] px-6 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
                  Apply
                </button>
              </form>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-8 sm:px-6 lg:px-8">
          {posts.length ? (
            <>
              <div className="grid gap-[2px] overflow-hidden bg-[var(--editable-border)] lg:grid-cols-[1.15fr_0.85fr]">
                {featured ? <FeaturedArchiveCard post={featured} href={`${basePath}/${featured.slug}`} task={task} /> : <div className="min-h-[360px] bg-white" />}
                <div className="grid gap-[2px] bg-[var(--editable-border)] md:grid-cols-3 lg:grid-cols-1">
                  {secondary.map((post) => <SecondaryArchiveCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} task={task} />)}
                </div>
              </div>

              <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <div className="mb-7 flex items-center gap-5">
                    <h2 className="editable-display text-4xl font-semibold">
                      Latest <span className="text-[var(--magazine-accent)]">Stories</span>
                    </h2>
                    <span className="h-px flex-1 bg-[var(--editable-border)]" />
                  </div>

                  <div className="divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)] bg-white px-0 sm:px-6">
                    {(listPosts.length ? listPosts : posts.slice(1)).map((post) => (
                      <ArchiveListStory
                        key={post.id || post.slug}
                        post={post}
                        href={`${basePath}/${post.slug}`}
                        fallbackLabel={label}
                      />
                    ))}
                  </div>
                </div>

                <aside className="space-y-6">
                  <div className="border border-[var(--editable-border)] bg-white p-7">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--magazine-accent)]">Quick search</p>
                    <form action="/search" className="mt-4 flex border border-[var(--editable-border)] bg-[var(--magazine-paper)]">
                      <input name="q" type="search" placeholder={`Search ${label.toLowerCase()}`} className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" />
                      <button className="flex w-14 items-center justify-center bg-[var(--magazine-accent-deep)] text-white" aria-label="Search">
                        <Search className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  <div className="border border-[var(--editable-border)] bg-[#eff3ea] p-7">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--magazine-accent)]">Browse notes</p>
                    <h3 className="editable-display mt-3 text-3xl font-semibold">Explore what matters this week</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--magazine-ink)]/72">
                      Move through curated results, image-led cards, and classic editorial lists without losing the original post data.
                    </p>
                    <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--magazine-accent-deep)]">
                      Return home <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </aside>
              </div>

              <nav className="mt-14 flex items-center justify-center gap-3 text-sm">
                {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-[var(--editable-border)] bg-white px-6 py-3 font-bold uppercase tracking-[0.12em] text-[var(--magazine-ink)]">Previous</Link> : null}
                <span className="border border-[var(--editable-border)] bg-[var(--magazine-paper)] px-6 py-3 font-semibold text-[var(--magazine-ink)]/68">Page {page} of {pagination.totalPages || 1}</span>
                {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-[var(--editable-border)] bg-white px-6 py-3 font-bold uppercase tracking-[0.12em] text-[var(--magazine-ink)]">Next</Link> : null}
              </nav>
            </>
          ) : (
            <div className="mx-auto max-w-2xl border border-dashed border-[var(--editable-border)] bg-white px-8 py-20 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--magazine-accent)]" />
              <h2 className="editable-display mt-5 text-4xl font-semibold">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--magazine-ink)]/68">Try another category, or check back after new {label.toLowerCase()} are published.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function FeaturedArchiveCard({ post, href, task }: { post: SitePost; href: string; task: TaskKey }) {
  return (
    <Link href={href} className="group relative block min-h-[360px] overflow-hidden bg-white lg:min-h-[520px]">
      <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.86))]" />
      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
        <span className="w-fit bg-[var(--magazine-accent-deep)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
          {getCategory(post, getTaskConfig(task)?.label || task)}
        </span>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.96] text-white sm:text-5xl">{post.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function SecondaryArchiveCard({ post, href, task }: { post: SitePost; href: string; task: TaskKey }) {
  return (
    <Link href={href} className="group relative block min-h-[220px] overflow-hidden bg-white">
      <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.84))]" />
      <div className="relative flex h-full flex-col justify-end p-5">
        <span className="w-fit bg-[var(--magazine-accent)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
          {getCategory(post, getTaskConfig(task)?.label || task)}
        </span>
        <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">{post.title}</h3>
      </div>
    </Link>
  )
}

function ArchiveListStory({ post, href, fallbackLabel }: { post: SitePost; href: string; fallbackLabel: string }) {
  return (
    <Link href={href} className="group grid gap-6 py-7 sm:grid-cols-[270px_minmax(0,1fr)]">
      <div className="aspect-[16/10] overflow-hidden bg-[#dce5d7]">
        <img src={getImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--magazine-accent)]">{getCategory(post, fallbackLabel)}</p>
        <h3 className="mt-3 text-[2rem] font-semibold leading-[1.03] text-[var(--magazine-ink)]">{post.title}</h3>
        <p className="mt-4 text-[15px] leading-7 text-[var(--magazine-ink)]/72">{getSummary(post)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--magazine-accent-deep)]">
          Open story <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
