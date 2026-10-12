import type { Metadata } from 'next'
import { getSiteSettings, resolveMediaUrl, type SiteSettings } from './api'
import { contentDate, pageUrl, SCHOOL_ID, SCHOOL_NAME, SITE_DESCRIPTION, SITE_URL } from './seo-utils'

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
    alternates: { canonical: url },
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

export function schoolStructuredData(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization', '@id': SCHOOL_ID,
        name: settings.schoolName || SCHOOL_NAME, url: pageUrl(),
        description: SITE_DESCRIPTION,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address || '113 West Avenue, Brgy. Bungad, Quezon City',
          addressLocality: 'Quezon City', addressCountry: 'PH',
        },
        ...(settings.phone && { telephone: settings.phone }),
        ...(settings.email && { email: settings.email }),
        ...(settings.logo?.url && { logo: resolveMediaUrl(settings.logo.url) }),
        sameAs: [settings.facebookUrl, settings.instagramUrl, settings.tiktokUrl].filter(Boolean),
      },
      {
        '@type': 'WebSite', '@id': `${SITE_URL}/#website`,
        name: SCHOOL_NAME, url: pageUrl(), publisher: { '@id': SCHOOL_ID }, inLanguage: 'en-PH',
      },
    ],
  }
}

export function webPageStructuredData(path: string, name: string, updatedAt?: string) {
  const dateModified = contentDate(updatedAt)
  return {
    '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${pageUrl(path)}#webpage`,
    url: pageUrl(path), name, inLanguage: 'en-PH',
    isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': SCHOOL_ID },
    ...(dateModified && { dateModified }),
  }
}
