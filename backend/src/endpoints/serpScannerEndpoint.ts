import { withErrorHandling } from "@/middleware/errorMiddleware.ts";
import { fetchSerpData } from "@/services/dataForSeo/serpService.ts";
import { competitiveAnalysisService } from "@/services/majestic/getRefDomainsFromSeveralUrls.ts";
import { normalizeDomain } from "@/utils/domainUtils.ts";
import { Endpoint, PayloadRequest } from "payload";

interface SerpItem {
    url: string;
    domain: string;
}

interface SerpResult {
    result: {
        [key: string]: {
            items: SerpItem[];
        };
    };
}

function extractLinks(serpResults: SerpResult): string[] {
    return serpResults.result[0].items.map((item) =>
        normalizeDomain(item.domain) // Directly return the transformed value
    );
}

export const serpScannerEndpoint : Endpoint = {

    path : '/serp-scanner',
    method : 'post',
    handler : withErrorHandling(async(req : PayloadRequest) : Promise<Response> => {

        if (!req.json) {
            return new Response(
                JSON.stringify({ error: 'Invalid request: Missing JSON parsing function' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await req.json();

        const { keyword, locationCode, languageCode, displayDepth } = body;

        if (!keyword || !locationCode || !languageCode || !displayDepth) {
            return new Response(
                JSON.stringify({ error: 'Missing or invalid required fields' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const serpData = await fetchSerpData(keyword, locationCode, languageCode, 10);

        const domains = extractLinks(serpData);

        const { aboutPrice, enrichedBacklinksData } = await competitiveAnalysisService(domains, displayDepth, req);
        return new Response(
            JSON.stringify({ keys: keyword, aboutPrice, backlinks: enrichedBacklinksData }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    })
}