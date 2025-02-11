import { PayloadRequest } from "payload";
import { competitiveAnalysisService } from "@/services/majestic/getRefDomainsFromSeveralUrls.ts";

export const handleBulkCompetitiveAnalysis = async(req: PayloadRequest): Promise<Response> => {
    if (!req.json) {
        return new Response(
            JSON.stringify({ error: 'Invalid request: Missing JSON parsing function for competitive analysis' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const body = await req.json();
    const { reqDomains, displayDepth } = body;

    if (!reqDomains && !displayDepth) {
        return new Response(
            JSON.stringify({ error: 'Missing or invalid required fields for competitive analysis' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const { uniqueDomains, aboutPrice, enrichedBacklinksData } = await competitiveAnalysisService(reqDomains, displayDepth, req);
        return new Response(
            JSON.stringify({ keys: uniqueDomains, aboutPrice, backlinks: enrichedBacklinksData }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Error during competitive analysis:", error);
        return new Response(
            JSON.stringify({ error: 'An error occurred during competitive analysis' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}