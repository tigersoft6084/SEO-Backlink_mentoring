
import { getBacklinksDataFromLinkbroker } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/linkbroker.ts';
import { getBacklinksDataFromPrensalink } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/prensalink.ts';
import { getBacklinksDataFromPresswhizz } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/presswhizz.ts';
import { getTokenForLinkbroker } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/linkbroker.ts';
import { getCookieFromPresswhizz } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/presswhizz.ts';
import { Endpoint, PayloadRequest } from 'payload';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async (req : PayloadRequest) => {
    try {

      const result = await getBacklinksDataFromLinkbroker(req.payload);

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          result : result
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
