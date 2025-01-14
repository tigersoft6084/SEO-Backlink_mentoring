import { GETALINK_API_URL } from '@/global/marketplaceUrls.ts';
import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';


// Function to fetch token from Getalink API
const fetchTokenFromGetalink = async (email: string, password: string): Promise<string> => {

    try {
      const response = await axios.post(GETALINK_API_URL, {
        "returnSecureToken" : true,
        email: email,
        password: password,
        "clientType" : "CLIENT_TYPE_WEB"
      });

      // Extract the token from the response
      const token = response.data.idToken;

      return token;

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Axios Error while fetching token:',
          error.response?.status,
          error.response?.data || error.message
        );
      } else {
        console.error('Error fetching token:', error.message);
      }
      throw new Error('Failed to fetch token from Getalink.');
    }
};

// Main function to fetch credentials and compare website target
export const getTokenForGetalink = async (): Promise<string | null> => {
    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for Getalink
    for (const credential of credentials) {

        // Check if any value in websiteTarget array is 'Getalink'
        const hasGetalinkTarget = credential.websiteTarget.some((target: { value: string }) => target.value === 'Getalink');

        if (hasGetalinkTarget) {
            console.log(`Found Getalink credentials for ${credential.email}`);

            // Fetch token from Getalink API
            if (credential.password) {
                const token = await fetchTokenFromGetalink(credential.email, credential.password);

                return token;
            }
        }
    }

    return null; // Return null if no Getalink credentials found
};
