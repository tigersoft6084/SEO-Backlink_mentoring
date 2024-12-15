import { CollectionConfig } from 'payload';
import bcrypt from 'bcrypt';

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  access: {
    create: () => true,
    read: ({ req }) => {
      const apiKey = req.headers.get('authorization')?.split(' ')[1];
      const user = req.user;
      if (user?.role === 'admin') {
        return true;
      }
      return apiKey === '1f9f45b67d96408c287924b9';
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if ((operation === 'create' || operation === 'update') && data?.password) {
          data.password = await bcrypt.hash(data.password, 10);
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
      // admin: {
      //   readOnly: true, // Ensures the password is not visible in the admin panel
      // },
    },
  ],
};

export default Credentials;
