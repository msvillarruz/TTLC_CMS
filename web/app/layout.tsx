import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AnnouncementTicker from '@/components/AnnouncementTicker'
import { getPrograms, getSiteSettings } from '@/lib/api'
import JsonLd from '@/components/JsonLd'
import { schoolStructuredData } from '@/lib/seo'
import { SITE_URL } from '@/lib/seo-utils'

const nunito = Nunito({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-nunito',
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [programs, siteSettings] = await Promise.all([
    getPrograms().catch(() => []),
    getSiteSettings().catch(() => ({})),
  ])
  const settings = siteSettings as import('@/lib/api').SiteSettings
  const logoUrl = settings.logo?.url
  const footerLogoUrl = settings.footerLogo?.url

  return (
    <html lang="en-PH" className={nunito.variable}>
      <body>
        <JsonLd data={schoolStructuredData(settings)} />
        <AnnouncementTicker />
        <Nav logoUrl={logoUrl} mapsUrl={settings.googleMapsUrl} />
        <main>{children}</main>
        <Footer programs={programs} logoUrl={logoUrl} footerLogoUrl={footerLogoUrl} settings={settings} />
      </body>
    </html>
  )
}
