import { fetchExpiredDomainsService } from "@/services/expiredDomains/expiredDomainsService.ts";
import { ErrorHandler } from "./errorHandler.ts";
import { PayloadRequest } from 'payload';

export const expiredDomainsHandler = async (req : PayloadRequest) : Promise<Response> => {

    try {
        // Call the service to fetch expired domains
        const expiredDomains = await fetchExpiredDomainsService(req.payload, req);

        // Return the expired domains data in a Response object
        return new Response(JSON.stringify(expiredDomains), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, `Error from expired Domains service`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });

    }
};