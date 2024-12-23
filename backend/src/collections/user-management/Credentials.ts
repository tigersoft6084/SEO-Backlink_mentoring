import { CollectionConfig } from 'payload';
import { generateKey, encrypt, decrypt } from '../../utils/encryption';
import { authenticateAdmin } from '../../services/authenticateSaveToCredential';

interface AuthenticateUrl {
  url: string;
  token?: string;
  cookie?: string;
  expiresAt?: string;
}

interface CredentialsData {
  name: string;
  email: string;
  password: string;
  secretKey?: string;
  authenticateUrls: AuthenticateUrl[];
}

export const Credentials: CollectionConfig = {
  slug: 'credentials',
  admin: {
    useAsTitle: 'email', // Use the email field as the title in the admin panel
  },
  access: {
    create: () => true,
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        // Type assertion to assert that `data` is of type `CredentialsData`
        const updatedData = data as CredentialsData; 
  
        if ((operation === 'create' || operation === 'update') && updatedData.password) {
          const secretKey = operation === 'create' ? generateKey() : originalDoc?.secretKey || generateKey();
          updatedData.password = encrypt(updatedData.password, secretKey);
          updatedData.secretKey = secretKey;
  
          // Ensure authenticateUrls exist and is an array
          if (Array.isArray(updatedData.authenticateUrls)) {
            const uniqueUrls = Array.from(new Set(updatedData.authenticateUrls.map(urlObj => urlObj.url)));
  
            try {
              // Authenticate and update the data using authenticateAndSave
              const authResponse = await authenticateAdmin(
                req.payload,
                updatedData.email,
                decrypt(updatedData.password, secretKey),
                uniqueUrls
              );
  
              // Assuming authenticateAndSave returns updated data with 'authenticateUrls' as part of the result
              updatedData.authenticateUrls = authResponse.authenticateUrls.map(urlObj => {
                // Ensure you're correctly merging the updated token and expiration date
                const updatedUrlObj = updatedData.authenticateUrls.find(existingUrlObj => existingUrlObj.url === urlObj.url);
  
                return {
                  ...updatedUrlObj, // Merge existing data
                  ...urlObj, // Apply updated values (token, expiresAt, etc.)
                };
              });
  
            } catch (error) {
              console.error('Error in authenticateAndSave:', error);
              throw new Error('Authentication failed. Please verify your credentials.');
            }
          }
        }
  
        console.log(updatedData)
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
        { name: 'cookie', type: 'text', admin: { readOnly: true } },
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
