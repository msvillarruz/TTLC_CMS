import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticle, getArticles } from '@/lib/api'
import { serializeLexical } from '@/lib/lexical'
import JsonLd from '@/components/JsonLd'
import { pageMetadata } from '@/lib/seo'
import { contentDate, latestContentDate, pageUrl, recordPath, SCHOOL_ID, STATIC_CONTENT_UPDATED_AT } from '@/lib/seo-utils'

export const revalidate = 3600

export async function generateStaticParams() {
  const articles = await getArticles().catch(() => [])
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug).catch(() => null)
  if (!article) return { title: 'Article — Tiny Thinkers Learning Center' }
  return pageMetadata({
    path: recordPath('articles', slug),
    title: `${article.seo?.title || article.title} | Tiny Thinkers`,
    description: article.seo?.description || article.excerpt || `${article.title} from Tiny Thinkers Learning Center in Quezon City.`,
    image: article.seo?.ogImage || article.heroImage,
    article: { publishedAt: article.publishedAt, updatedAt: latestContentDate(STATIC_CONTENT_UPDATED_AT, article.updatedAt), author: article.author?.name },
  })
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug).catch(() => null)
  if (!article) notFound()

  const bodyHtml = serializeLexical(article.body)
  const url = pageUrl(recordPath('articles', slug))
  const datePublished = contentDate(article.publishedAt)
  const dateModified = latestContentDate(STATIC_CONTENT_UPDATED_AT, article.updatedAt)

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`,
        url, headline: article.title, description: article.excerpt,
        mainEntityOfPage: url, publisher: { '@id': SCHOOL_ID },
        ...(article.heroImage?.url && { image: article.heroImage.url }),
        ...(article.author?.name && { author: { '@type': 'Person', name: article.author.name } }),
        ...(datePublished && { datePublished }), ...(dateModified && { dateModified }),
      }} />
      {/* Hero */}
      {article.heroImage?.url && (
        <div className="relative w-full" style={{ aspectRatio: '21/9', background: '#f3f4f6', maxHeight: '480px', overflow: 'hidden' }}>
          <Image
            src={article.heroImage.url}
            alt={article.heroImage.alt || article.title}
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(26,26,46,0.6))' }}
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-sm font-700 text-ink/50 hover:text-ink mb-8 transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ← All Articles
        </Link>

        {/* Categories */}
        {article.categories && article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.categories.map((cat) => (
              <span
                key={cat.id}
                className="text-xs font-700 px-3 py-1 rounded-full text-white"
                style={{ background: '#009688', fontFamily: 'var(--font-display)' }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h1
          className="text-3xl sm:text-4xl font-900 text-ink mb-5 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-ink/50 mb-10 pb-8 border-b border-gray-100">
          {article.author && (
            <span className="font-600">{article.author.name}</span>
          )}
          {article.publishedAt && (
            <>
              <span>·</span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-PH', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
            </>
          )}
        </div>

        {/* Body */}
        {bodyHtml ? (
          <div
            className="prose prose-ink max-w-none"
            style={{
              fontFamily: 'var(--font-body)',
              lineHeight: 1.8,
              color: 'rgba(26,26,46,0.85)',
            }}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <p className="text-ink/40 italic">No content available.</p>
        )}

        {/* CTA */}
        <div
          className="mt-16 rounded-3xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, #FFF5FB 0%, #F0FFF8 100%)' }}
        >
          <p
            className="text-xl font-900 text-ink mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Interested in enrolling your child?
          </p>
          <p className="text-ink/60 mb-5">Book a free trial class — no commitment required.</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 rounded-xl font-800 text-white"
            style={{ background: '#E91E8C', fontFamily: 'var(--font-display)' }}
          >
            Book a Free Trial
          </Link>
        </div>
      </div>

      <style>{`
        .prose p { margin-bottom: 1.25rem; }
        .prose h1, .prose h2, .prose h3, .prose h4 {
          font-family: var(--font-display);
          font-weight: 800;
          color: #1A1A2E;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prose h2 { font-size: 1.5rem; }
        .prose h3 { font-size: 1.25rem; }
        .prose ul, .prose ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose li { margin-bottom: 0.4rem; }
        .prose blockquote {
          border-left: 4px solid #E91E8C;
          padding-left: 1rem;
          color: rgba(26,26,46,0.6);
          font-style: italic;
          margin: 1.5rem 0;
        }
        .prose a { color: #009688; text-decoration: underline; }
        .prose code { background: #f3f4f6; padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.875em; }
        .prose pre { background: #1A1A2E; color: #fff; padding: 1rem 1.25rem; border-radius: 10px; overflow-x: auto; margin-bottom: 1.25rem; }
        .prose pre code { background: none; padding: 0; }
        .prose strong { font-weight: 700; }
        .prose hr { border-color: #e5e7eb; margin: 2rem 0; }
      `}</style>
    </div>
  )
}
