
import axios from 'axios';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { LEMMILINK_API_URL } from '@/globals/globalURLs.ts';


// Function to fetch token from Lemmilink API
const fetchTokenFromLemmilink = async (email: string, password: string): Promise<{access_token : string; user_id : string} | null> => {

    try {
        const response = await axios.post(LEMMILINK_API_URL, {
            username: email,
            password: password,
        });

        return {
            access_token : response.data.data.access_token,
            user_id : response.data.data.id
        };

    } catch (error) {
        const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Lemmilink");
        console.log(errorDetails.context)
        return null
    }
};

// Main function to fetch credentials and compare website target
export const getTokenForLemmilink = async (): Promise<{access_token : string; user_id : string} | null> => {

    const credentials = await getCredentialsForMarketplaces();

    // Iterate through the credentials and fetch token for Lemmilink
    for (const credential of credentials) {

        // Check if any value in websiteTarget array is 'Lemmilink'
        const hasLemmilinkTarget = credential.websiteTarget.some((target: { value: string }) => target.value === 'Lemmilink');

        if (hasLemmilinkTarget) {
            console.log(`Found Lemmilink credentials for ${credential.email}`);

            // Fetch token from Lemmilink API
            if (credential.password) {
                const tokenAndUserId = await fetchTokenFromLemmilink(credential.email, credential.password);

                return tokenAndUserId;
            }
        }
    }

    return null; // Return null if no Lemmilink credentials found
};
