import axios from 'axios';
import crypto from 'crypto';
import { BASE_URL, API_KEY } from '../config/apiConfig';

// Encryption configuration
const algorithm = 'aes-256-cbc';

// Decrypt function
const decrypt = (encryptedText: string, secretKey: string): string => {
  try {
    const [ivHex, encryptedData] = encryptedText.split(':'); // Extract IV and encrypted data
    if (!ivHex || !encryptedData) {
      throw new Error('Invalid encrypted text format.');
    }

    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey, 'hex'), // Secret key in hex
      Buffer.from(ivHex, 'hex') // IV in hex
    );

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8'); // Return decrypted password
  } catch (error : any) {
    console.error('Decryption failed:', error.message);
    throw new Error('Failed to decrypt password.');
  }
};

// Fetch credentials
export const getCredentials = async (): Promise<{ email: string; password: string }> => {
  if (!API_KEY || !BASE_URL) {
    throw new Error('API_KEY or BASE_URL is missing in environment variables.');
  }

  try {
    const response = await axios.get(`${BASE_URL}/credentials`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const credentials = response.data.docs[0]; // Assuming the first entry
    if (!credentials || !credentials.email || !credentials.password || !credentials.secretKey) {
      throw new Error('Invalid or missing credentials or secretKey.');
    }

    // Decrypt the password
    const decryptedPassword = decrypt(credentials.password, credentials.secretKey);

    // Return email and decrypted password
    return { email: credentials.email, password: decryptedPassword };
  } catch (error : any) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios Error:',
        error.response?.status,
        error.response?.data || error.message
      );
    } else {
      console.error('Error fetching credentials:', error.message);
    }
    throw new Error('Failed to fetch credentials from the server.');
  }
};
