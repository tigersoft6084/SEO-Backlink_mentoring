// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from '../collections/user-management/Users'
import { Credentials } from '../collections/user-management/Credentials'

// import { Scrapers } from '@/collections/scraping/Scrapers'
import { WebsiteForScraping } from '@/collections/scraping/WebsiteForScraping'
import {fetchSerpEndpoint} from '../endpoints/fetchSerpEndpoint';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)


export default buildConfig({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: path.resolve(dirname),
      },
    },
    collections: [Users, Credentials, WebsiteForScraping],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: mongooseAdapter({
      url: process.env.DATABASE_URI || '',
    }),
    sharp,
    plugins: [
      payloadCloudPlugin(),
      // storage-adapter-placeholder
    ],
    endpoints: [
      fetchSerpEndpoint
    ],
})
