import { Endpoint, PayloadRequest } from 'payload';
import { getBacklinksDataFromMistergoodlink } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/mistergoodlink.ts';
import { getBacklinksDataFromPaperclub } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/paperclub.ts';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async (req : PayloadRequest) => {
    try {

      // await getBacklinksDataFromGetalink(req.payload);
      await getBacklinksDataFromPaperclub(req.payload);

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
