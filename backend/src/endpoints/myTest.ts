import { Endpoint } from 'payload';
import { getBacklinksDataFromGetalink } from '@/services/getBacklinksFromMarketplaces/getalink';
import { getCookieFromDevelink } from '@/services/getTokensOrCookiesFromMarketplaces/develink';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async () => {
    try {

      const result = await getCookieFromDevelink();

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
    } catch (error: any) {
      console.error('Error occurred while fetching:', error);

      return new Response(
        JSON.stringify({
          message: 'An error occurred while fetching data.',
          error: error.message || 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
