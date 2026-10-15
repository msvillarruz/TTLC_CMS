import JsonLd from '@/components/JsonLd'
import { breadcrumbStructuredData, pageMetadata, programListStructuredData, webPageStructuredData } from '@/lib/seo'
import { STATIC_CONTENT_UPDATED_AT } from '@/lib/seo-utils'
import { getPrograms } from '@/lib/api'
import ProgramCard from '@/components/ProgramCard'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMetadata({ path: '/programs', title: "Toddler, Nursery and Kinder Readiness Programs | Tiny Thinkers", description: "Explore Tiny Thinkers classes in Quezon City. Compare program ages, schedules and learning focuses, then request a free trial." })
}

export default async function ProgramsPage() {
  const programs = await getPrograms().catch(() => [])

  return (
    <div className="min-h-screen">
      <JsonLd data={webPageStructuredData('/programs', "Toddler, Nursery and Kinder Readiness Programs | Tiny Thinkers", STATIC_CONTENT_UPDATED_AT)} />
      <JsonLd data={breadcrumbStructuredData([{ name: 'Home', path: '/' }, { name: 'Programs', path: '/programs' }])} />
      {programs.length > 0 && <JsonLd data={programListStructuredData(programs)} />}
      {/* Header */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #FFF5FB 0%, #F0FFF8 100%)' }}
      >
        <h1
          className="text-4xl sm:text-5xl font-900 text-ink mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Our Programs
        </h1>
        <p className="text-ink/60 max-w-xl mx-auto text-lg">
          Every program is designed to nurture curiosity, confidence, and a love of learning.
        </p>
      </section>

      {/* Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {programs.length === 0 ? (
            <p className="text-center text-ink/40 py-20">No programs available at this time.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {programs.map((p) => (
                <ProgramCard key={p.id} program={p} showFocuses />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
