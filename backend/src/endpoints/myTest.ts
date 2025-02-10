import { Endpoint } from 'payload';
import { listActivePlans } from '@/services/paypal/plan/ListPlan.ts';
import { fetchRefDomains } from '@/services/majestic/getRefDomains.ts';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async () => {
    try {

      const result = await fetchRefDomains('tmcnet.com');

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
