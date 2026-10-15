import Link from 'next/link'
import type { FaqEntry } from '@/lib/faqs'

export default function ParentFAQ({ faqs }: { faqs: FaqEntry[] }) {
  return (
    <section id="parent-faq" className="py-16 px-4 bg-white" aria-labelledby="parent-faq-title">
      <div className="max-w-4xl mx-auto">
        <h2 id="parent-faq-title" className="text-3xl font-black text-ink mb-8">Questions from Parents</h2>
        <div className="space-y-7 text-ink/70 leading-relaxed">
          {faqs.map((faq) => (
            <div key={faq.id} data-owner-todo={faq.ownerTodo}>
              <h3 className="text-lg font-extrabold text-ink mb-2">{faq.question}</h3>
              <p>
                {faq.answer}
                {faq.links?.map((link) => (
                  <Link key={link.href + link.label} href={link.href} className="text-pink underline ml-1">
                    {`${link.label}.`}
                  </Link>
                ))}
              </p>
              {faq.bullets && faq.bullets.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {faq.bullets.map((bullet) => (
                    <li key={bullet.label}>
                      {bullet.href ? (
                        <Link href={bullet.href} className="text-pink underline">{bullet.label}</Link>
                      ) : bullet.label}
                      {bullet.detail ? `: ${bullet.detail}.` : '.'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
