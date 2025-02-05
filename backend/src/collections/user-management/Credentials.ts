import { CollectionConfig } from 'payload';
import { generateKey, encrypt } from '../../utils/encryption.ts';
// import { DataForCreate_CredentialsForMarketplaces } from '@/types/auth.ts';

// Regular expression for validating email format
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const Credentials: CollectionConfig = {
  slug: 'CredentialsForMarketplaces',
  admin: {
    useAsTitle: 'email',
    description: 'Manage user credentials',
  },
  access: {
    create: () => true,
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc }) => {
        const credentialData = data;

        // Email validation
        if (credentialData.email && !emailRegex.test(credentialData.email)) {
          throw new Error('Invalid email format');
        }

        // Only encrypt the password if it's being changed
        if (operation === 'create' || (operation === 'update' && credentialData.password !== originalDoc?.password)) {
          const secretKey = operation === 'create' ? generateKey() : originalDoc?.secretKey;
          credentialData.password = encrypt(credentialData.password, secretKey);
          credentialData.secretKey = secretKey; // Store the secret key in the document
        }

        return credentialData;
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
      validate: (value: string | string[] | null | undefined) => {
        if (typeof value === 'string' && !emailRegex.test(value)) {
          return 'Invalid email format';
        }
        return true;
      }
    },
    {
      name: 'password',
      type: 'text',
      required: true,
      admin: { readOnly: false },
    },
    {
      name: 'secretKey',
      type: 'text',
      admin: { readOnly: true },
      hidden: false,  // This makes it hidden in the admin panel
      defaultValue: generateKey,  // Automatically generates a key if not provided
    },
    {
      name: 'websiteTarget',
      type: 'array', // Change to 'array' for multi-select
      admin: {
        position: 'sidebar',
      },
      required: true,
      fields: [
        {
          name: 'value',
          type: 'select',
          options: [
            { label: 'DataForSeo', value: 'DataForSeo' },
            { label: 'PaperClub', value: 'PaperClub' },
            { label: 'Ereferer', value: 'Ereferer' },
            { label: 'Linkbuilders', value: 'Linkbuilders' },
            { label: 'Prensalink', value: 'Prensalink' },
            { label: 'Seojungle', value: 'Seojungle' },
            { label: 'Mistergoodlink', value: 'Mistergoodlink' },
            { label: 'Boosterlink', value: 'Boosterlink' },
            { label: 'Linkavista', value: 'Linkavista' },
            { label: 'Getalink', value: 'Getalink' },
            { label: 'Develink', value: 'Develink' },
            { label: 'Linkatomic', value: 'Linkatomic' },
            { label: 'Unancor', value: 'Unancor' },
            { label: 'Publisuites', value: 'Publisuites' },
            { label: 'Backlinked', value: 'Backlinked' },
            { label: 'Motherlink', value: 'Motherlink' },
            { label: 'Presswhizz', value: 'Presswhizz' },
            { label: 'Whitepress', value: 'Whitepress' },
            { label: 'Conexoo', value: 'Conexoo' },
            { label: 'Linkbroker', value: 'Linkbroker' },
            { label: 'Conexoo', value: 'Conexoo' },
            { label: 'Prnews', value: 'Prnews' },
            { label: '123mdia', value: '123mdia' },
            { label: 'Soumettre', value: 'Soumettre' },
            { label: '123media', value: '123media' },
            { label: 'Mynilinks', value: 'Mynilinks' },
          ],
        },
      ],
    },
  ],
};

export default Credentials;
