import type { Metadata } from 'next'
import { getSiteSettings, resolveMediaUrl, type Program, type SiteSettings } from './api.ts'
import { faqSchemaText, type FaqEntry } from './faqs.ts'
import {
  canonicalFacebookUrl,
  classCapacity,
  contentDate,
  displayPhone,
  pageUrl,
  postalAddress,
  programAgeRange,
  programFocuses,
  recordPath,
  SCHOOL_FOUNDED,
  SCHOOL_GEO,
  SCHOOL_HOURS,
  SCHOOL_ID,
  SCHOOL_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
} from './seo-utils.ts'

export async function pageMetadata({ path, title, description, image, article }: {
  path: string
  title: string
  description: string
  image?: { url: string; alt?: string }
  article?: { publishedAt?: string; updatedAt?: string; author?: string }
}): Promise<Metadata> {
  const settings = await getSiteSettings().catch((): SiteSettings => ({}))
  const selectedImage = image ?? settings.ogImage
  const imageUrl = resolveMediaUrl(selectedImage?.url) || `${SITE_URL}/opengraph-image`
  const images = [{ url: imageUrl, alt: selectedImage?.alt || SCHOOL_NAME }]
  const url = pageUrl(path)
  const publishedTime = contentDate(article?.publishedAt)
  const modifiedTime = contentDate(article?.updatedAt)
  return {
    title,
    description,
    alternates: { canonical: url, languages: { 'en-PH': url } },
    openGraph: {
      title, description, url, siteName: SCHOOL_NAME, locale: 'en_PH', images,
      ...(article ? {
        type: 'article' as const,
        ...(publishedTime && { publishedTime }),
        ...(modifiedTime && { modifiedTime }),
        ...(article.author && { authors: [article.author] }),
      } : { type: 'website' as const }),
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  }
}

function socialProfiles(settings: SiteSettings) {
  return [...new Set([
    canonicalFacebookUrl(settings.facebookUrl),
    settings.instagramUrl?.trim(),
    settings.tiktokUrl?.trim(),
  ].filter((url): url is string => Boolean(url)))]
}

export function schoolStructuredData(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['EducationalOrganization', 'Preschool', 'ChildCare'],
        '@id': SCHOOL_ID,
        name: settings.schoolName || SCHOOL_NAME,
        url: pageUrl(),
        description: SITE_DESCRIPTION,
        telephone: displayPhone(settings.phone),
        foundingDate: SCHOOL_FOUNDED,
        address: postalAddress(settings.address),
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SCHOOL_GEO.latitude,
          longitude: SCHOOL_GEO.longitude,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [...SCHOOL_HOURS.days],
          opens: SCHOOL_HOURS.opens,
          closes: SCHOOL_HOURS.closes,
        },
        ...(settings.email?.trim() && { email: settings.email.trim() }),
        ...(settings.logo?.url && { logo: resolveMediaUrl(settings.logo.url) }),
        sameAs: socialProfiles(settings),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SCHOOL_NAME,
        url: pageUrl(),
        publisher: { '@id': SCHOOL_ID },
        inLanguage: 'en-PH',
      },
    ],
  }
}

export function webPageStructuredData(path: string, name: string, updatedAt?: string) {
  const dateModified = contentDate(updatedAt)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl(path)}#webpage`,
    url: pageUrl(path),
    name,
    inLanguage: 'en-PH',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': SCHOOL_ID },
    ...(dateModified && { dateModified }),
  }
}

export function breadcrumbStructuredData(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: pageUrl(item.path),
    })),
  }
}

export function faqPageStructuredData(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faqSchemaText(faq) },
    })),
  }
}

export function programDescription(program: Program) {
  if (program.description?.trim()) return program.description.trim()
  const schedule = program.schedule?.trim()
  return `${program.name}: ${program.classType} for ${programAgeRange(program)} at Tiny Thinkers in Quezon City.${schedule ? ` Class time: ${schedule}.` : ''} Book a free trial.`
}

export function programCourseStructuredData(program: Program) {
  const focuses = programFocuses(program)
  const capacity = classCapacity(program.classSize)
  const path = recordPath('programs', program.slug)
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${pageUrl(path)}#course`,
    name: program.name,
    description: programDescription(program),
    url: pageUrl(path),
    provider: { '@id': SCHOOL_ID },
    educationalLevel: program.classType,
    inLanguage: 'en-PH',
    ...(focuses.length ? { teaches: focuses } : {}),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      location: { '@id': SCHOOL_ID },
      ...(program.schedule?.trim() ? { courseSchedule: program.schedule.trim() } : {}),
      ...(program.duration?.trim() ? { courseWorkload: program.duration.trim() } : {}),
      ...(capacity ? { maximumAttendeeCapacity: capacity } : {}),
    },
  }
}

export function programListStructuredData(programs: Program[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tiny Thinkers programs',
    itemListElement: programs.map((program, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: program.name,
      url: pageUrl(recordPath('programs', program.slug)),
      item: {
        '@type': 'Course',
        name: program.name,
        description: programDescription(program),
        url: pageUrl(recordPath('programs', program.slug)),
        provider: { '@id': SCHOOL_ID },
      },
    })),
  }
}
