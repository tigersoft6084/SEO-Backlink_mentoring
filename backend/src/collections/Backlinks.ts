import { CollectionConfig } from 'payload';

export const Backlinks: CollectionConfig = {
  slug: 'backlinks',
  admin: {
    useAsTitle: 'domain', // Use the email field as the title in the admin panel
  },
  access: {
    read: () => true,
    create: () => true,  // Allow creation for all
    update: ({ req }) => req.user?.role === 'admin', // Allow only admins to update
  },
  fields: [
    {
      name: 'domain',
      type: 'text',
      index: true,
      required: true,
    },
    {
        name: 'RD',
        type: 'number', // Referring Domains
        required: true,
      },
    {
      name: 'TF',
      type: 'number', // Trust Flow
      required: true,
    },
    {
      name: 'CF',
      type: 'number', // Citation Flow
      required: true,
    },
    {
      name: 'price',
      type: 'number', // Price
      required: true,
    },
    {
      name: 'source',
      type: 'select', // Source of the backlink (Paper Club, Press Whizz, etc.)
      options: [
        { label: 'Paper Club', value: 'paper_club' },
        { label: 'Press Whizz', value: 'press_whizz' },
        { label: 'Bulldoz', value: 'bulldoz' },
        { label: 'Prensalink', value: 'prensalink' },
        { label: 'SeoJungle', value: 'seoJungle' },
        // Add more sources as needed
      ],
      required: true,
    },
    {
      name: 'expiry date',
      type: 'text',
    },
    {
      name: 'dateFetched',
      type: 'date',
      required: true,
    },
  ],
};
