import Image from 'next/image'
import Link from 'next/link'
import type { Program, SiteSettings } from '@/lib/api'
import { canonicalFacebookUrl, displayPhone, formatAddress, phoneHref, SCHOOL_EMAIL, SCHOOL_MAPS_URL } from '@/lib/seo-utils'

const schoolLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'Contact', href: '/contact' },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: canonicalFacebookUrl(),
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
]

export default function Footer({ programs, logoUrl, footerLogoUrl, settings }: { programs: Program[]; logoUrl?: string; footerLogoUrl?: string; settings: SiteSettings }) {
  const displayLogoUrl = footerLogoUrl || logoUrl
  return (
    <footer className="bg-ink text-white pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            {displayLogoUrl ? (
              <Image
                src={displayLogoUrl}
                alt="Tiny Thinkers Learning Center"
                width={96}
                height={120}
                sizes="96px"
                className="mb-3 h-[120px] w-auto object-contain"
              />
            ) : (
              <>
                <p
                  className="text-2xl font-black text-pink mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Tiny Thinkers
                </p>
                <p
                  className="text-xs font-bold text-teal uppercase tracking-widest mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Learning Center
                </p>
              </>
            )}
            <p className="text-sm text-white/60 leading-relaxed">
              Nurturing curious minds through play-based learning in a safe, joyful environment.
            </p>
          </div>

          {/* Programs */}
          <div>
            <h4
              className="text-sm font-800 text-white/80 uppercase tracking-wider mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Programs
            </h4>
            <ul className="space-y-2">
              {programs.slice(0, 8).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/programs/${p.slug}`}
                    className="text-sm text-white/60 hover:text-pink transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* School */}
          <div>
            <h4
              className="text-sm font-800 text-white/80 uppercase tracking-wider mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              School
            </h4>
            <ul className="space-y-2">
              {schoolLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-pink transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4
              className="text-sm font-800 text-white/80 uppercase tracking-wider mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Connect
            </h4>
            <ul className="space-y-3">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={canonicalFacebookUrl(settings.facebookUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-pink transition-colors"
                  >
                    {s.icon}
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={settings.googleMapsUrl || SCHOOL_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-white/60 hover:text-pink transition-colors"
                >
                  <span>📍</span>
                  <span>{formatAddress(settings.address)}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email || SCHOOL_EMAIL}`}
                  className="text-sm text-white/60 hover:text-pink transition-colors"
                >
                  {settings.email || SCHOOL_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={phoneHref(settings.phone)}
                  className="text-sm text-white/60 hover:text-pink transition-colors"
                >
                  {displayPhone(settings.phone)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Tiny Thinkers Learning Center. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
