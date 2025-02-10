import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { Endpoint } from "payload";

export const getMarketPlaces : Endpoint = {

    path : '/get-market-places',

    method : 'get',

    handler : withErrorHandling(async(req) : Promise<Response> => {

        if (!req.url) {
            return new Response(JSON.stringify({ message: "Invalid request URL." }), { status: 400 });
        }
        const url = new URL(req.url);
        const marketplaceUrl = url.searchParams.get("marketplaceUrl"); // Adjust key name if needed

        const marketplaceDomain = await req.payload.find({
            collection: "backlinks",
            where: { domain: { equals: marketplaceUrl } },
            limit: 1,
        });

            // Check if results exist
        if (!marketplaceDomain || !marketplaceDomain.docs.length) {
            return new Response(JSON.stringify({ message: "No marketplaces found." }), { status: 404 });
        }

        // Add CORS headers to the response
        const headers = {
            "Access-Control-Allow-Origin": "*", // Adjust to allow only your extension's origin for security
            "Content-Type": "application/json",
        };

        // Check if results exist
        if (!marketplaceDomain || !marketplaceDomain.docs.length) {
            return new Response(JSON.stringify({ message: "No marketplaces found." }), { status: 404 });
        }

        return new Response(JSON.stringify({
                message: "Sucessfully found the marketplaces.",
                result : marketplaceDomain.docs[0].marketplaces
            }),
            {   status: 200,
                headers: headers, // Add headers here
            });
    })
}