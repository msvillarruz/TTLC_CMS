import type { Metadata } from 'next'
import { Nunito, Lora } from 'next/font/google'
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

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tiny Thinkers Learning Center',
  description: 'Nurturing curious minds through play-based learning in Caloocan, Philippines.',
  openGraph: {
    title: 'Tiny Thinkers Learning Center',
    description: 'Nurturing curious minds through play-based learning.',
    siteName: 'Tiny Thinkers Learning Center',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [programs, siteSettings] = await Promise.all([
    getPrograms().catch(() => []),
    getSiteSettings().catch(() => ({})),
  ])
  const logoUrl = (siteSettings as import('@/lib/api').SiteSettings).logo?.url

  return (
    <html lang="en" className={`${nunito.variable} ${lora.variable}`}>
      <body>
        <AnnouncementTicker />
        <Nav logoUrl={logoUrl} />
        <main>{children}</main>
        <Footer programs={programs} logoUrl={logoUrl} />
      </body>
    </html>
  )
}
