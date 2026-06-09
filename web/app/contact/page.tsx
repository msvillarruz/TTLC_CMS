import type { Metadata } from 'next'
import { getPrograms, getSiteSettings } from '@/lib/api'
import ContactForm from './ContactForm'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Book a Trial — Tiny Thinkers Learning Center',
  description: 'Book a free trial class for your child at Tiny Thinkers Learning Center.',
}

export default async function ContactPage() {
  const [programs, settings] = await Promise.all([
    getPrograms().catch(() => []),
    getSiteSettings().catch((): import('@/lib/api').SiteSettings => ({})),
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #FFF5FB 0%, #F0FFF8 100%)' }}
      >
        <h1
          className="text-4xl sm:text-5xl font-900 text-ink mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Book a Free Trial
        </h1>
        <p className="text-ink/60 max-w-xl mx-auto text-lg">
          Let your child experience the Tiny Thinkers magic — no fees, no commitment.
        </p>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm programs={programs} />
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(26,26,46,0.06)' }}
            >
              <h3
                className="font-800 text-ink mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Contact Us
              </h3>
              <div className="space-y-3 text-sm text-ink/70">
                {settings.address && (
                  <p className="flex gap-2">
                    <span>📍</span>
                    <span>{settings.address}</span>
                  </p>
                )}
                {settings.phone && (
                  <p className="flex gap-2">
                    <span>📞</span>
                    <a href={`tel:${settings.phone}`} className="hover:text-pink transition-colors">
                      {settings.phone}
                    </a>
                  </p>
                )}
                {settings.email && (
                  <p className="flex gap-2">
                    <span>✉️</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-pink transition-colors">
                      {settings.email}
                    </a>
                  </p>
                )}
                {!settings.address && !settings.phone && !settings.email && (
                  <>
                    <p className="flex gap-2">
                      <span>✉️</span>
                      <a href="mailto:hello@tinythinkers.edu.ph" className="hover:text-pink transition-colors">
                        hello@tinythinkers.edu.ph
                      </a>
                    </p>
                  </>
                )}
              </div>
            </div>

            {settings.mapEmbedUrl && (
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,26,46,0.06)' }}>
                <iframe
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="School location"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
