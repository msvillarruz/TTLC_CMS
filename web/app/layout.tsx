import type { Metadata } from 'next'
import { Nunito, Lora } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AnnouncementTicker from '@/components/AnnouncementTicker'
import { getAnnouncements, getPrograms } from '@/lib/api'

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
  const [announcements, programs] = await Promise.all([
    getAnnouncements().catch(() => []),
    getPrograms().catch(() => []),
  ])

  return (
    <html lang="en" className={`${nunito.variable} ${lora.variable}`}>
      <body>
        <AnnouncementTicker announcements={announcements} />
        <Nav />
        <main>{children}</main>
        <Footer programs={programs} />
      </body>
    </html>
  )
}
