import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Slides } from './src/payload/collections/Slides'
import { Products } from './src/payload/collections/Products'
import { Leads } from './src/payload/collections/Leads'
import { News } from './src/payload/collections/News'
import { Testimonials } from './src/payload/collections/Testimonials'
import { Awards } from './src/payload/collections/Awards'
import { Partners } from './src/payload/collections/Partners'
import { Media } from './src/payload/collections/Media'

// Globals
import { SiteSettings } from './src/payload/globals/SiteSettings'
import { ThemeSettings } from './src/payload/globals/ThemeSettings'
import { HeaderSettings } from './src/payload/globals/HeaderSettings'
import { FooterSettings } from './src/payload/globals/FooterSettings'
import { HomepageLayout } from './src/payload/globals/HomepageLayout'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: '/payload-admin',
  },
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Shinhan Admin',
    },
  },
  collections: [
    // Custom collections
    Slides,
    Products,
    Leads,
    News,
    Testimonials,
    Awards,
    Partners,
    Media,
    // Built-in Users
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
  ],
  globals: [
    SiteSettings,
    ThemeSettings,
    HeaderSettings,
    FooterSettings,
    HomepageLayout,
  ],
  editor: lexicalEditor({}),
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || `file:${path.join(dirname, 'shinhan.db')}`,
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'shinhan-super-secret-key-123456789',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})

