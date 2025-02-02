import { Endpoint, PayloadRequest } from 'payload';
import { getBacklinksDataFromPrensalink } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/prensalink.ts';
import { expiredDomainsHandler } from '@/handlers/expiredDomainHandler.ts';
import { backgroundMarketplaceProcessHandler } from '@/handlers/backgroundMarketplaceProcessHandler.ts';
import { createPlansAndGetID } from '@/services/paypal/plan/CreatePlan.ts';
import { getProductAndPlanIdFromDB } from '@/services/paypal/catalogProducts/getProductsFromDB.ts';
import { createProduct } from '@/services/paypal/catalogProducts/CreateProduct.ts';
import { listActivePlans } from '@/services/paypal/plan/ListPlan.ts';
import { getCookieFromPublisuites } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/publisuites.ts';
import { getBakclinksDataFromPublisuites } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/publisuites.ts';

import { getBacklinksDataFromLinkbuilders } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/linkbuilders.ts';
import { getTokenForPrensalink } from '@/services/marketPlacesService/getTokensOrCookiesFromMarketplaces/prensalink.ts';
import { getBacklinksDataFromSeojungle } from '@/services/marketPlacesService/getBacklinksFromMarketplaces/seojungle.ts';

// Define the Payload endpoint
export const myTestEndpoint: Endpoint = {
  path: '/test',
  method: 'get',
  handler: async (req : PayloadRequest) => {
    try {

      // await getBacklinksDataFromGetalink(req.payload);
      //await backgroundMarketplaceProcessHandler(req);
      // const result = await createPlansAndGetID(req);
      //const result = await getBacklinksDataFromPrensalink(req.payload)
      await getBacklinksDataFromSeojungle(req.payload);
      // const result = await getTokenForPrensalink()

      // Return the collected results
      return new Response(
        JSON.stringify({
          message: 'Fetch completed.',
          // Results: result,
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
