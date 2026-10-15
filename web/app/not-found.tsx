import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found | Tiny Thinkers Learning Center',
  description: 'This page is not on the Tiny Thinkers website. Visit the homepage, programs, or the trial request form.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="px-4 py-24 text-center" style={{ background: 'linear-gradient(135deg, #FFF5FB 0%, #F0FFFE 100%)' }}>
      <div className="mx-auto max-w-xl">
        <h1 className="mb-4 text-4xl font-black text-ink sm:text-5xl">Page not found</h1>
        <p className="mb-8 text-lg text-ink/70">
          This page is not on the Tiny Thinkers website. The links below are the best place to continue.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/" className="rounded-xl px-6 py-3 font-extrabold text-white" style={{ background: '#E83D8F' }}>
            Home
          </Link>
          <Link href="/programs" className="rounded-xl border-2 border-ink/20 px-6 py-3 font-extrabold text-ink">
            Programs
          </Link>
          <Link href="/contact" className="rounded-xl border-2 border-ink/20 px-6 py-3 font-extrabold text-ink">
            Contact
          </Link>
        </div>
      </div>
    </section>
  )
}
