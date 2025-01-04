import { Endpoint } from 'payload';
import { getResultsFromBulkKeywordSearch } from '@/services/bulkKeywordSearchService';

interface KeywordItem {
  domain: string;
  visibility: number;
  keywords_positions: Record<string, number[]>;
  rating: number;
}

interface BacklinkData {
  domain: string;
  keyword: string;
  RD: number;
  TF: number;
  CF: number;
  price: number;
  source: string;
}

export const bulkKeywordSearchEndpoint: Endpoint = {
  path: '/bulkKeywordSearch',
  method: 'post',
  handler: async (req) => {
    try {
      // Read the body from the ReadableStream
      if (!req.text) {
        return new Response(
          JSON.stringify({ error: 'Request body is missing' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const rawBody = await req.text(); // Use text() to read the stream
      const parsedBody = JSON.parse(rawBody); // Parse the text as JSON

      const { keywords, locationCode, languageCode } = parsedBody;

      // Input validation
      if (!keywords || !locationCode || !languageCode) {
        return new Response(
          JSON.stringify({
            error: 'Missing required fields: keywords, locationCode, languageCode',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Fetch SERP data
      const serpData = await getResultsFromBulkKeywordSearch(keywords, locationCode, languageCode);

      // Extract and process the SERP results
      const result = serpData?.result || [];

      if (result.length > 0) {
        const items: KeywordItem[] = result[0]?.items || [];
        const domains = items.map((item) => item.domain);

        // Query the database for Backlink data for these domains
        const backlinksData = await req.payload.find({
          collection: 'backlinks',
          where: { domain: { in: domains } },
        });

        // Extract keyword with the highest value from `keywords_positions`
        const getKeywordWithHighestValue = (keywordsPositions: Record<string, number[]>): string => {
          const entries = Object.entries(keywordsPositions);
          if (entries.length === 1) {
            // Return the single keyword if only one exists
            return entries[0][0];
          }
          // Return the keyword with the highest sum of its positions
          return entries.reduce((highest, [keyword, positions]) => {
            const highestValue = highest[1].reduce((a, b) => a + b, 0);
            const currentValue = positions.reduce((a, b) => a + b, 0);
            return currentValue > highestValue ? [keyword, positions] : highest;
          }, entries[0])[0];
        };

        // Map backlinks and determine the relevant keyword for each domain
        const backlinks: BacklinkData[] = backlinksData.docs.map((doc: any) => {
          const relatedItem = items.find((item) => item.domain === doc.domain);
          const keyword = relatedItem
            ? getKeywordWithHighestValue(relatedItem.keywords_positions)
            : '';

          return {
            domain: doc.domain,
            keyword,
            RD: doc.RD,
            TF: doc.TF,
            CF: doc.CF,
            price: doc.price,
            source: doc.source,
          };
        });

        const foundDomains = backlinks.map((backlink) => backlink.domain);
        const missingDomains = domains.filter((domain) => !foundDomains.includes(domain));

        // Count of non-missing (existing) domains
        const nonMissingCount = foundDomains.length;

        const totalCount = result[0]?.total_count || 0;

        return new Response(
          JSON.stringify({
            totalCount,
            domains,
            backlinks,
            missingDomains, // Include the domains that are missing
            nonMissingCount, // Count of non-missing domains
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'No results found from SERP data' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (error: any) {
      console.error('Error fetching SERP data:', error);

      return new Response(
        JSON.stringify({
          error: error.message || 'An unknown error occurred.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};
