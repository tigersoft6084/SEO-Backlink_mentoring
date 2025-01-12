import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces';
import { PRENSALINK_API_URL } from '@/global/marketplaceUrls';

// Function to fetch token from Prensalink API
const fetchTokenFromPrensalink = async (email: string, password: string): Promise<string> => {

  try {
      const response = await axios.post(PRENSALINK_API_URL, {
        email: email,
        password: password,
      });

      // Extract the token from the response
      const token = response.data.access_token;

      return token;

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Axios Error while fetching token:',
          error.response?.status,
          error.response?.data || error.message
        );
      } else {
        const errorMessage = (error as Error).message;
        console.error('Error fetching token:', errorMessage);
      }
      throw new Error('Failed to fetch token from Prensalink.');
    }
};

// Main function to fetch credentials and compare website target
export const getTokenForPrensalink = async (): Promise<string | null> => {

  const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for Prensalink
    for (const credential of credentials) {

        // Check if any value in websiteTarget array is 'Prensalink'
        const hasPrensalinkTarget = credential.websiteTarget.some(target => target.value === 'Prensalink');

        if (hasPrensalinkTarget) {
            console.log(`Found Prensalink credentials for ${credential.email}`);

            // Fetch token from Prensalink API
            if (credential.password) {
                const token = await fetchTokenFromPrensalink(credential.email, credential.password);

                return token;
            }
        }
    }

    return null; // Return null if no Prensalink credentials found
};
