import axios from 'axios';
import { GETALINK_API_URL } from '@/global/marketplaceUrls.ts';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

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

    } catch (error) {

      const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Getalink : ");
      return errorDetails.context;
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
