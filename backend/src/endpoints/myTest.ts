import { backgroundMarketplaceProcessHandler } from '@/handlers/backgroundMarketplaceProcessHandler.ts';
import { getBacklinksDataFromDevelink } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/develink.ts';
import { getBacklinksDataFromEreferer } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/ereferer.ts';
import { Endpoint, PayloadRequest } from 'payload';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async (req : PayloadRequest) => {
    try {

      await getBacklinksDataFromEreferer(req.payload);

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          // Results: bb,
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
