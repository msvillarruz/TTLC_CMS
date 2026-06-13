import Link from 'next/link'
import Image from 'next/image'
import { getPrograms, getAuthors, getSiteSettings, getHomePage, getTestimonials } from '@/lib/api'
import ProgramCard from '@/components/ProgramCard'
import HeroCarousel from '@/components/HeroCarousel'
import { OBJECTIVES, PROGRAM_COLORS } from '@/lib/content'

export const revalidate = 3600

const journeyStages = [
  {
    title: 'Awareness',
    subtitle: 'What is Tiny Thinkers?',
    color: '#4DC9D3',
    bgColor: '#E8F9FA',
    icon: '👀',
    chips: ['School tour video', 'Curriculum overview', 'Our approach', 'Meet the teachers'],
  },
  {
    title: 'Consideration',
    subtitle: 'Does TTLC fit our needs?',
    color: '#F9C215',
    bgColor: '#FFFBEA',
    icon: '🤔',
    chips: ['Book a school visit', 'Tuition & schedules', 'Parent testimonials', 'Chat with us'],
  },
  {
    title: 'Decision',
    subtitle: 'Is TTLC the right fit?',
    color: '#E83D8F',
    bgColor: '#FEF0F6',
    icon: '🎯',
    chips: ['Trial class booking', 'Meet the teachers', 'Tuition breakdown', 'Parent Q&A'],
  },
  {
    title: 'Enrollment',
    subtitle: 'We are ready! 🎉',
    color: '#F47B35',
    bgColor: '#FFF4EE',
    icon: '🎒',
    chips: ['Online enrollment form', 'Requirements checklist', 'Orientation schedule', 'Welcome to TTLC!'],
  },
]

const featuredNames = [
  'Carla Irel B. Villarruz',
  'Renee Therese D. Baquilar',
  'Angel Rita T. Mutuc',
]

