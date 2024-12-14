import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email', // Use the email field as the title in the admin panel
  },
  auth: true, // Enable authentication for this collection
  fields: [
    // Email field is added by default in auth-enabled collections
    {
      name: 'role',
      type: 'select',
      required: true, // Make role selection mandatory
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: 'user', // Default role is 'user'
    },
    // Add more fields as needed, for example, a username or profile picture field
    {
      name: 'username',
      type: 'text',
      required: false, // Optional field
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

