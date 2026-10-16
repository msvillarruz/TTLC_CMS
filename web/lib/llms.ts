import type { Program, SiteSettings } from './api.ts'
import { faqSchemaText, parentFaqs } from './faqs.ts'
import {
  canonicalFacebookUrl,
  classSizeLabel,
  displayPhone,
  formatAddress,
  pageUrl,
  programAgeRange,
  programFocuses,
  programScheduleLine,
  recordPath,
  SCHOOL_EMAIL,
  SCHOOL_FOUNDED_LABEL,
  SCHOOL_HOURS,
  SCHOOL_NAME,
  SCHOOL_POSTAL_CODE,
  withCanonicalProgramSlug,
} from './seo-utils.ts'

function programLine(program: Program, detailed: boolean) {
  const facts = [
    program.classType,
    programAgeRange(program),
    programScheduleLine(program),
    classSizeLabel(program.classSize),
  ].filter(Boolean)
  const focuses = programFocuses(program)
  const extra = detailed
    ? [
      focuses.length ? `Focuses: ${focuses.join(', ')}` : '',
      program.specialNote?.trim() ? `Note: ${program.specialNote.trim()}` : '',
      program.description?.trim() || '',
    ].filter(Boolean)
    : []
  const summary = [...facts, ...extra].join('. ')
  const name = program.name.replace(/[\[\]\r\n]/g, ' ')
  return `- [${name}](${pageUrl(recordPath('programs', program.slug))}): ${summary}`
}

export function llmsDocument(settings: SiteSettings, programs: Program[], full = false) {
  programs = programs.map(withCanonicalProgramSlug)
  const address = formatAddress(settings.address)
  const phone = displayPhone(settings.phone)
  const email = settings.email?.trim() || SCHOOL_EMAIL
  const facebook = canonicalFacebookUrl(settings.facebookUrl)
  const faqs = parentFaqs(programs, settings)
  const classSize = faqs.find((faq) => faq.id === 'class-size')
  const lines = [
    `# ${SCHOOL_NAME}`,
    '',
    `> Play-based preschool in Quezon City, Philippines. Opened ${SCHOOL_FOUNDED_LABEL}.`,
    '',
    `Location: ${address}`,
    `Postal code: ${SCHOOL_POSTAL_CODE}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Hours: ${SCHOOL_HOURS.label}`,
    `Class size: ${classSize ? faqSchemaText(classSize) : 'See each program page.'}`,
    `Facebook: ${facebook}`,
    ...(settings.instagramUrl ? [`Instagram: ${settings.instagramUrl}`] : []),
    '',
    '## Official pages',
    '',
    `- [Home](${pageUrl()})`,
    `- [Programs](${pageUrl('/programs')})`,
    `- [About and team](${pageUrl('/about')})`,
    `- [Trial booking and contact](${pageUrl('/contact')})`,
    `- [Articles](${pageUrl('/articles')})`,
    `- [Events](${pageUrl('/events')})`,
    `- [Announcements](${pageUrl('/announcements')})`,
    `- [Parent questions](${pageUrl('/#parent-faq')})`,
    '',
    '## Programs',
    '',
    ...(programs.length ? programs.map((program) => programLine(program, full)) : ['- Program details are published at the programs page.']),
    '',
  ]

  if (full) {
    lines.push(
      '## Questions from parents',
      '',
      ...faqs.flatMap((faq) => [`### ${faq.question}`, '', faqSchemaText(faq), '']),
    )
  } else {
    lines.push(
      '## For parents',
      '',
      '- Trial classes are free and have no enrollment commitment.',
      '- Class schedules are on each program page. Contact the school for current tuition, inclusions, available places, and enrollment requirements.',
      `- Ages, class times, and the full parent Q&A: [llms-full.txt](${pageUrl('/llms-full.txt')})`,
      '',
    )
  }

  return lines.join('\n')
}
