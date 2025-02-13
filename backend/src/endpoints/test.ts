
import { backgroundMarketplaceProcessHandler } from '@/handlers/backgroundMarketplaceProcessHandler.ts';
import { updateDBwithMajesticInfo } from '@/services/majestic/updateDBwithMajesticInfo.ts';
import { Endpoint, PayloadRequest } from 'payload';

// Define the Payload endpoint
export const mytttEndpoint: Endpoint = {
    path: '/ttt',
    method: 'get',
    handler: async (req : PayloadRequest) => {
        try {

        await backgroundMarketplaceProcessHandler(req);
        // const result = await getCookieFromPresswhizz()
        // await createPlansAndGetID(req);

        // Return the collected results
        return new Response(
            JSON.stringify({
                message: 'Fetch completed.',
                // Results: result,
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
