import { API_KEY, BASE_URL } from '@/config/apiConfig.ts';
import { decrypt } from '@/utils/encryption.ts';
import axios from 'axios';

interface DataForFetch_CredentialsForMarketplaces {
  email: string;
  password: string;
  secretKey: string;
  websiteTarget: Array<{ value: string; id: string }>; // Assuming websiteTarget is an array of strings
}

interface UserCredential {
  email: string;
  password: string | null; // Password can be null if not decryptable
  websiteTarget: Array<{ value: string; id: string }>; // Adding the websiteTarget field
}

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

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios Error:',
        error.response?.status,
        error.response?.data || error.message
      );
    } else {
      console.error(
        'Error fetching credentials : ',
        error instanceof Error ? error.message : error
      );
    }
    throw new Error('Failed to fetch credentials from the server.');
  }
};
