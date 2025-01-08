import { Endpoint } from 'payload';
import { fetchDataFromBoosterlink } from '@/services/fetchDataFromMarketplaces/boostlink';
import { getBacklinksDataFromBoosterlink } from '@/services/getBacklinksFromMarketplaces/boosterlink';
import { getCookieFromLinkaVistaLogin } from '@/services/getTokensOrCookiesFromMarketplaces/linkavista';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async ({ payload }) => {
    try {

      const result = await getCookieFromLinkaVistaLogin();

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
