import type { CollectionConfig } from 'payload';
import { API_KEY } from '@/config/apiConfig';

export const WebsiteForScraping: CollectionConfig = {
  slug: 'websiteForScraping',
  admin: {
    useAsTitle: 'name', // Use the url field as the title in the admin panel
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
        name: 'name',
        type: 'text',
        required: true,
        unique: true,
    },
    {
        name: 'website',
        type: 'text', // Text field for the URL
        required: true, // Make the field mandatory
        label: 'Website URL',
        validate: (value : any) => {
          // Regular expression to validate URLs
          const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
          if (!value || !urlRegex.test(value)) {
            return 'Please enter a valid URL.';
          }
          return true; // Validation passed
        },
        admin: {
          placeholder: 'https://example.com', // Placeholder for the field in the admin panel
        },
    },
  ],
};

