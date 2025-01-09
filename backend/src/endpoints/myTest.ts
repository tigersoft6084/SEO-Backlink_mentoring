import { Endpoint } from 'payload';
import { fetchDataFromBoosterlink } from '@/services/fetchDataFromMarketplaces/boostlink';
import { getBacklinksDataFromBoosterlink } from '@/services/getBacklinksFromMarketplaces/boosterlink';
import { getCookieFromLinkaVista } from '@/services/getTokensOrCookiesFromMarketplaces/linkavista';
import { getBacklinksDataFromLinkaVista } from '@/services/getBacklinksFromMarketplaces/linkavista';
import { getTokenForGetalink } from '@/services/getTokensOrCookiesFromMarketplaces/getalink';
import { getBacklinksDataFromGetalink } from '@/services/getBacklinksFromMarketplaces/getalink';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async ({ payload }) => {
    try {

      const result = await getBacklinksDataFromGetalink();

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
