import { Endpoint } from 'payload';
import { fetchSerpData } from '../services/serpService';

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

// Function to normalize domain by removing 'www.' (if present)
// Check if domain is defined before calling 'startsWith'
function normalizeDomain(domain: string): string {
  if (!domain) {
    return '';  // Return an empty string or handle the error case as needed
  }
  return domain.startsWith('www.') ? domain.slice(4) : domain;
}

// Function to extract links from SERP results (without domain uniqueness logic)
function extractLinks(serpResults: any, keyword: string) {
  return serpResults.result[0].items.map((item: any) => ({
    url: item.url,
    domain: item.domain,
    keyword,
  }));
}

export const bulkKeywordSearchEndpoint: Endpoint = {
  path: '/bulkKeywordSearch',
  method: 'post',
  handler: async (Request: any) => {
    try {
      const body = await Request.json();
      const { keywords, locationCode, languageCode, depth } = body;

      // Input validation
      if (!keywords || !locationCode || !languageCode || !depth) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (!Array.isArray(keywords)) {
        return new Response(
          JSON.stringify({ error: 'Keywords should be an array' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const uniqueKeywords = [...new Set(keywords)];

      const allLinksByKeyword: { [key: string]: any[] } = {}; // Store links by keyword
      const seenDomains = new Set<string>(); // Global set to track domains across all keywords

      // Function to fetch and process each keyword
      const fetchAndProcessKeyword = async (keyword: string) => {
        try {
          const serpData = await fetchSerpData(keyword, locationCode, languageCode, depth);
          const links = extractLinks(serpData, keyword);

          // Filter and store unique links across all keywords
          allLinksByKeyword[keyword] = links.filter((link: any) => {
            if (link.domain && !seenDomains.has(link.domain)) {
              seenDomains.add(link.domain);
              return true;
            }
            return false;
          });
        } catch (error) {
          console.error(`Error fetching data for keyword: ${keyword}`, error);
        }
      };

      // Run requests concurrently for all keywords
      await Promise.all(uniqueKeywords.map(fetchAndProcessKeyword));

      // Collect and preserve the order of links across all keywords
      const orderedLinks = uniqueKeywords.flatMap(keyword => allLinksByKeyword[keyword] || []);

      const domains = orderedLinks.map((item: any) => item.domain);

      // Normalize domains by removing the 'www.' prefix (if present) and use them for querying
      const normalizedDomains = [...new Set(domains.map((domain: string) => normalizeDomain(domain)))];

      // Fetch backlinks from the database for both 'www' and non-'www' domains
      const backlinksData = await Request.payload.find({
        collection: 'backlinks',
        where: {
          domain: { in: normalizedDomains },
        },
      });

      // Process backlinks and filter unique domains with the lowest price
      const backlinksMap: Record<string, BacklinkData> = {};
      let totalBacklinks = 0;

      backlinksData.docs.forEach((doc: any) => {
        // Normalize domain from the database and compare with the normalized domains from SERP results
        const normalizedDocDomain = normalizeDomain(doc.domain);
      
        // Check if the normalized domain matches any of the domains from SERP results
        const matchingDomain = orderedLinks.find(
          (link: any) => normalizeDomain(link.domain) === normalizedDocDomain
        );
      
        if (matchingDomain) {
          const keyword = matchingDomain.keyword;
          const existingBacklink = backlinksMap[doc.domain]; // Use the database domain here
      
          if (!existingBacklink || doc.price < existingBacklink.price) {
            const otherSources = backlinksData.docs
              .filter((source: any) => normalizeDomain(source.domain) === normalizedDocDomain && source.source !== doc.source)
              .map((source: any) => ({ source: source.source, price: source.price }));
      
            otherSources.push({ source: doc.source, price: doc.price });
      
            // Map the backlink data, use doc.domain (the database domain) instead of matchingDomain.domain
            backlinksMap[doc.domain] = {
              domain: doc.domain, // Return the database domain
              keyword,
              RD: doc.RD > 1000 ? `${(doc.RD / 1000).toFixed(1)}k` : doc.RD,
              TF: doc.TF,
              CF: doc.CF,
              price: doc.price,
              source: doc.source,
              allSources: otherSources,
            };
      
            if (!existingBacklink) {
              totalBacklinks++;
            }
          }
        }
      });
      

      const backlinks = Object.values(backlinksMap);

      // Calculating pricing info
      const foundDomains = backlinks.map((backlink) => backlink.domain);
      const minPrice = backlinks.reduce((total, backlink) => total + backlink.price, 0);
      const avgPrice = Math.floor(minPrice / foundDomains.length);
      const maxPrice = backlinks
        .map((backlink) => Math.max(...backlink.allSources.map((source) => source.price)))
        .reduce((sum, price) => sum + price, 0);

      const foundCount = `${totalBacklinks} / ${orderedLinks.length}`;
      const aboutPrice = [foundCount, avgPrice, minPrice, maxPrice];

      // Return the merged, sorted, and deduplicated results, with counters
      return new Response(
        JSON.stringify({ keys: uniqueKeywords, aboutPrice, backlinks }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: any) {
      console.error('Error fetching SERP data:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};
