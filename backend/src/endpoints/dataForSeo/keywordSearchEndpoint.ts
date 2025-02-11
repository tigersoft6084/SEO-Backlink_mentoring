import { fetchSerpData } from "@/services/dataForSeo/serpService.ts";
import { Endpoint, PayloadRequest } from "payload";
import PQueue from "p-queue";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { normalizeDomain } from "@/utils/domainUtils.ts";
import { COLLECTION_NAME_BACKLINK } from "@/globals/strings.ts";

export const keywordSearchEndpoint: Endpoint = {
    path: "/kwSearch",
    method: "post",
    handler: async (req: PayloadRequest): Promise<Response> => {
        if (!req.json) {
            return new Response(
                JSON.stringify({ error: "Invalid request: Missing JSON parsing function" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const body = await req.json();
        const { keywords, locationCode, languageCode, depth } = body;

        if (!keywords || !locationCode || !languageCode || !depth || !Array.isArray(keywords)) {
            return new Response(
                JSON.stringify({ error: "Missing or invalid required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const uniqueKeywords = Array.from(new Set(keywords));
        const concurrencyLevel = 10;
        const queue = new PQueue({ concurrency: concurrencyLevel });

        try {
            const tasks = uniqueKeywords.map((keyword) =>
                queue.add(() =>
                    fetchSerpData(keyword, locationCode, languageCode)
                        .then(res =>
                            res.result[0]?.items.map((item: { domain: string }) => ({
                                domain: normalizeDomain(item.domain), // Corrected syntax
                                keyword: keyword     // Include the keyword in response
                            })) || []
                        )
                )
            );

            // Run all tasks concurrently with queue
            const results = await Promise.all(tasks);

            // Flatten results array
            const flatResults = results.flat();

            // Filter out duplicates, keeping only the first occurrence
            const seenDomains = new Set();
            const uniqueResults = flatResults.filter(entry => {
                if (!entry.domain) return false; // Exclude invalid items
                if (seenDomains.has(entry.domain)) return false; // Skip if already seen
                seenDomains.add(entry.domain);
                return true;
            });

            const domainsFromKewordSearchOnDataForSeo = Array.from(uniqueResults.map((item: { domain: string }) => item.domain));


            const backlinksData = await req.payload.find({
                collection : COLLECTION_NAME_BACKLINK,
                where : {
                    domain : {
                        in : domainsFromKewordSearchOnDataForSeo
                    }
                },
                limit : 1000
            })

            return new Response(
                JSON.stringify({ data: backlinksData  }), // Flatten the nested array
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } catch (error) {
            const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching SERP data.");
            return new Response(JSON.stringify(errorDetails), {
                status,
                headers: { "Content-Type": "application/json" },
            });
        }
    },
};
