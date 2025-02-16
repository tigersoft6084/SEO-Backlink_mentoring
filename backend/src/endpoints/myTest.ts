import { Endpoint, PayloadRequest } from 'payload';
import { getBacklinksDataFromPrensalink } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/prensalink.ts';
import { getCookieAndXCsrfTokenFromSoumettre } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/soumettre.ts';
import { getDataFromDealerdetemps } from '@/services/marketPlacesService/webscraping/dealerdetemps.ts';
import { getDataFromPresswhizz } from '@/services/marketPlacesService/webscraping/presswhizz.ts';
import { getCookieFromBacklinked } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/backlinked.ts';
import { getDataFromBacklinked } from '@/services/marketPlacesService/webscraping/backlinked.ts';
import { getBacklinksDataFromBacklinked } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/backlinked.ts';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async (req : PayloadRequest) => {
    try {

      const result = await getBacklinksDataFromBacklinked(req.payload);

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
