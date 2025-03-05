import { Endpoint } from 'payload';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { normalizeDomain } from '@/utils/domainUtils.ts';
interface BacklinkData {
  domain: string;
  rd: number;
  tf: number;
  cf: number;
  price: number;
  ttf : string;
  source: string;
  allSources: { marketplace_source: string; price: number }[];
}

export const bulkDomainSearchEndpoint: Endpoint = {
  path: '/bulkDomainSearch',
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
      let { domains } = JSON.parse(rawBody);

      // Handle case where domains are passed as a comma-separated string
      if (typeof domains === 'string') {
        domains = domains.split(',').map((domain) => domain.trim());
      }

      if (!domains || domains.length === 0) {
        return new Response(
          JSON.stringify({
            error: 'Missing or invalid required field: domains',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Normalize domains
      domains = domains.map((domain: string) =>
        normalizeDomain(domain)
      );

      const batchSize = 100; // Adjust batch size as needed
      const backlinksData: { docs: {
        domain : string;
        marketplaces : [
          {
            marketplace_source : string;
            price : number;
          }
        ]
        keyword : string;
        ttf : string;
        rd : number;
        tf : number;
        cf : number;
      }[] } = { docs: [] };

      // Batch process the domains to avoid query size limits
      for (let i = 0; i < domains.length; i += batchSize) {
        const batch = domains.slice(i, i + batchSize);
        const result = await req.payload.find({
          collection: 'backlinks',
          where: { domain: { in: batch } },
          limit: batchSize,
        });

        const mappedDocs = result.docs.map((doc: any) => ({
          ...doc,
          allSources: doc.marketplaces.map((marketplace: {marketplace_source : string; price : number}) => ({
            marketplace_source: marketplace.marketplace_source,
            price: marketplace.price,
          })),
        }));

        backlinksData.docs.push(...mappedDocs);
      }

      // Filter to get unique domains with the smallest price
      const backlinksMap: Record<string, BacklinkData> = {};

      const backlinkPromises = backlinksData.docs.map((doc) => {
        const normalizedDocDomain = normalizeDomain(doc.domain);

        if (normalizedDocDomain) {
          const existingBacklink = backlinksMap[doc.domain];

            const minMarketplace = doc.marketplaces.reduce((min, current) =>
              current.price < min.price ? current : min
            );

            if (!existingBacklink || minMarketplace.price < existingBacklink.price) {
              backlinksMap[doc.domain] = {
                domain: doc.domain,
                rd: doc.rd || 0,
                tf: doc.tf || 0,
                cf: doc.cf || 0,
                price: minMarketplace.price,
                ttf : doc.ttf ? doc.ttf : "",
                source: minMarketplace.marketplace_source,
                allSources: doc.marketplaces.map((marketplace) => ({
                  marketplace_source: marketplace.marketplace_source,
                  price: marketplace.price,
                })),
              };
            }
        }
      });

      await Promise.all(backlinkPromises);

      const backlinks = Object.values(backlinksMap);

      const foundDomains = backlinks.map((backlink) => backlink.domain);
      const foundCount = domains.length;
      const minPrice = backlinks.reduce(
        (total, backlink) => total + backlink.price,
        0
      );
      const avgPrice = Math.floor(minPrice / foundDomains.length);
      const maxPrice = backlinks
        .map((backlink) => Math.max(...backlink.allSources.map((source) => source.price)))
        .reduce((sum, price) => sum + price, 0);

      const aboutPrice = [foundCount, avgPrice, minPrice, maxPrice];

      // Respond with the processed data
      return new Response(
        JSON.stringify({
          keys: domains,
          aboutPrice,
          backlinks,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
  },
};