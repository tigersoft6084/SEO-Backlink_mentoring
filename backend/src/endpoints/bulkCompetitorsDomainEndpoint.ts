import { fetchCompetitorsDomain } from '@/services/dataForSeo/competitiveAnalysisService.ts';
import { Endpoint } from 'payload';


interface CompetitiveAnalysisRequest {
    target: string;
    locationCode: number;
    languageCode: string;
    limit: number;
    offset : number;
}

// Helper to create a JSON response
const createJsonResponse = (data: object, status: number): Response =>
    new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

// Helper to validate the request body
const validateRequestBody = (body: Partial<CompetitiveAnalysisRequest>): string | null => {
    if (!body.target) return 'Target domain is required.';
    if (!body.locationCode) return 'Location code is required.';
    if (!body.languageCode) return 'Language code is required.';
    if (typeof body.limit !== 'number') return 'Limit must be a number.';
  return null; // All fields are valid
};

// Helper to validate the domain format
const isValidDomain = (domain: string): boolean =>
    /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})$/.test(domain);

// Endpoint definition
export const bulkCompetitiveAnalysisEndpoint: Endpoint = {
    path: '/bulkCompetitorsDomain',
    method: 'post',
    handler: async (req) => {
        try {
            // Parse the request body
            const body = req.json ? await req.json() : {};
            const validationError = validateRequestBody(body);

            if (validationError) {
                return createJsonResponse({ success: false, error: validationError }, 400);
            }

            const { target, locationCode, languageCode, limit } = body;

            // Validate domain format
            if (!isValidDomain(target)) {
                return createJsonResponse({ success: false, error: 'Invalid target domain format.' }, 400);
            }

            console.log('Processing request with payload:', { target, locationCode, languageCode, limit });

            // Fetch the total count first
            const initialResponse = await fetchCompetitorsDomain(target, locationCode, languageCode, limit, 0);
            const totalCount = initialResponse.result?.[0]?.total_count || 0;

            if (totalCount === 0) {
                console.warn(`No data available for domain: ${target}`);
                return createJsonResponse({ success: true, data: [] }, 200);
            }

            const totalPages = Math.ceil(totalCount / limit);
            const maxSimultaneousRequests = 30; // Per API constraints
            const allDomains: string[] = [];

            // Helper to fetch a single page
            const fetchPage = async (page: number) => {
                const offset = page * limit;
                try {
                    console.log(`Fetching data for offset: ${offset}`);
                    const response = await fetchCompetitorsDomain(target, locationCode, languageCode, limit, offset);
                    const domains =
                        response.result?.[0]?.items?.map((item: { domain: string }) => item.domain) || [];
                    console.log(`Fetched ${domains.length} domains for offset: ${offset}`);
                    allDomains.push(...domains);
                } catch (err) {
                    console.error(`Error fetching data for offset ${offset}:`, err);
                }
            };

            // Helper to batch requests
            const fetchAllPages = async () => {
                const batches = [];
                for (let i = 0; i < totalPages; i += maxSimultaneousRequests) {
                    const batch = Array.from(
                        { length: Math.min(maxSimultaneousRequests, totalPages - i) },
                        (_, index) => fetchPage(i + index)
                    );
                    batches.push(Promise.all(batch));
                }
                await Promise.all(batches);
            };

            // Fetch all pages in concurrent batches
            await fetchAllPages();

            console.log(`All pages fetched. Total domains: ${allDomains.length}`);
            return createJsonResponse({ success: true, data: allDomains, total: allDomains.length }, 200);
        } catch (error) {
            console.error('Error processing request:', error);
            return createJsonResponse(
                { success: false, error: error instanceof Error ? error.message : 'Unexpected error occurred.' },
                500
            );
        }
    },
};
