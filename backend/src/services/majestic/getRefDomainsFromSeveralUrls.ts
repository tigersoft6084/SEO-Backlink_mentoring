import { PayloadRequest } from "payload";
import { fetchRefDomains } from "@/services/majestic/getRefDomains.ts";
import { COLLECTION_NAME_BACKLINK } from "@/globals/strings.ts";

export const competitiveAnalysisService = async (reqDomains: string[], displayDepth: number, req: PayloadRequest) => {
    const uniqueDomains: string[] = Array.from(new Set(reqDomains));
    const seenDomains = new Set<string>();

    // Optimized concurrent fetching using Promise.all for all domains
    const allFetchedDomainsData = await Promise.all(uniqueDomains.map(async (domain) => {
        try {

            const domainsCount = reqDomains.length;
            const MAX_TOTAL_REQUESTS = 50000;
            const countPerDomain = Math.floor(MAX_TOTAL_REQUESTS / domainsCount);
            const fetchedRefDomains = await fetchRefDomains(domain, countPerDomain);
            if (Array.isArray(fetchedRefDomains)) {
                const newDomains = fetchedRefDomains.filter(item => !seenDomains.has(item.domain));
                newDomains.forEach(item => seenDomains.add(item.domain));
                return newDomains;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching data for domain: ${domain}`, error);
            return [];
        }
    }));

    // Flatten the array of domain data
    const flattenFetchedDomainsData = allFetchedDomainsData.flat();
    const domainsFromMajestic = Array.from(new Set(flattenFetchedDomainsData.map((item) => item.domain)));

    const totalFound = domainsFromMajestic.length;

    // Batch querying: Split the domains into smaller chunks for faster queries
    const chunkSize = 1000;
    const domainChunks = [];
    for (let i = 0; i < domainsFromMajestic.length; i += chunkSize) {
        domainChunks.push(domainsFromMajestic.slice(i, i + chunkSize));
    }

    // Fetch backlinks data in batches concurrently
    const backlinksDataChunks = await Promise.all(domainChunks.map(async (chunk) => {
        return req.payload.find({
            collection: COLLECTION_NAME_BACKLINK,
            where: { domain: { in: chunk } },
            depth: 0,
            select: { domain: true, marketplaces: true },
            limit: displayDepth
        });
    }));

    // Flatten all backlinks data from batches
    const allBacklinksData = backlinksDataChunks.flatMap(chunk => chunk.docs);

    const databaseFound = allBacklinksData.length;

    // Create a Map for faster lookup (Majestic data and backlinks data)
    const majesticDataMap = new Map(flattenFetchedDomainsData.map(item => [item.domain, item]));

    // Enrich backlinks data with Majestic data and best price source
    const enrichedBacklinksData = allBacklinksData.map(({ marketplaces, ...rest }) => {
        const majesticData = majesticDataMap.get(rest.domain);
        const bestMarketplace = (marketplaces ?? []).reduce(
            (prev, curr) => (prev.price < curr.price ? prev : curr),
            { price: Infinity, marketplace_source: '' }
        );

        return {
            ...majesticData,
            ...rest, // Spread remaining fields, but marketplaces is removed
            price: bestMarketplace.price,
            source: bestMarketplace.marketplace_source,
            allSources: marketplaces, // Rename marketplaces to allSources
        };
    });

    const minPrice = enrichedBacklinksData.reduce((total, backlink) => total + backlink.price, 0);
    const maxPrice = enrichedBacklinksData.map((backlink) => Math.max(...backlink.allSources.map((source) => source.price))).reduce((sum, price) => sum + price, 0);
    const avgPrice = Math.floor(minPrice / databaseFound);

    const foundCount = `${databaseFound} / ${totalFound}`;
    const aboutPrice = [foundCount, avgPrice, minPrice, maxPrice];

    return { uniqueDomains, aboutPrice, enrichedBacklinksData };
};
