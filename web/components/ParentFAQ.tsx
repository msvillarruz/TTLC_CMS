import Link from 'next/link'
import type { Program, SiteSettings } from '@/lib/api'
import { programAgeRange } from '@/lib/seo-utils'

export default function ParentFAQ({ programs, settings }: { programs: Program[]; settings: SiteSettings }) {
  return (
    <section className="py-16 px-4 bg-white" aria-labelledby="parent-faq-title">
      <div className="max-w-4xl mx-auto">
        <h2 id="parent-faq-title" className="text-3xl font-black text-ink mb-8">Questions from Parents</h2>
        <div className="space-y-7 text-ink/70 leading-relaxed">
          <div>
            <h3 className="text-lg font-extrabold text-ink mb-2">Where is Tiny Thinkers Learning Center?</h3>
            <p>Visit us at {settings.address || '113 West Avenue, Brgy. Bungad, Quezon City'}. <Link href="/contact" className="text-pink underline">Find directions and contact details.</Link></p>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-ink mb-2">What ages are the classes for?</h3>
            {programs.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {programs.map((p) => <li key={p.id}><Link href={`/programs/${p.slug}`} className="text-pink underline">{p.name}</Link>: {programAgeRange(p)}.</li>)}
              </ul>
            ) : <p><Link href="/programs" className="text-pink underline">Check our programs</Link> or contact the school to confirm age eligibility.</p>}
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-ink mb-2">How can I book a free trial class?</h3>
            <p>Complete the <Link href="/contact" className="text-pink underline">trial request form</Link> with your preferred program and date. The school will confirm your schedule. The trial is free and has no enrollment commitment.</p>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-ink mb-2">Where can I find class schedules and tuition information?</h3>
            <p>Class schedules are listed on the <Link href="/programs" className="text-pink underline">program pages</Link>. <Link href="/contact" className="text-pink underline">Contact the school</Link> for current tuition, inclusions and available places.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
