// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from '../collections/user-management/Users.ts';
import { Credentials } from '../collections/user-management/Credentials.ts';
import { Backlinks } from '@/collections/Backlinks.ts';

import { Media } from '@/collections/user-management/Media.ts';
import { customEndpoints } from '@/endpoints/index.ts';
import { FRONTEND_URL } from './apiConfig.ts';
import { DomainsForBackgroundProcess } from '@/collections/DomainsForBackgroundProcess.ts';
import { SiteSettings } from '@/globals/sideSettings.ts';
import { startCronJob } from '@/services/cronJob.ts';
import PayPalPlans from '@/collections/paypal.ts';
import { createPlansAndGetID } from '@/services/paypal/plan/CreatePlan.ts';


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Credentials, Backlinks, DomainsForBackgroundProcess, PayPalPlans],
  globals : [SiteSettings],
  cors: {origins : [FRONTEND_URL]}, // Allow requests from your frontend

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key', // Ensure this is defined
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/BackLinkingDB',
  }),
  sharp,
  plugins: [
    // Add your plugins here
  ],
  endpoints: [
    ...(customEndpoints || []), // Ensure customEndpoints is defined
  ],
  onInit : async(payload) => {
    console.log('Paypal plan check');
    createPlansAndGetID(payload)
    console.log('Payload is initialized.');
    startCronJob(payload);
  }
});
