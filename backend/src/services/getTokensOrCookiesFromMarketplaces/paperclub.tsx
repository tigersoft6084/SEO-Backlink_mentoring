import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces';
import { PaperClub_API_URL } from '@/global/marketplaceUrls';

// Function to fetch token from PaperClub API
const fetchTokenFromPaperClub = async (email: string, password: string): Promise<string> => {

    try {
      const response = await axios.post(PaperClub_API_URL, {
        email: email,
        password: password,
      });
  
      // Extract the token from the response
      const token = response.data.token;
  
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
      throw new Error('Failed to fetch token from PaperClub.');
    }
};
  
// Main function to fetch credentials and compare website target
export const getTokenForPaperClub = async (): Promise<string | null> => {
    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for PaperClub
    for (const credential of credentials) {

        // Check if any value in websiteTarget array is 'PaperClub'
        const hasPaperClubTarget = credential.websiteTarget.some(target => target.value === 'PaperClub');
        
        if (hasPaperClubTarget) {
            console.log(`Found PaperClub credentials for ${credential.email}`);
            
            // Fetch token from PaperClub API
            if (credential.password) {
                const token = await fetchTokenFromPaperClub(credential.email, credential.password);

                return token;
            }
        }
    }

    return null; // Return null if no PaperClub credentials found
};
