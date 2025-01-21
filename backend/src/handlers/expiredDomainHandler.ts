import { PayloadRequest } from "payload";
import { fetchExpiredDomainsService } from "@/services/expiredDomains/expiredDomainsService.ts";
import { ErrorHandler } from "./errorHandler.ts";

/**
 * Handles requests to fetch expired domains.
 * @param req - The incoming request object from Payload.
 * @returns A Response object containing the expired domains data or an error message.
 */
export const expiredDomainsHandler = async (req: PayloadRequest): Promise<Response> => {

    try {
        // Ensure the payload object exists
        if (!req.payload) {
            throw new Error("Payload instance is required for fetching expired domains.");
        }

        // Cast or validate `req.query` to the expected type
        const query = Object.fromEntries(
            Object.entries(req.query || {}).map(([key, value]) => [
                key,
                typeof value === "string" ? value : undefined,
            ])
        ) as Record<string, string | undefined>;

        // Call the service to fetch expired domains
        const expiredDomains = await fetchExpiredDomainsService(req.payload, { query });

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // You can replace '*' with specific domains for security reasons
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        // Return the fetched data in a successful response
        return new Response(JSON.stringify(expiredDomains), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            },
        });
    } catch (error) {
        // Handle errors and return a structured response
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching expired domains");

                // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // You can replace '*' with specific domains for security reasons
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        return new Response(JSON.stringify(errorDetails), {
            status: status || 500,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            },
        });
    }
};
