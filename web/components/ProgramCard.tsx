import Link from 'next/link'
import type { Program } from '@/lib/api'
import { resolveColor } from '@/lib/api'
import { PROGRAM_COLORS } from '@/lib/content'
import { programAgeRange, programFocuses } from '@/lib/seo-utils'

export default function ProgramCard({ program, showFocuses = false }: { program: Program; showFocuses?: boolean }) {
  const color = PROGRAM_COLORS[program.name] || resolveColor(program.accentColor)
  const ageRange = programAgeRange(program)
  const focuses = programFocuses(program)

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
      style={{ boxShadow: '0 4px 20px rgba(28,43,74,0.08)', borderTop: `4px solid ${color}` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-black"
            style={{ background: color }}
          >
            {program.name[0]}
          </div>
          <span
            className="text-xs font-extrabold px-3 py-1 rounded-full text-white"
            style={{ background: color }}
          >
            {program.classType}
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-ink mb-1 group-hover:text-pink transition-colors">
          {program.name}
        </h3>

        <p className="text-sm text-ink/60 mb-3">{ageRange}</p>

        {program.schedule && (
          <p className="text-xs text-ink/50 mb-3">{program.schedule}</p>
        )}

        {showFocuses && focuses.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {focuses.slice(0, 2).map((focus, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: `${color}18`,
                  color,
                }}
              >
                {focus}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
