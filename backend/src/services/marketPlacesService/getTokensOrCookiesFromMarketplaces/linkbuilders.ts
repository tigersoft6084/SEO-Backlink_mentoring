import axios from 'axios';
import { LINK_BUILDERS_API_URL } from '@/globals/globalURLs.ts';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

// Function to fetch token from Link.Builders API
const fetchTokenFromLinkBuilders = async (email: string, password: string): Promise<string> => {

  try {
      const response = await axios.post(LINK_BUILDERS_API_URL, {
        email: email,
        password: password,
      });

      // Extract the token from the response
      const token = response.data.token;

      return token;

    } catch (error) {

      const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Linkbuilders : ");
      return errorDetails.context;
    }
};

// Main function to fetch credentials and compare website target
export const getTokenForLinkBuilders = async (): Promise<string | null> => {

    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for Link.Builders
    for (const credential of credentials) {

        // Check if any value in websiteTarget array is 'Link.Builders'
        const hasLinkBuildersTarget = credential.websiteTarget.some((target: { value: string }) => target.value === 'Linkbuilders');

        if (hasLinkBuildersTarget) {
            console.log(`Found Link.Builders credentials for ${credential.email}`);

            // Fetch token from Link.Builders API
            if (credential.password) {
                const token = await fetchTokenFromLinkBuilders(credential.email, credential.password);

                return token;
            }
        }
    }

    return null; // Return null if no Link.Builders credentials found
};
