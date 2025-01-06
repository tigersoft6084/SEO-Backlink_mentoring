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
  RD: string;
  TF: number;
  CF: number;
  price: number;
  source: string;
  allSources: { source: string; price: number }[];
}

export const bulkKeywordSearchEndpoint: Endpoint = {
  path: '/bulkKeywordSearch',
  method: 'post',
  handler: async (req) => {
    try {
      // Parse and validate the request body
      if (!req.text) {
        return new Response(
          JSON.stringify({ error: 'Request body is missing' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const rawBody = await req.text();
      const { keywords, locationCode, languageCode } = JSON.parse(rawBody);

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
      const result = serpData?.result || [];

      if (result.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No results found from SERP data' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Process the SERP results
      const items: KeywordItem[] = result[0]?.items || [];
      const domains = items.map((item) => item.domain);

      // Fetch backlink data from the database
      const backlinksData = await req.payload.find({
        collection: 'backlinks',
        where: { domain: { in: domains } },
      });

      // Helper function to get the keyword with the highest value
      const getKeywordWithHighestValue = (
        keywordsPositions: Record<string, number[]>
      ): string => {
        const entries = Object.entries(keywordsPositions);
        if (entries.length === 1) return entries[0][0];
        return entries.reduce((highest, [keyword, positions]) => {
          const highestValue = highest[1].reduce((a, b) => a + b, 0);
          const currentValue = positions.reduce((a, b) => a + b, 0);
          return currentValue > highestValue ? [keyword, positions] : highest;
        }, entries[0])[0];
      };

      // Filter to get unique domains with the smallest price
      const backlinksMap: Record<string, BacklinkData> = {};

      backlinksData.docs.forEach((doc: any) => {
        const relatedItem = items.find((item) => item.domain === doc.domain);
        const keyword = relatedItem
          ? getKeywordWithHighestValue(relatedItem.keywords_positions)
          : '';

        const existingBacklink = backlinksMap[doc.domain];
        if (!existingBacklink || doc.price < existingBacklink.price) {
          const otherSources = backlinksData.docs
            .filter(
              (source: any) =>
                source.domain === doc.domain && source.source !== doc.source
            )
            .map((source: any) => ({
              source: source.source,
              price: source.price,
            }));

            otherSources.push({
              source : doc.source,
              price : doc.price,
            })

          backlinksMap[doc.domain] = {
            domain: doc.domain,
            keyword,
            RD: doc.RD > 1000 ? `${(doc.RD / 1000).toFixed(1)}k` : doc.RD,
            TF: doc.TF,
            CF: doc.CF,
            price: doc.price,
            source: doc.source,
            allSources: otherSources,
          };
        }
      });

      const backlinks = Object.values(backlinksMap);

      const backlink_found = result[0]?.total_count || 0;
      const foundDomains = backlinks.map((backlink) => backlink.domain);
      const foundCount = `${foundDomains.length} / ${backlink_found}`;
      const minPrice = backlinks.reduce((total, backlink) => total + backlink.price, 0);
      const avgPrice = Math.floor(minPrice / foundDomains.length);
      const aboutPrice = [foundCount, avgPrice, minPrice];

      // Respond with the processed data
      return new Response(
        JSON.stringify({
          keywords,
          aboutPrice,
          backlinks,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
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
