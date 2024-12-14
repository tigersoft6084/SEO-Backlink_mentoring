// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from '../collections/Users'
import { Media } from '../collections/Media'
import { Orders } from '../collections/Orders'
import { Tracking } from '../collections/Orders'

import { fetch, Response, Request, Headers } from 'undici';

// Cast fetch-related objects to match global types
global.fetch = fetch as unknown as typeof globalThis.fetch;
global.Response = Response as unknown as typeof globalThis.Response;
global.Request = Request as unknown as typeof globalThis.Request;
global.Headers = Headers as unknown as typeof globalThis.Headers;


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)


export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Orders, Tracking],
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
})
