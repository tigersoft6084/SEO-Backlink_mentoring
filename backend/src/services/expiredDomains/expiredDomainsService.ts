import { Payload } from "payload";
import { ExpiredDomainData } from "@/types/backlink.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { COLLECTION_NAME_BACKLINK } from "@/global/strings.ts";

/**
 * Fetch expired domains with pagination and filter by expiry date using Payload
 * @param payload - The Payload instance for interacting with the database
 * @param req - Request object containing query parameters (limit, page)
 * @returns - A Promise resolving to an array of expired domains or an error response
 */
export const fetchExpiredDomainsService = async (
    payload: Payload,
    req: {
        query:
            {
                limit?: string;
                page?: string
            }
        }

        ): Promise<ExpiredDomainData[] | Response> => {
    // Extract limit and page for pagination
    const limit = Math.max(parseInt(req.query.limit || "25", 10), 1); // Default to 25 if not provided
    const page = Math.max(parseInt(req.query.page || "1", 10), 1); // Default to 1 if not provided

    // Calculate skip based on page number
    // const skip = (page - 1) * limit;

    // Get the current time to filter expired domains
    const currentTime = new Date().toISOString();

    try {
        // Fetch the expired domains using Payload
        const result = await payload.find({
            collection: COLLECTION_NAME_BACKLINK,
            where: {
                Expiry_Date: {
                    less_than: currentTime,
                },
            },
            limit,
            page,
        });

        // If no documents are found, return an empty array
        if (result.docs.length === 0) return [];

        // Map the results to match the ExpiredDomainData structure
        return result.docs.map((item) => ({
            Domain: item.Domain,
            TF: item.TF ?? 0,
            CF: item.CF ?? 0,
            RD: item.RD ?? 0,
            TTF: item.TTF ?? null,
            Ref_Ips: item.Ref_Ips ?? "0",
            Ref_Edu: item.Ref_Edu ?? "0",
            Ref_Gov: item.Ref_Gov ?? "0",
            Language: item.Language ?? null,
        }));
    } catch (error) {
        // Use the error handler to generate the response
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching expired domains");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
