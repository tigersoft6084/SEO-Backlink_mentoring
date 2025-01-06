import { Endpoint } from 'payload';
import { getCookieForEreferer } from '@/services/getCookies/ereferer';


// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async ({ payload }) => {
    try {

      const result = await getCookieForEreferer();

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
