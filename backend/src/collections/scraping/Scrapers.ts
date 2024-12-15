import type { CollectionConfig } from 'payload';
import { customEndpoints } from '@/endpoints';
import { scraperService } from '../../services/scraperService';
import { sendDataToPayload } from '../../services/payloadService';

export const Scrapers: CollectionConfig = {
  slug: 'scrapers',
  fields: [], // Define fields if necessary
  access: {
    create: () => false, // Restrict create access
  },
  endpoints: customEndpoints ,
};
