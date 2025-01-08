import { Endpoint } from 'payload';
import { getCookieFromEreferer } from '@/services/getTokensOrCookiesFromMarketplaces/ereferer';
import { fetchDataFromEreferer } from '@/services/fetchDataFromMarketplaces/ereferer';
import { getBacklinksDataFromEreferer } from '@/services/getBacklinksFromMarketplaces/ereferer';
import { getBacklinksDataFromMistergoodlink } from '@/services/getBacklinksFromMarketplaces/mistergoodlink';
import { fetchDataFromMistergoodlink } from '@/services/fetchDataFromMarketplaces/mistergoodlink';
import { getCookieFromBoosterlink } from '@/services/getTokensOrCookiesFromMarketplaces/boosterlink';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async ({ payload }) => {
    try {

      const result = await getCookieFromBoosterlink();

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
