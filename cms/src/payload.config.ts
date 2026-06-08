import sharp from 'sharp'
import { buildConfig } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
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
  secret: process.env.PAYLOAD_SECRET || '',
  collections: [
    Users,
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
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_EMAIL || 'hello@tinythinkers.edu.ph',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Tiny Thinkers Learning Center',
    transportOptions: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || 'ttlc-media',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        endpoint: process.env.S3_ENDPOINT || '',
      },
    }),
  ],
  cors: [
    'http://eyuvq0lrx9nsuh0xo7e89brq.5.223.65.121.sslip.io',
    'https://eyuvq0lrx9nsuh0xo7e89brq.5.223.65.121.sslip.io',
    'https://tinythinkers.edu.ph',
    'https://cms.tinythinkers.edu.ph',
  ],
})
