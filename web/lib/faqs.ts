import type { Program, SiteSettings } from './api.ts'
import {
  classSizeLabel,
  displayPhone,
  formatAddress,
  pageUrl,
  programAgeRange,
  programScheduleLine,
  SCHOOL_EMAIL,
  SCHOOL_FOUNDED_LABEL,
  SCHOOL_HOURS,
  SCHOOL_NAME,
} from './seo-utils.ts'

export type FaqBullet = { label: string; detail?: string; href?: string }
export type FaqLink = { label: string; href: string }

export type FaqEntry = {
  id: string
  question: string
  answer: string
  bullets?: FaqBullet[]
  links?: FaqLink[]
  /**
   * Owner-only note. Rendered as a data attribute so it can be found in the
   * page source, and omitted from FAQPage text, llms.txt, and the visible answer.
   */
  ownerTodo?: string
}

function absoluteHref(href: string) {
  return href.startsWith('http') ? href : pageUrl(href)
}

export function faqSchemaText(faq: FaqEntry) {
  const bullets = (faq.bullets ?? [])
    .map((bullet) => {
      const detail = bullet.detail ? `${bullet.label}: ${bullet.detail}` : bullet.label
      return bullet.href ? `${detail} (${absoluteHref(bullet.href)})` : detail
    })
    .join(' ')
  const links = (faq.links ?? [])
    .map((link) => `${link.label} (${absoluteHref(link.href)})`)
    .join(' ')
  return [faq.answer, bullets, links].filter(Boolean).join(' ')
}

function classSizeAnswer(programs: Program[]) {
  const labeled = programs
    .map((program) => ({ name: program.name, label: classSizeLabel(program.classSize) }))
    .filter((program): program is { name: string; label: string } => Boolean(program.label))
  const unique = [...new Set(labeled.map((program) => program.label))]
  if (labeled.length === programs.length && programs.length > 0 && unique.length === 1) {
    const phrase = unique[0]
    return phrase.toLowerCase().startsWith('maximum')
      ? `Each class has a ${phrase.charAt(0).toLowerCase()}${phrase.slice(1)}.`
      : `Class size: ${phrase}.`
  }
  if (labeled.length) {
    return labeled.map((program) => `${program.name}: ${program.label}`).join('. ') + '.'
  }
  return 'Tiny Thinkers publishes a maximum of 8 children per class.'
}

export function parentFaqs(programs: Program[], settings: SiteSettings): FaqEntry[] {
  const address = formatAddress(settings.address)
  const phone = displayPhone(settings.phone)
  const email = settings.email?.trim() || SCHOOL_EMAIL
  const ages = programs.map((program) => ({
    label: program.name,
    detail: programAgeRange(program),
    href: `/programs/${program.slug}`,
  }))
  const classes = programs.map((program) => ({
    label: program.name,
    detail: program.classType,
    href: `/programs/${program.slug}`,
  }))
  const times = programs
    .map((program) => ({ label: program.name, detail: programScheduleLine(program), href: `/programs/${program.slug}` }))
    .filter((program) => program.detail)

  return [
    {
      id: 'location',
      question: `Where is ${SCHOOL_NAME}?`,
      answer: `Visit us at ${address}.`,
      links: [{ label: 'Find directions and contact details', href: '/contact' }],
    },
    {
      id: 'ages',
      question: 'What ages are the classes for?',
      answer: programs.length
        ? 'Classes are grouped by age.'
        : 'Age groups are listed on the program pages. Contact the school to confirm eligibility.',
      bullets: ages,
      links: programs.length ? undefined : [{ label: 'Check our programs', href: '/programs' }],
    },
    {
      id: 'programs',
      question: 'Which classes can my child join?',
      answer: programs.length
        ? 'These are the classes currently listed.'
        : 'The current classes are listed on the programs page.',
      bullets: classes,
      links: programs.length ? [{ label: 'Compare all programs', href: '/programs' }] : undefined,
    },
    {
      id: 'class-size',
      question: 'How many children are in a class?',
      answer: classSizeAnswer(programs),
    },
    {
      id: 'class-times',
      question: 'What time are the classes?',
      answer: times.length
        ? 'Class times depend on the program.'
        : 'Class times are listed on the program pages.',
      bullets: times,
      links: [{ label: 'See program schedules', href: '/programs' }],
    },
    {
      id: 'hours',
      question: "What are the center's hours?",
      answer: `The center is open ${SCHOOL_HOURS.label}.`,
    },
    {
      id: 'trial',
      question: 'How can I book a free trial class?',
      answer: 'Complete the trial request form with your preferred program and date. The school will confirm your schedule. The trial is free and has no enrollment commitment.',
      links: [{ label: 'Trial request form', href: '/contact' }],
    },
    {
      id: 'opened',
      question: 'When did Tiny Thinkers open?',
      answer: `Tiny Thinkers opened in ${SCHOOL_FOUNDED_LABEL}.`,
    },
    {
      id: 'contact',
      question: 'How do I contact the school?',
      answer: `Call ${phone} or email ${email}.`,
      links: [{ label: 'Contact page', href: '/contact' }],
    },
    {
      id: 'approach',
      question: 'What is learning like at Tiny Thinkers?',
      answer: settings.mission?.trim()
        || 'A play-based learning center dedicated to fostering curiosity, creativity, and confidence in every child.',
    },
    {
      id: 'tuition',
      question: 'How much is tuition?',
      answer: 'Contact the school for current tuition, inclusions and available places.',
      links: [{ label: 'Contact the school', href: '/contact' }],
      ownerTodo: 'TODO(owner): replace with the approved tuition, inclusions, and exclusions. Do not invent amounts.',
    },
    {
      id: 'requirements',
      question: 'What are the enrollment requirements?',
      answer: 'Contact the school for the current enrollment requirements.',
      links: [{ label: 'Contact the school', href: '/contact' }],
      ownerTodo: 'TODO(owner): replace with the approved requirements checklist. Do not invent documents, age cutoffs, or forms.',
    },
  ]
}
