import { CollectionConfig } from 'payload';

const Backlinks: CollectionConfig = {
  slug: 'backlinks',
  admin: {
    useAsTitle: 'domain', // Use the email field as the title in the admin panel
  },
  labels: {
    singular: 'Backlink',
    plural: 'Backlinks',
  },
  fields: [
    {
      name: 'domain',
      type: 'text',
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
        // Add more sources as needed
      ],
      required: true,
    },
    {
      name: 'dateFetched',
      type: 'date',
      required: true,
    },
  ],
};

export default Backlinks;
