import { CollectionConfig } from 'payload';
import { generateKey, encrypt, decrypt } from '../../utils/encryption';
import { authenticateAndSave } from '../../services/authenticate';

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  access: {
    create: () => true,
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        const updatedData = { ...data }; // Ensure immutability
    
        if ((operation === 'create' || operation === 'update') && updatedData.password) {
          const secretKey = operation === 'create' ? generateKey() : originalDoc?.secretKey || generateKey();
          updatedData.password = encrypt(updatedData.password, secretKey);
          updatedData.secretKey = secretKey;
    
          // Ensure authenticateUrls exist and is an array
          if (Array.isArray(updatedData.authenticateUrls)) {
            const uniqueUrls = Array.from(new Set(updatedData.authenticateUrls.map(urlObj => urlObj.url)));
    
            try {
              await authenticateAndSave(
                req.payload,
                updatedData.email,
                decrypt(updatedData.password, secretKey),
                uniqueUrls
              );
            } catch (error) {
              console.error('Error in authenticateAndSave:', error);
              throw new Error('Authentication failed. Please verify your credentials.');
            }
          }
        }
    
        return updatedData;
      },
    ],
    
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'text', required: true, unique: true },
    { 
      name: 'password', 
      type: 'text', 
      required: true, 
      admin: { readOnly: false } 
    },
    {
      name: 'authenticateUrls',
      type: 'array',
      fields: [
        { name: 'url', type: 'text', required: true },
        { name: 'token', type: 'text', admin: { readOnly: true } },
        { name: 'expiresAt', type: 'date', admin: { readOnly: true } },
      ],
    },
    { 
      name: 'secretKey', 
      type: 'text', 
      admin: { readOnly: true }, 
      hidden: true, 
      defaultValue: generateKey 
    },
  ],
};

export default Credentials;
