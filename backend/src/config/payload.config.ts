// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from '../collections/user-management/Users';
import { Credentials } from '../collections/user-management/Credentials';
import Backlinks from '@/collections/Backlinks';
import { customEndpoints } from '@/endpoints';
import { Media } from '@/collections/user-management/Media';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Credentials, Backlinks],
  cors: ['http://localhost:1212'], // Allow requests from your frontend

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key', // Ensure this is defined
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/your-database-name',
  }),
  sharp,
  plugins: [
    // Add your plugins here
  ],
  endpoints: [
    ...(customEndpoints || []), // Ensure customEndpoints is defined
  ],
});
