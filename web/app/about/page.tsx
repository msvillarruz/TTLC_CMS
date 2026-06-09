import type { Metadata } from 'next'
import Image from 'next/image'
import { getAuthors, getSiteSettings } from '@/lib/api'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About Us — Tiny Thinkers Learning Center',
  description: 'Meet the team behind Tiny Thinkers Learning Center.',
}

const objectives = [
  { icon: '🎮', title: 'Play-Based Learning', desc: 'Hands-on activities that turn curiosity into discovery and learning into joy.' },
  { icon: '🛡️', title: 'Safe Environment', desc: 'A nurturing, inclusive space where every child feels secure, respected, and valued.' },
  { icon: '🌟', title: 'Skills Discovery', desc: 'Uncovering each child\'s unique strengths, talents, and individual learning style.' },
  { icon: '🤝', title: 'Parent Partnership', desc: 'Families are active partners in the learning journey from day one.' },
  { icon: '💬', title: 'Open Communication', desc: 'Transparent, consistent connection between teachers, families, and school leadership.' },
]

export default async function AboutPage() {
  const [authors, settings] = await Promise.all([
    getAuthors().catch(() => []),
    getSiteSettings().catch((): import('@/lib/api').SiteSettings => ({})),
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #F0FFF8 0%, #FFF5FB 100%)' }}
      >
        <h1
          className="text-4xl sm:text-5xl font-900 text-ink mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          About Us
        </h1>
        <p className="text-ink/60 max-w-xl mx-auto text-lg">
          {settings.mission ||
            'Nurturing curious minds through play-based learning in a safe, joyful environment.'}
        </p>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl font-900 text-ink mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Our Mission
          </h2>
          <p className="text-ink/70 text-lg leading-relaxed">
            {settings.mission ||
              'Tiny Thinkers Learning Center is dedicated to providing a nurturing, play-based environment where young children discover their potential, build confidence, and develop a lifelong love of learning. We believe every child is a natural thinker — our role is to give them the space, support, and inspiration to flourish.'}
          </p>
        </div>
      </section>

      {/* Objectives */}
      <section
        className="py-16 px-4"
        style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #F0FFF8 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-900 text-ink text-center mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Our Objectives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {objectives.map((obj) => (
              <div
                key={obj.title}
                className="bg-white rounded-2xl p-6 text-center"
                style={{ boxShadow: '0 2px 12px rgba(26,26,46,0.06)' }}
              >
                <div className="text-3xl mb-3">{obj.icon}</div>
                <h4
                  className="font-800 text-ink text-sm mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {obj.title}
                </h4>
                <p className="text-xs text-ink/60 leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-900 text-ink text-center mb-14"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Meet the Team
          </h2>
          {authors.length === 0 ? (
            <p className="text-center text-ink/40 py-10">No team members found.</p>
          ) : (() => {
            const leadership = authors.filter((a) =>
              ['School Head', 'Academic Lead', 'Head of EdTech', 'Corporate Secretary'].includes(a.role ?? '')
            )
            const faculty = authors.filter((a) => a.role?.includes('Head Teacher'))
            const support = authors.filter((a) => a.role?.includes('Teacher Aide'))

            const groups = [
              { label: 'Admin & Leadership', members: leadership, color: '#E91E8C' },
              { label: 'Faculty & Academic Team', members: faculty, color: '#009688' },
              { label: 'Operations & Support', members: support, color: '#7C4DFF' },
            ]

            return (
              <div className="space-y-14">
                {groups.map((group) => group.members.length > 0 && (
                  <div key={group.label}>
                    {/* Group heading */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-0.5 w-8 rounded-full flex-shrink-0" style={{ background: group.color }} />
                      <h3
                        className="text-base font-800 uppercase tracking-widest"
                        style={{ fontFamily: 'var(--font-display)', color: group.color }}
                      >
                        {group.label}
                      </h3>
                      <div className="h-0.5 flex-1 rounded-full opacity-20" style={{ background: group.color }} />
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {group.members.map((a) => {
                        const firstName = a.name.split(' ')[0]
                        return (
                          <div
                            key={a.id}
                            style={{
                              border: `2px solid ${group.color}`,
                              borderRadius: '12px',
                              overflow: 'hidden',
                              boxShadow: '0 4px 16px rgba(26,26,46,0.09)',
                              background: '#fff',
                            }}
                          >
                            {/* Photo area — 3:4 portrait */}
                            <div style={{ position: 'relative', aspectRatio: '3/4', display: 'flex' }}>
                              {/* Vertical name strip */}
                              <div
                                style={{
                                  width: '28px',
                                  flexShrink: 0,
                                  background: group.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  overflow: 'hidden',
                                }}
                              >
                                <span
                                  style={{
                                    color: 'white',
                                    fontSize: '10px',
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-display)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.12em',
                                    writingMode: 'vertical-lr',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {firstName}
                                </span>
                              </div>

                              {/* Photo or initial */}
                              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                                {a.photo?.url ? (
                                  <Image
                                    src={a.photo.url}
                                    alt={a.photo.alt || a.name}
                                    fill
                                    className="object-cover object-top"
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      background: `${group.color}18`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '3rem',
                                        fontWeight: 900,
                                        color: group.color,
                                        fontFamily: 'var(--font-display)',
                                        opacity: 0.6,
                                      }}
                                    >
                                      {a.name[0]}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '10px 10px 12px' }}>
                              <p
                                style={{
                                  fontFamily: 'var(--font-display)',
                                  fontWeight: 800,
                                  fontSize: '10px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                  color: '#1A1A2E',
                                  marginBottom: '6px',
                                  lineHeight: 1.4,
                                }}
                              >
                                {a.name}
                              </p>
                              <span
                                style={{
                                  display: 'inline-block',
                                  background: '#FF6D3B',
                                  color: 'white',
                                  fontSize: '8px',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-display)',
                                  padding: '2px 7px',
                                  borderRadius: '100px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {a.role}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
