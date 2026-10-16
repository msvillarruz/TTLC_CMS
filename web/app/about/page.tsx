import JsonLd from '@/components/JsonLd'
import { breadcrumbStructuredData, pageMetadata, webPageStructuredData } from '@/lib/seo'
import { STATIC_CONTENT_UPDATED_AT } from '@/lib/seo-utils'
import Image from 'next/image'
import { getAuthors, getSiteSettings } from '@/lib/api'
import { OBJECTIVES } from '@/lib/content'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMetadata({ path: '/about', title: "About Tiny Thinkers | Play-Based Learning in Quezon City", description: "Meet the Tiny Thinkers team and learn about our play-based approach to early childhood learning in Quezon City." })
}

export default async function AboutPage() {
  const [authors, settings] = await Promise.all([
    getAuthors().catch(() => []),
    getSiteSettings().catch((): import('@/lib/api').SiteSettings => ({})),
  ])

  return (
    <div className="min-h-screen">
      <JsonLd data={webPageStructuredData('/about', "About Tiny Thinkers | Play-Based Learning in Quezon City", STATIC_CONTENT_UPDATED_AT)} />
      <JsonLd data={breadcrumbStructuredData([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />
      {/* Header */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #F0FFFE 0%, #FEF0F6 100%)' }}
      >
        <h1 className="text-4xl sm:text-5xl font-black text-ink mb-4">
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
          <h2 className="text-2xl sm:text-3xl font-black text-ink mb-6">Our Mission</h2>
          <p className="text-ink/70 text-lg leading-relaxed">
            {settings.mission ||
              'Tiny Thinkers Learning Center is dedicated to providing a nurturing, play-based environment where young children discover their potential, build confidence, and develop a lifelong love of learning. We believe every child is a natural thinker — our role is to give them the space, support, and inspiration to flourish.'}
          </p>
        </div>
      </section>

      {/* Objectives */}
      <section
        className="py-16 px-4"
        style={{ background: '#4DC9D3' }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-10">
            Our Objectives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OBJECTIVES.map((obj) => (
              <div
                key={obj.title}
                className="bg-white/20 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{obj.icon}</div>
                <h4 className="font-extrabold text-white text-sm mb-2">{obj.title}</h4>
                <p className="text-xs text-white/80 leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-ink text-center mb-14">
            Meet the Team
          </h2>
          {authors.length === 0 ? (
            <p className="text-center text-ink/40 py-10">No team members found.</p>
          ) : (() => {
            const leadership = authors.filter((a) => a.group === 'admin')
            const faculty = authors.filter((a) => a.group === 'faculty')
            const support = authors.filter((a) => a.group === 'operations')

            const groups = [
              { label: 'Leadership', members: leadership, color: '#E83D8F' },
              { label: 'Faculty', members: faculty, color: '#4DC9D3' },
              { label: 'Operations & Support', members: support, color: '#7C4DFF' },
            ]

            return (
              <div className="space-y-14">
                {groups.map((group) => group.members.length > 0 && (
                  <div key={group.label}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-0.5 w-8 rounded-full flex-shrink-0" style={{ background: group.color }} />
                      <h3
                        className="text-base font-extrabold uppercase tracking-widest"
                        style={{ color: group.color }}
                      >
                        {group.label}
                      </h3>
                      <div className="h-0.5 flex-1 rounded-full opacity-20" style={{ background: group.color }} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {group.members.map((a) => {
                        const cardName = a.nickname || a.name.split(' ')[0]
                        return (
                          <div
                            key={a.id}
                            style={{
                              border: `2px solid ${group.color}`,
                              borderRadius: '12px',
                              overflow: 'hidden',
                              boxShadow: '0 4px 16px rgba(28,43,74,0.09)',
                              background: '#fff',
                            }}
                          >
                            <div style={{ position: 'relative', aspectRatio: '3/4', display: 'flex' }}>
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
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.12em',
                                    writingMode: 'vertical-lr',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {cardName}
                                </span>
                              </div>

                              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                                {a.photo?.url ? (
                                  <Image
                                    src={a.photo.url}
                                    alt={a.photo.alt || a.name}
                                    fill
                                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, 280px"
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
                                        opacity: 0.6,
                                      }}
                                    >
                                      {a.name[0]}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div style={{ padding: '10px 10px 12px' }}>
                              <p
                                style={{
                                  fontWeight: 800,
                                  fontSize: '10px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                  color: '#1C2B4A',
                                  marginBottom: '6px',
                                  lineHeight: 1.4,
                                }}
                              >
                                {a.name}
                              </p>
                              <span
                                style={{
                                  display: 'inline-block',
                                  background: '#F47B35',
                                  color: 'white',
                                  fontSize: '8px',
                                  fontWeight: 700,
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
