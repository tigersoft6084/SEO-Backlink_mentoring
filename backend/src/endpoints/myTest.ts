import { Endpoint } from 'payload';
import { getCookieFromEreferer } from '@/services/getTokensOrCookiesFromMarketplaces/ereferer';
import { fetchDataFromEreferer } from '@/services/fetchDataFromMarketplaces/ereferer';
import { getBacklinksDataFromEreferer } from '@/services/getBacklinksFromMarketplaces/ereferer';
import { getBacklinksDataFromMistergoodlink } from '@/services/getBacklinksFromMarketplaces/mistergoodlink';
import { fetchDataFromMistergoodlink } from '@/services/fetchDataFromMarketplaces/mistergoodlink';


// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async ({ payload }) => {
    try {

      const result = await fetchDataFromMistergoodlink("https://app.mistergoodlink.com/shop?page=2", "PHPSESSID=i5g93kpgq7da4it0o9nt4ca484;");

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
