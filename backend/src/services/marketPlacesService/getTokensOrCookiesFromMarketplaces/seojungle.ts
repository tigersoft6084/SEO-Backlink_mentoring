import { Seojungle_API_URL } from '@/globals/globalURLs.ts';
import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';


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

  } catch (error) {
      const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Seojungle");
      return errorDetails.context;
  }
};

// Main function to fetch credentials and compare website target
export const getTokenForSeojungle = async (): Promise<string | null> => {
    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for Seojungle
    for (const credential of credentials) {

      // Check if any value in websiteTarget array is 'Seojungle'
      const hasSeojungleTarget = credential.websiteTarget.some((target: { value: string }) => target.value === 'Seojungle');
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
