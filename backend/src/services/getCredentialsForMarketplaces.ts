import axios from 'axios';
import { BASE_URL, API_KEY } from '../config/apiConfig';
import { decrypt } from '../utils/encryption'; // Assuming you have a decryption function
import { UserCredential, DataForFetch_CredentialsForMarketplaces } from '@/types/auth';

// Fetch Credentials
export const getCredentialsForMarketplaces = async (): Promise<UserCredential[]> => {
  if (!API_KEY || !BASE_URL) {
    throw new Error('API_KEY or BASE_URL is missing in environment variables.');
  }

  try {
    // Fetch the credentials from your backend endpoint
    const response = await axios.get(`${BASE_URL}/CredentialsForMarketplaces`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const credentials: DataForFetch_CredentialsForMarketplaces[] = response.data.docs; // Assuming `docs` is the array of credentials

    // Decrypt password and include websiteTarget if available
    const userCredentials: UserCredential[] = credentials.map((credential) => {
      const decryptedPassword = credential.password && credential.secretKey 
        ? decrypt(credential.password, credential.secretKey) 
        : null;

      return {
        email: credential.email,
        password: decryptedPassword,
        websiteTarget: credential.websiteTarget || [], // Use an empty array if no websiteTarget is provided
      };
    });

    return userCredentials; // Return the array of user credentials (email, decrypted password, and websiteTarget)

  } catch (error: any) {
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
