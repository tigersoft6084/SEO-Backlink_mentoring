import type { CollectionConfig } from 'payload';

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  access: {
    create: () => true,
    read: ({ req: { user } }) => user?.role === 'admin', // Role-based access control
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (data.password) {
            const bcrypt = await import('bcrypt');
            data.password = await bcrypt.hash(data.password, 10);
          }
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'password',
      type: 'text',
      required: true,
      admin: {
        readOnly: true, // Password not visible in admin panel
      },
    },
  ],
};

export default Credentials;
