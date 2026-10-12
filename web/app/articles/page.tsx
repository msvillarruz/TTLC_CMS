import JsonLd from '@/components/JsonLd'
import { pageMetadata, webPageStructuredData } from '@/lib/seo'
import { STATIC_CONTENT_UPDATED_AT } from '@/lib/seo-utils'
import Link from 'next/link'
import Image from 'next/image'
import { getArticles } from '@/lib/api'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMetadata({ path: '/articles', title: "Early Learning Articles and School News | Tiny Thinkers", description: "Read early learning articles, school news and updates from Tiny Thinkers Learning Center in Quezon City." })
}

const CATEGORY_COLORS: Record<string, string> = {
  teal:   '#009688',
  pink:   '#E91E8C',
  yellow: '#FFD600',
  blue:   '#3B82F6',
}

function categoryColor(color?: string): string {
  return CATEGORY_COLORS[color ?? ''] ?? '#009688'
}

export default async function ArticlesPage() {
  const articles = await getArticles().catch(() => [])

  return (
    <div className="min-h-screen">
      <JsonLd data={webPageStructuredData('/articles', "Early Learning Articles and School News | Tiny Thinkers", STATIC_CONTENT_UPDATED_AT)} />
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #F0FFF8 0%, #FFF5FB 100%)' }}
      >
        <h1
          className="text-4xl sm:text-5xl font-900 text-ink mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Articles
        </h1>
        <p className="text-ink/60 max-w-xl mx-auto text-lg">
          Tips, stories, and insights on early childhood education.
        </p>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {articles.length === 0 ? (
            <p className="text-center text-ink/40 py-20">No articles published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.slug}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
                  style={{ boxShadow: '0 4px 20px rgba(26,26,46,0.08)' }}
                >
                  {/* Hero image */}
                  <div className="relative w-full" style={{ aspectRatio: '16/9', background: '#f3f4f6' }}>
                    {a.heroImage?.url ? (
                      <Image
                        src={a.heroImage.url}
                        alt={a.heroImage.alt || a.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-4xl"
                        style={{ background: 'linear-gradient(135deg, #F0FFF8, #FFF5FB)' }}
                      >
                        📝
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    {/* Categories */}
                    {a.categories && a.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {a.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className="text-xs font-700 px-2 py-0.5 rounded-full text-white"
                            style={{ background: categoryColor(cat.color), fontFamily: 'var(--font-display)' }}
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2
                      className="text-lg font-800 text-ink mb-2 group-hover:text-pink transition-colors leading-snug"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {a.title}
                    </h2>

                    {a.excerpt && (
                      <p className="text-sm text-ink/60 leading-relaxed mb-4 flex-1">{a.excerpt}</p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xs text-ink/50">
                        {a.author?.name ?? 'TTLC Team'}
                      </span>
                      {a.publishedAt && (
                        <span className="text-xs text-ink/40">
                          {new Date(a.publishedAt).toLocaleDateString('en-PH', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
