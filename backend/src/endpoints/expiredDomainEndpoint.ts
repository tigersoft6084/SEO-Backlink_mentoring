
import { expiredDomainsHandler } from '@/handlers/expiredDomainHandler.ts';
import { withErrorHandling } from '@/middleware/errorMiddleware.ts';
import { Endpoint } from 'payload';


/**
 * Fetch Boosterlink data and process it using the marketplaceHandler
 */
export const expiredDomainEndpoint: Endpoint = {

    path: '/expired',

    method: 'get',

    handler: withErrorHandling(expiredDomainsHandler)

};
