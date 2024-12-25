import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces';
import { SeoJungle_API_URL } from '@/global/marketplaceUrls';

// Function to fetch token from SeoJungle API
const fetchTokenFromSeoJungle = async (email: string, password: string): Promise<string> => {
    try {
      const response = await axios.post(SeoJungle_API_URL, {
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
      throw new Error('Failed to fetch token from SeoJungle.');
    }
};
  
// Main function to fetch credentials and compare website target
export const getTokenForSeoJungle = async (): Promise<string | null> => {
    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for SeoJungle
    for (const credential of credentials) {

        // Check if any value in websiteTarget array is 'SeoJungle'
        const hasSeoJungleTarget = credential.websiteTarget.some(target => target.value === 'Seo-Jungle');
        
        if (hasSeoJungleTarget) {
            console.log(`Found SeoJungle credentials for ${credential.email}`);
            
            // Fetch token from SeoJungle API
            if (credential.password) {
                const token = await fetchTokenFromSeoJungle(credential.email, credential.password);

                return token;
            }
        }
    }

    return null; // Return null if no SeoJungle credentials found
};
