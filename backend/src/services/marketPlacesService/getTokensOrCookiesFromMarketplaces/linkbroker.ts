
import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { LINKBROKER_API_URL } from '@/globals/globalURLs.ts';


// Function to fetch token from Linkbroker API
const fetchTokenFromLinkbroker = async (email: string, password: string): Promise<string> => {

    try {
        const response = await axios.post(LINKBROKER_API_URL, {
            'email': email,
            'password': password,
            'gotrue_meta_security' : {}
        },{
            headers : {
                'apikey' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubnBwZ3hneWNxa2dpcHl0Ym90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg2NDA5MjgsImV4cCI6MjAwNDIxNjkyOH0.BF6aI2053MGT7NE8xsLVfhJk9tYVUwMSGAonpwdF3FA'
            }
        });

        // Extract the token from the response
        const token = response.data.access_token;

        return token;

    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Linkbroker");
        return errorDetails.context;
    }
};

// Main function to fetch credentials and compare website target
export const getTokenForLinkbroker = async (): Promise<string | null> => {

    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for Linkbroker
    for (const credential of credentials) {

        // Check if any value in websiteTarget array is 'Linkbroker'
        const hasLinkbrokerTarget = credential.websiteTarget.some((target: { value: string }) => target.value === 'Linkbroker');

        if (hasLinkbrokerTarget) {
            console.log(`Found Linkbroker credentials for ${credential.email}`);

            // Fetch token from Linkbroker API
            if (credential.password) {
                const token = await fetchTokenFromLinkbroker(credential.email, credential.password);

                return token;
            }
        }
    }

    return null; // Return null if no Linkbroker credentials found
};