export default async function HomePage() {
  const [programs, authors, settings, homePage, testimonials] = await Promise.all([
    getPrograms().catch(() => []),
    getAuthors().catch(() => []),
    getSiteSettings().catch((): import('@/lib/api').SiteSettings => ({})),
    getHomePage().catch((): import('@/lib/api').HomePage => ({})),
    getTestimonials().catch(() => []),
  ])

  const headline = homePage.heroHeadline || "Your child's best beginning"
  const subline = homePage.heroSubline || 'A play-based learning center dedicated to fostering curiosity, creativity, and confidence in every child.'

  const featuredAuthors = featuredNames
    .map((name) => authors.find((a) => a.name === name))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
  const teamPreview = featuredAuthors.length >= 2 ? featuredAuthors : authors.slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden py-20 px-4 animate-fade-up"
        style={{ background: 'linear-gradient(135deg, #FFF5FB 0%, #F0FFFE 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-extrabold text-white mb-6"
                style={{ background: '#4DC9D3' }}
              >
                🌱 Enrollment On-going
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-ink mb-6 leading-tight">
                {headline}
              </h1>
              <p className="text-lg sm:text-xl text-ink/70 max-w-lg mb-10 leading-relaxed">
                {subline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-2xl text-base font-extrabold text-white transition-transform hover:scale-105"
                  style={{ background: '#E83D8F', boxShadow: '0 6px 24px rgba(232,61,143,0.30)' }}
                >
                  Schedule a Free Trial ✨
                </Link>
                <Link
                  href="/programs"
                  className="px-8 py-4 rounded-2xl text-base font-extrabold text-ink border-2 border-ink/20 hover:border-ink/40 transition-colors"
                >
                  Explore Programs →
                </Link>
              </div>
            </div>

            {/* Right: Hero Carousel */}
            <HeroCarousel
              cmsImages={
                homePage.heroImage?.url
                  ? [{ src: homePage.heroImage.url, alt: homePage.heroImage.alt || 'Tiny Thinkers Learning Center' }]
                  : []
              }
            />
          </div>
        </div>
      </section>

      {/* CREDIBILITY STRIP */}
      <section
        className="py-6 px-4 animate-fade-up"
        style={{ background: '#1C2B4A', animationDelay: '0.1s' }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
          {[
            { icon: '🏫', label: '8 Programs' },
            { icon: '👶', label: 'Ages 1.5 to 5+' },
            { icon: '👩‍🏫', label: 'Max 8 Kids per Class' },
            { icon: '📍', label: 'Quezon City, PH' },
            { icon: '🗓️', label: 'Since August 2024' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-white font-bold text-sm">
              <span>{stat.icon}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section
        className="py-20 px-4 bg-white animate-fade-up"
        style={{ animationDelay: '0.15s' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-ink mb-3">Our Programs</h2>
            <p className="text-ink/60 max-w-xl mx-auto">
              Every child is different — we have a class that&apos;s just right for yours.
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
                className="inline-block px-6 py-3 rounded-xl font-extrabold text-pink border-2 border-pink hover:bg-pink hover:text-white transition-colors"
              >
                View All Programs
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* MISSION + OBJECTIVES */}
      <section
        className="py-20 px-4 animate-fade-up"
        style={{ background: '#4DC9D3', animationDelay: '0.2s' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Our Mission</h2>
            <p className="text-white/85 text-lg leading-relaxed max-w-2xl mx-auto">
              {settings.mission ||
                'Tiny Thinkers Learning Center is dedicated to providing a nurturing, play-based environment where young children discover their potential, build confidence, and develop a lifelong love of learning.'}
            </p>
            <Link
              href="/about"
              className="inline-block mt-6 px-6 py-3 rounded-xl font-extrabold bg-white hover:bg-white/90 transition-colors"
              style={{ color: '#4DC9D3' }}
            >
              Meet the Team
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
            {OBJECTIVES.map((obj) => (
              <div key={obj.title} className="bg-white/20 rounded-2xl p-5 text-center">
                <div className="text-2xl mb-2">{obj.icon}</div>
                <h4 className="font-extrabold text-white text-sm mb-1">{obj.title}</h4>
                <p className="text-xs text-white/80 leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      {teamPreview.length > 0 && (
        <section
          className="py-20 px-4 bg-white animate-fade-up"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-ink mb-3">Meet Our Team</h2>
              <p className="text-ink/60 max-w-xl mx-auto">
                Passionate educators dedicated to your child&apos;s growth.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {teamPreview.map((a) => {
                const accentColor =
                  a.role?.includes('School Head') || a.role?.includes('Academic Lead')
                    ? '#E83D8F'
                    : '#4DC9D3'
                return (
                  <div key={a.id} className="text-center">
                    <div
                      className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-black overflow-hidden"
                      style={{ background: accentColor }}
                    >
                      {a.photo?.url ? (
                        <Image
                          src={a.photo.url}
                          alt={a.photo.alt || a.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        a.name[0]
                      )}
                    </div>
                    <p className="text-sm font-extrabold text-ink leading-tight">{a.name}</p>
                    <span
                      className="text-xs font-bold mt-1 inline-block px-3 py-0.5 rounded-full text-white"
                      style={{ background: accentColor }}
                    >
                      {a.role}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/about"
                className="inline-block px-6 py-3 rounded-xl font-extrabold text-teal border-2 border-teal hover:bg-teal hover:text-white transition-colors"
              >
                Meet the full team →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section
          className="py-20 px-4 animate-fade-up"
          style={{ background: '#1C2B4A', animationDelay: '0.3s' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">What Parents Say</h2>
              <p className="text-white/60 max-w-xl mx-auto">
                Hear from families who&apos;ve experienced the Tiny Thinkers difference.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t) => {
                const tagColor = PROGRAM_COLORS[t.programName] || '#4DC9D3'

                if (t.testimonialType === 'video') {
                  const isYouTube = t.videoUrl && (t.videoUrl.includes('youtube.com') || t.videoUrl.includes('youtu.be'))
                  const isFacebook = t.videoUrl && t.videoUrl.includes('facebook.com')

                  let youtubeEmbedUrl = ''
                  if (isYouTube && t.videoUrl) {
                    const ytMatch = t.videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                    if (ytMatch) youtubeEmbedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
                  }

                  return (
                    <div
                      key={t.id}
                      className="flex flex-col bg-white/10 rounded-2xl overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {t.videoFile?.url ? (
                        <video
                          controls
                          className="w-full"
                          style={{ aspectRatio: '16/9', background: '#000', display: 'block' }}
                          preload="metadata"
                        >
                          <source src={t.videoFile.url} type={t.videoFile.mimeType || 'video/mp4'} />
                        </video>
                      ) : youtubeEmbedUrl ? (
                        <iframe
                          src={youtubeEmbedUrl}
                          className="w-full"
                          style={{ aspectRatio: '16/9', border: 0, display: 'block' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`${t.parentName} testimonial`}
                        />
                      ) : isFacebook && t.videoUrl ? (
                        <iframe
                          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(t.videoUrl)}&show_text=0`}
                          className="w-full"
                          style={{ aspectRatio: '16/9', border: 0, display: 'block' }}
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          title={`${t.parentName} testimonial`}
                        />
                      ) : null}

                      <div className="p-4 flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-sm font-black"
                          style={{ background: tagColor }}
                        >
                          {t.parentName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-white leading-none">{t.parentName}</p>
                          <span
                            className="text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded-full text-white"
                            style={{ background: tagColor }}
                          >
                            Parent · {t.programName}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={t.id}
                    className="flex flex-col bg-white/10 rounded-2xl p-6"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(Math.min(5, Math.max(1, t.rating || 5)))].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F9C215">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/80 leading-relaxed text-sm flex-1 mb-5">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div
                        className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-sm font-black"
                        style={{ background: tagColor }}
                      >
                        {t.parentName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-white leading-none">{t.parentName}</p>
                        <span
                          className="text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded-full text-white"
                          style={{ background: tagColor }}
                        >
                          Parent · {t.programName}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* PARENT JOURNEY */}
      <section
        className="py-20 px-4 animate-fade-up"
        style={{ background: '#FFFBEA', animationDelay: '0.35s' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-ink mb-3">Your Journey Starts Here</h2>
            <p className="text-ink/60 max-w-xl mx-auto">
              From first discovery to first day of class — we guide you every step of the way.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {journeyStages.map((stage) => (
              <div
                key={stage.title}
                className="rounded-3xl p-7"
                style={{ background: stage.bgColor, border: `2px solid ${stage.color}20` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: stage.color }}
                  >
                    {stage.icon}
                  </div>
                  <div>
                    <h3
                      className="text-lg font-black text-ink leading-tight"
                    >
                      {stage.title}
                    </h3>
                    <p className="text-sm text-ink/60">{stage.subtitle}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {stage.chips.map((chip) => (
                    <span
                      key={chip}
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ background: stage.color }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #E83D8F 0%, #C0177A 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to give your little one the best beginning? 🌟
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Book a free trial class today — no fees, no commitment.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 rounded-2xl text-base font-extrabold text-pink bg-white transition-transform hover:scale-105"
            style={{ boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}
          >
            Schedule a Free Trial ✨
          </Link>
        </div>
      </section>
    </>
  )
}
