import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Programs } from './collections/Programs'
import {
  Articles,
  Events,
  Announcements,
  TrialRequests,
  Authors,
  Categories,
  Media,
  Parents,
} from './collections/index'
import { SiteSettings, HomePage } from './globals/index'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Tiny Thinkers CMS',
      favicon: '/favicon.ico',
      ogImage: '/og-image.png',
    },
  },

  collections: [
    // Content
    Programs,
    Articles,
    Events,
    Announcements,
    TrialRequests,
    // Supporting
    Authors,
    Categories,
    Media,
    // Future
    Parents,
  ],

  globals: [
    SiteSettings,
    HomePage,
  ],

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },

  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,

  cors: [
    process.env.NEXT_PUBLIC_SITE_URL || '',
    'https://tinythinkers.edu.ph',
    'https://www.tinythinkers.edu.ph',
  ].filter(Boolean),

  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL || '',
    'https://tinythinkers.edu.ph',
  ].filter(Boolean),

  upload: {
    limits: {
      fileSize: 10_000_000, // 10MB max upload
    },
  },

  rateLimit: {
    max: 500,
    trustProxy: true,
  },
})
