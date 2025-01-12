import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces';
import { Seojungle_API_URL } from '@/global/marketplaceUrls';

// Function to fetch token from Seojungle API
const fetchTokenFromSeojungle = async (email: string, password: string): Promise<string> => {

  try {
    const response = await axios.post(Seojungle_API_URL, {
      email: email,
      password: password,
    });

    // Extract the token from the response
    const token = response.data.data.jwt;

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
    throw new Error('Failed to fetch token from Seojungle.');
  }
};

// Main function to fetch credentials and compare website target
export const getTokenForSeojungle = async (): Promise<string | null> => {
    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for Seojungle
    for (const credential of credentials) {

      // Check if any value in websiteTarget array is 'Seojungle'
      const hasSeojungleTarget = credential.websiteTarget.some(target => target.value === 'Seojungle');
      if (hasSeojungleTarget) {

        console.log(`Found Seojungle credentials for ${credential.email}`);

        // Fetch token from Seojungle API
        if (credential.password) {

            const token = await fetchTokenFromSeojungle(credential.email, credential.password);

            return token;
        }
      }
    }

    return null; // Return null if no Seojungle credentials found
};
