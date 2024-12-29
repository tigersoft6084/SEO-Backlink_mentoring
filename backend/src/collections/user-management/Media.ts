import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  upload: {
    staticDir: './uploads', // Path to store uploaded files
    mimeTypes: ['image/*'], // Restrict uploads to images
  },
  fields: [
    {
      name: 'altText',
      type: 'text',
      required: false, // Optional alternative text for accessibility
    },
  ],
};
