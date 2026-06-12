import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AnnouncementTicker from '@/components/AnnouncementTicker'
import { getPrograms, getSiteSettings } from '@/lib/api'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Tiny Thinkers Learning Center | Your Child's Best Beginning",
  description: 'A progressive playschool in Quezon City for children ages 1.5 to 5 years. Play-based, holistic, small-class learning since 2024.',
  openGraph: {
    title: "Tiny Thinkers Learning Center | Your Child's Best Beginning",
    description: 'A progressive playschool in Quezon City for children ages 1.5 to 5 years. Play-based, holistic, small-class learning since 2024.',
    siteName: 'Tiny Thinkers Learning Center',
  },
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
    <html lang="en" className={nunito.variable}>
      <body>
        <AnnouncementTicker />
        <Nav logoUrl={logoUrl} />
        <main>{children}</main>
        <Footer programs={programs} logoUrl={logoUrl} footerLogoUrl={footerLogoUrl} />
      </body>
    </html>
  )
}
