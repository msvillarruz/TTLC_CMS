import Link from 'next/link'
import Image from 'next/image'
import { getPrograms, getAuthors, getSiteSettings, getHomePage } from '@/lib/api'
import ProgramCard from '@/components/ProgramCard'

export const revalidate = 3600

const objectives = [
  { icon: '🎮', title: 'Play-Based Learning', desc: 'Hands-on activities that turn curiosity into discovery.' },
  { icon: '🛡️', title: 'Safe Environment', desc: 'A nurturing space where every child feels secure and valued.' },
  { icon: '🌟', title: 'Skills Discovery', desc: 'Uncovering each child\'s unique strengths and talents.' },
  { icon: '🤝', title: 'Parent Partnership', desc: 'Families as active partners in every learning journey.' },
  { icon: '💬', title: 'Open Communication', desc: 'Transparent, consistent connection between home and school.' },
]

export default async function HomePage() {
  const [programs, authors, settings, homePage] = await Promise.all([
    getPrograms().catch(() => []),
    getAuthors().catch(() => []),
    getSiteSettings().catch((): import('@/lib/api').SiteSettings => ({})),
    getHomePage().catch((): import('@/lib/api').HomePage => ({})),
  ])

  const headline = homePage.heroHeadline || 'Your child\'s best beginning'
  const subline = homePage.heroSubline || 'A play-based learning center dedicated to fostering curiosity, creativity, and confidence in every child.'

  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #FFF5FB 0%, #F0FFF8 50%, #FFF8E7 100%)' }}
      >
        {/* Floating decoratives */}
        <div
          className="absolute top-12 right-8 w-20 h-20 rounded-full opacity-20 animate-float"
          style={{ background: 'var(--color-pink)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-16 left-12 w-14 h-14 rounded-xl opacity-20 animate-float"
          style={{ background: 'var(--color-teal)', animationDelay: '1s' }}
          aria-hidden="true"
        />
        <div
          className="absolute top-32 left-1/4 w-10 h-10 rounded-full opacity-15 animate-wiggle"
          style={{ background: 'var(--color-yellow)' }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-800 text-white mb-6"
            style={{ background: 'var(--color-teal)', fontFamily: 'var(--font-display)' }}
          >
            🌱 Enrolling Now
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-900 text-ink mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {headline}
          </h1>
          <p className="text-lg sm:text-xl text-ink/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            {subline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-2xl text-base font-800 text-white transition-transform hover:scale-105"
              style={{ background: 'var(--color-pink)', fontFamily: 'var(--font-display)', boxShadow: '0 6px 24px rgba(233,30,140,0.3)' }}
            >
              Book a Free Trial
            </Link>
            <Link
              href="/programs"
              className="px-8 py-4 rounded-2xl text-base font-800 text-ink border-2 border-ink/20 hover:border-ink/40 transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Explore Programs →
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMS PREVIEW */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-900 text-ink mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Our Programs
            </h2>
            <p className="text-ink/60 max-w-xl mx-auto">
              Carefully designed learning experiences for every stage of early childhood.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {programs.slice(0, 8).map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
          {programs.length > 8 && (
            <div className="text-center mt-10">
              <Link
                href="/programs"
                className="inline-block px-6 py-3 rounded-xl font-800 text-pink border-2 border-pink hover:bg-pink hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                View All Programs
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT SNAPSHOT */}
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #F0FFF8 0%, #FFF5FB 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-900 text-ink mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Our Mission
              </h2>
              <p className="text-ink/70 text-lg leading-relaxed mb-8">
                {settings.mission ||
                  'Tiny Thinkers Learning Center is dedicated to providing a nurturing, play-based environment where young children discover their potential, build confidence, and develop a lifelong love of learning.'}
              </p>
              <Link
                href="/about"
                className="inline-block px-6 py-3 rounded-xl font-800 text-white bg-teal hover:bg-teal/90 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Meet the Team
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {objectives.map((obj) => (
                <div
                  key={obj.title}
                  className="bg-white rounded-2xl p-5"
                  style={{ boxShadow: '0 2px 12px rgba(26,26,46,0.06)' }}
                >
                  <div className="text-2xl mb-2">{obj.icon}</div>
                  <h4
                    className="font-800 text-ink text-sm mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {obj.title}
                  </h4>
                  <p className="text-xs text-ink/60 leading-relaxed">{obj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      {authors.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-900 text-ink mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Meet Our Team
              </h2>
              <p className="text-ink/60 max-w-xl mx-auto">
                Passionate educators dedicated to your child's growth.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {authors.slice(0, 6).map((a) => (
                <div key={a.id} className="text-center">
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white text-xl font-black overflow-hidden"
                    style={{ background: 'var(--color-teal)', fontFamily: 'var(--font-display)' }}
                  >
                    {a.photo?.url ? (
                      <Image
                        src={a.photo.url}
                        alt={a.photo.alt || a.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      a.name[0]
                    )}
                  </div>
                  <p
                    className="text-xs font-800 text-ink leading-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {a.name.split(' ')[0]}
                  </p>
                  <p className="text-xs text-ink/50 mt-0.5">{a.role}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/about"
                className="inline-block px-6 py-3 rounded-xl font-800 text-teal border-2 border-teal hover:bg-teal hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                View Full Team
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PARENT JOURNEY */}
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #F0FFF8 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-900 text-ink mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your Journey Starts Here
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="bg-white rounded-3xl p-8"
              style={{ boxShadow: '0 4px 24px rgba(26,26,46,0.07)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl mb-5"
                style={{ background: 'var(--color-pink)' }}
              >
                👀
              </div>
              <h3
                className="text-xl font-900 text-ink mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Awareness
              </h3>
              <p className="text-ink/70 leading-relaxed">
                Discover why play-based learning sets the foundation for lifelong curiosity, creativity, and academic success. Learn how the Tiny Thinkers approach is different.
              </p>
            </div>
            <div
              className="bg-white rounded-3xl p-8"
              style={{ boxShadow: '0 4px 24px rgba(26,26,46,0.07)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl mb-5"
                style={{ background: 'var(--color-teal)' }}
              >
                🎯
              </div>
              <h3
                className="text-xl font-900 text-ink mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Consideration
              </h3>
              <p className="text-ink/70 leading-relaxed">
                Explore our programs by age group, meet the team, and book a free trial class so your child can experience the magic firsthand — no commitment required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: 'var(--color-ink)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-900 text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ready to give your child the Tiny Thinkers experience?
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Book a free trial class today — no fees, no commitment.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 rounded-2xl text-base font-800 text-white transition-transform hover:scale-105"
            style={{
              background: 'var(--color-pink)',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 6px 24px rgba(233,30,140,0.4)',
            }}
          >
            Book a Free Trial
          </Link>
        </div>
      </section>
    </>
  )
}
