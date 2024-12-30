import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    // Additional auth configuration can be added here if needed
  },
  access: {
    create: () => true,  // Allow creation for all
    update: ({ req }) => req.user?.role === 'admin', // Allow only admins to update
    read: () => true
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'username',
      type: 'text',
      required: false,
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media', // Reference the "media" collection
      required: false,
    },
    {
      name: 'authProvider',
      type: 'text',  // To track which auth provider was used (Google)
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req }) => {
        // Hook to log request headers (useful for debugging)
        console.log('Request Headers:', req?.headers);
      },
    ],
  },
};
