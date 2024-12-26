import { getDataFromLinkbuilders } from '@/services/getBacklinks/linkbuilders';
import { getSeoJungleData } from '@/services/getBacklinks/seo-jungle';
import { getTokenForSeoJungle } from '@/services/getTokens/seo-jungle';
import { Endpoint } from 'payload';

export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async ({ payload }) => {
    try {
      // Fetch the paperclubData
      const token = await getSeoJungleData();

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          results: token,
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
