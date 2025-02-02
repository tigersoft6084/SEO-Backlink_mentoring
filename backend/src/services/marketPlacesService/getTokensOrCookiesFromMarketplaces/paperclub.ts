import { PaperClub_API_URL } from '@/globals/globalURLs.ts';
import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';


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

    } catch (error) {
      const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Paperclub");
      return errorDetails.context;
    }
};

// Main function to fetch credentials and compare website target
export const getTokenForPaperClub = async (): Promise<string | null> => {

    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for PaperClub
    for (const credential of credentials) {

        // Check if any value in websiteTarget array is 'PaperClub'
        const hasPaperClubTarget = credential.websiteTarget.some((target: { value: string }) => target.value === 'PaperClub');

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
