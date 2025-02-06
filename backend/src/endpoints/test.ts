import { getBacklinksDataFromGrowwer } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/growwer.ts';
import { getBacklinksDataFromMynilinks } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/mynilinks.ts';
import { fetch_CSRF_TOKEN_AndCookieFrom_GET_Login, getCookieFrom123media } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/123media.ts';
import { getCookieFromBacklinked } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/backlinked.ts';
import { getCookieFromGrowwer } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/growwer.ts';
import { getCookieFromMynilinks } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/mynilinks.ts';
import { Endpoint, PayloadRequest } from 'payload';

// Define the Payload endpoint
export const mytttEndpoint: Endpoint = {
    path: '/ttt',
    method: 'get',
    handler: async (req : PayloadRequest) => {
        try {

        const result = await getBacklinksDataFromGrowwer(req.payload);

        // Return the collected results
        return new Response(
            JSON.stringify({
                message: 'Fetch completed.',
                Results: result,
                }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        } catch (error: unknown) {
        console.error('Error occurred while fetching:', error);

        return new Response(
            JSON.stringify({
                message: 'An error occurred while fetching data.',
                error: (error instanceof Error) ? error.message : 'Unknown error',
                }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        }
    },
};
