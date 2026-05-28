import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Programs } from './collections/Programs'
import { Articles } from './collections/Articles'
import { Events, Announcements, TrialRequests, Authors, Categories, Media, Parents } from './collections/index'
import { SiteSettings, HomePage } from './globals/index'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    Programs,
    Articles,
    Events,
    Announcements,
    TrialRequests,
    Authors,
    Categories,
    Media,
    Parents,
  ],
  globals: [
    SiteSettings,
    HomePage,
  ],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  cors: [
    process.env.NEXT_PUBLIC_SITE_URL || '',
    'https://tinythinkers.edu.ph',
  ].filter(Boolean),
  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL || '',
    'https://tinythinkers.edu.ph',
  ].filter(Boolean),
})
