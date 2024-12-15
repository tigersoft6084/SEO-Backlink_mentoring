import { CollectionConfig } from 'payload';
import crypto from 'crypto';
import { API_KEY } from '@/config/apiConfig';

// Encryption configuration
const algorithm = 'aes-256-cbc';

// Function to generate a unique 256-bit key
const generateKey = () => crypto.randomBytes(32).toString('hex');

// Function to encrypt data using a specific key
const encrypt = (text: string, key: string) => {
  const iv = crypto.randomBytes(16); // Unique IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`; // Combine IV and encrypted data
};

// Function to decrypt data using a specific key
const decrypt = (encryptedText: string, key: string) => {
  const [ivHex, encryptedData] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(ivHex, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
};

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
      return apiKey === API_KEY;
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc }) => {
        if ((operation === 'create' || operation === 'update') && data?.password) {
          // Generate or use the existing secret key
          const userSecretKey = operation === 'create' ? generateKey() : originalDoc.secretKey;

          // Encrypt the password using the user's secret key
          data.password = encrypt(data.password, userSecretKey);

          // Ensure the secret key is saved with the user
          data.secretKey = userSecretKey;
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
        readOnly: false, // Prevent password visibility in the admin panel
      },
    },
    {
      name: 'secretKey',
      type: 'text',
      admin: {
        readOnly: true, // Prevent password visibility in the admin panel
      },
      hidden: false, // Hide the secret key from the admin panel
    },
  ],
};

export default Credentials;
