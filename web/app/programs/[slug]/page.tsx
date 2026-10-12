import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProgram, getPrograms, resolveColor } from '@/lib/api'
import JsonLd from '@/components/JsonLd'
import { pageMetadata, webPageStructuredData } from '@/lib/seo'
import { latestContentDate, programAgeRange, programFocuses, recordPath, STATIC_CONTENT_UPDATED_AT } from '@/lib/seo-utils'

export const revalidate = 3600

export async function generateStaticParams() {
  const programs = await getPrograms().catch(() => [])
  return programs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgram(slug).catch(() => null)
  if (!program) return { title: 'Program — Tiny Thinkers Learning Center' }
  return pageMetadata({
    path: recordPath('programs', slug),
    title: `${program.classType} in Quezon City | ${program.name}`,
    description: program.description || `${program.name}: ${program.classType} for ${programAgeRange(program)} at Tiny Thinkers in Quezon City. View the schedule and book a free trial.`,
    image: program.heroImage,
  })
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = await getProgram(slug).catch(() => null)
  if (!program) notFound()

  const color = resolveColor(program.accentColor)
  const ageRange = programAgeRange(program)
  const focuses = programFocuses(program)

  return (
    <div className="min-h-screen">
      <JsonLd data={webPageStructuredData(recordPath('programs', slug), program.name, latestContentDate(STATIC_CONTENT_UPDATED_AT, program.updatedAt))} />
      {/* Hero */}
      <section
        className="py-16 px-4"
        style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`, borderBottom: `4px solid ${color}` }}
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/programs"
            className="inline-flex items-center gap-1 text-sm font-700 text-ink/50 hover:text-ink mb-8 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ← All Programs
          </Link>

          <div className="flex flex-wrap gap-3 mb-4">
            <span
              className="px-3 py-1 rounded-full text-sm font-700 text-white"
              style={{ background: color, fontFamily: 'var(--font-display)' }}
            >
              {program.classType}
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-700"
              style={{ background: `${color}20`, color, fontFamily: 'var(--font-display)' }}
            >
              {ageRange}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-900 text-ink mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {program.name}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-ink/60">
            {program.schedule && (
              <span className="flex items-center gap-1">
                📅 {program.schedule}
              </span>
            )}
            {program.duration && (
              <span className="flex items-center gap-1">
                ⏱ {program.duration}
              </span>
            )}
            {program.classSize && (
              <span className="flex items-center gap-1">
                👥 {program.classSize}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-10">
            {program.description && <p className="text-ink/70 leading-relaxed">{program.description}</p>}

            {/* Class Routine */}
            {program.classRoutine && program.classRoutine.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-900 text-ink mb-6"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Class Routine
                </h2>
                <div className="space-y-3">
                  {program.classRoutine.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start bg-white rounded-xl p-4"
                      style={{ boxShadow: '0 2px 8px rgba(26,26,46,0.06)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-800"
                        style={{ background: color, fontFamily: 'var(--font-display)' }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs font-700 text-ink/40 mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                          {item.duration || item.time}
                        </p>
                        <p className="text-sm font-600 text-ink">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Note */}
            {program.specialNote && (
              <div
                className="rounded-2xl p-6"
                style={{ background: `${color}12`, borderLeft: `4px solid ${color}` }}
              >
                <p className="text-sm font-700 text-ink/50 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Special Note
                </p>
                <p className="text-ink/80 leading-relaxed">{program.specialNote}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Focuses */}
            {focuses.length > 0 && (
              <div
                className="bg-white rounded-2xl p-6"
                style={{ boxShadow: '0 2px 12px rgba(26,26,46,0.07)' }}
              >
                <h3
                  className="text-base font-800 text-ink mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Learning Focuses
                </h3>
                <ul className="space-y-2">
                  {focuses.map((focus, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-ink/70">
                      <span
                        className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-white text-xs"
                        style={{ background: color }}
                      >
                        ✓
                      </span>
                      {focus}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: 'var(--color-ink)' }}
            >
              <p
                className="text-white font-800 text-lg mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Interested?
              </p>
              <p className="text-white/60 text-sm mb-5">
                Book a free trial class with no commitment.
              </p>
              <Link
                href="/contact"
                className="block w-full py-3 rounded-xl text-sm font-800 text-white text-center transition-opacity hover:opacity-90"
                style={{ background: color, fontFamily: 'var(--font-display)' }}
              >
                Book a Trial →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
