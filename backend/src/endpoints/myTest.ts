import { getBacklinksDataFromGetalink } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/getalink.ts';
import { Endpoint, PayloadRequest } from 'payload';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async (req : PayloadRequest) => {
    try {

      await getBacklinksDataFromGetalink(req.payload);

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          // Results: largestExtraCategory.category.name,
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
