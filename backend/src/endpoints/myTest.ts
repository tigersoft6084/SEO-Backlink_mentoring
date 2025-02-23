import { getBacklinksDataFromPrensalink } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/prensalink.ts';
import { fetch_CSRF_TOKEN_AndCookieFrom_GET_Login, getCookieFrom123media } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/123media.ts';
import { getDataFrom123media } from '@/services/marketPlacesService/webscraping/123media.ts';
import { listActivePlans } from '@/services/paypal/plan/ListPlan.ts';
import { Endpoint, PayloadRequest } from 'payload';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async (req : PayloadRequest) => {
    try {

      const result = await getBacklinksDataFromPrensalink(req.payload);

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
