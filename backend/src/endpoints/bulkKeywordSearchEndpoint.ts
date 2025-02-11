import { Endpoint, PayloadRequest } from 'payload';
import { COLLECTION_NAME_BACKLINK } from '@/globals/strings.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { fetchSerpData } from '@/services/dataForSeo/serpService.ts';
import { normalizeDomain } from '@/utils/domainUtils.ts';

// Define types for the responses
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

interface BacklinkData {
  domain: string;
  keyword: string;
  rd: number;
  tf: number;
  cf: number;
  ttf : string;
  language : string;
  backlinks : number;
  price: number;
  source: string;
  allSources: { marketplace_source: string; price: number }[];
}

// Function to extract links from SERP results
function extractLinks(serpResults: SerpResult, keyword: string): { url: string; domain: string; keyword: string }[] {
  return serpResults.result[0].items.map((item) => ({
    url: item.url,
    domain: normalizeDomain(item.domain),
    keyword,
  }));
}

export const bulkKeywordSearchEndpoint: Endpoint = {
  path: '/bulkKeywordSearch',
  method: 'post',
  handler: async (req: PayloadRequest): Promise<Response> => {
    try {
      // Validate and parse the request body
      if (!req.json) {
        return new Response(
          JSON.stringify({ error: 'Invalid request: Missing JSON parsing function' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const body = await req.json();
      const { keywords, locationCode, languageCode, depth } = body;

      if (!keywords || !locationCode || !languageCode || !depth || !Array.isArray(keywords)) {
        return new Response(
          JSON.stringify({ error: 'Missing or invalid required fields' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const uniqueKeywords = Array.from(new Set(keywords));
      const allLinksByKeyword: Record<string, { url: string; domain: string; keyword: string }[]> = {};
      const seenDomains = new Set<string>();

      // Fetch and process keywords concurrently
      const fetchAndProcessKeyword = async (keyword: string) => {
        try {
          const serpData = await fetchSerpData(keyword, locationCode, languageCode);
          const links = extractLinks(serpData, keyword);

          allLinksByKeyword[keyword] = links.filter((link) => {
            if (link.domain && !seenDomains.has(link.domain)) {
              seenDomains.add(link.domain);
              return true;
            }
            return false;
          });
          // allLinksByKeyword[keyword] = links;

        } catch (error) {
          console.error(`Error fetching data for keyword: ${keyword}`, error);
        }
      };

      await Promise.all(uniqueKeywords.map(fetchAndProcessKeyword));

      const orderedLinks = uniqueKeywords.flatMap((keyword) => allLinksByKeyword[keyword] || []);
      const normalizedDomains = Array.from(new Set(orderedLinks.map((item) => item.domain)));

      const backlinksData = await req.payload.find({
        collection: COLLECTION_NAME_BACKLINK,
        where: { domain: { in: normalizedDomains } },
        limit : depth
      });

      const backlinksMap: Record<string, BacklinkData> = {};
      let totalBacklinks = 0;

      const backlinkPromises = backlinksData.docs.map((doc) => {
        const normalizedDocDomain = normalizeDomain(doc.domain);

        if (normalizedDomains.includes(normalizedDocDomain)) {
          const matchingDomain = orderedLinks.find((link) => normalizeDomain(link.domain) === normalizedDocDomain);

          if (matchingDomain) {
            const keyword = matchingDomain.keyword;
            const existingBacklink = backlinksMap[doc.domain];

            const minMarketplace = doc.marketplaces.reduce((min, current) =>
              current.price < min.price ? current : min
            );

            if (!existingBacklink || minMarketplace.price < existingBacklink.price) {
              backlinksMap[doc.domain] = {
                domain: doc.domain,
                keyword,
                rd: doc.rd || 0,
                tf: doc.tf || 0,
                cf: doc.cf || 0,
                ttf : doc.ttf ? doc.ttf : "",
                language : doc.language ? doc.language : '',
                backlinks : doc.backlinks ? doc.backlinks : 0,
                price: minMarketplace.price,
                source: minMarketplace.marketplace_source,
                allSources: doc.marketplaces.map((marketplace) => ({
                  marketplace_source: marketplace.marketplace_source,
                  price: marketplace.price,
                })),
              };
              if (!existingBacklink) totalBacklinks++;
            }
          }
        }
      });

      await Promise.all(backlinkPromises);

      const backlinks = Object.values(backlinksMap);
      const foundDomains = backlinks.map((backlink) => backlink.domain);
      const minPrice = backlinks.reduce((total, backlink) => total + backlink.price, 0);
      const avgPrice = Math.floor(minPrice / foundDomains.length);
      const maxPrice = backlinks
        .map((backlink) => Math.max(...backlink.allSources.map((source) => source.price)))
        .reduce((sum, price) => sum + price, 0);

      const foundCount = `${totalBacklinks} / ${orderedLinks.length}`;
      const aboutPrice = [foundCount, avgPrice, minPrice, maxPrice];

      return new Response(
        JSON.stringify({ keys: uniqueKeywords, aboutPrice, backlinks }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      const { errorDetails, status } = ErrorHandler.handle(error, 'Error fetching SERP data.');
      return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
