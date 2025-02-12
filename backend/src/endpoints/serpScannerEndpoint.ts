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

function extractLinks(serpResults: SerpResult): { domain: string }[] {
    return serpResults.result[0].items
        .map((item) => {
            const domain = normalizeDomain(item.domain);
            return domain ? { domain } : undefined; // Use `undefined` instead of `null`
        })
        .filter((item): item is { domain: string } => !!item); // Type assertion to filter `undefined`
}


export const serpScannerEndpoint : Endpoint = {

    path : '/serpScanner',
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
        const seenDomains = new Set<string>();
        const newDomains = domains.filter(item => !seenDomains.has(item.domain)).map(item => item.domain); // Extract domain as a string
        newDomains.forEach(domain => seenDomains.add(domain));

        console.log(newDomains)

        const { aboutPrice, enrichedBacklinksData } = await competitiveAnalysisService(newDomains, displayDepth, req);

        if(aboutPrice && enrichedBacklinksData){
            return new Response(
                JSON.stringify({ keys: [keyword], aboutPrice, backlinks: enrichedBacklinksData }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ error: 'Missing or invalid required fields' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );


    })
}