import { PayloadRequest } from "payload";
import { handleNoDataResponse, handleSuccessResponse } from "@/utils/responseUtils.ts";
import { ErrorHandler } from "./errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace, Marketplace } from "@/types/backlink.ts";
import { COLLECTION_NAME_BACKLINK, COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS } from "@/global/strings.ts";

/**
 * Optimized handler to process and save marketplace backlink data.
 */
export const marketplaceHandler = async (
    req: PayloadRequest,
    fetchData: () => Promise<FetchedBackLinkDataFromMarketplace[]>,
    marketplaceName: string,
): Promise<Response> => {

    const { payload } = req;

    try {

        const marketplaceData = await fetchData();

        if (!Array.isArray(marketplaceData) || marketplaceData.length === 0) {
            return handleNoDataResponse(marketplaceName);
        }

        const totalItems = marketplaceData.length;
        let processedItems = 0;
        let lastProgressLogged = 0;

        // Group by domain (only once) to minimize redundant processing
        const domainMap: { [key: string]: FetchedBackLinkDataFromMarketplace[] } = marketplaceData.reduce((acc, item) => {
            const domain = item.domain.toLowerCase().trim();
            if (!acc[domain]) acc[domain] = [];
            acc[domain].push(item);
            return acc;
        }, {} as { [key: string]: FetchedBackLinkDataFromMarketplace[] });

        // Process each unique domain once
        const savePromises = Object.keys(domainMap).map(async (domain) => {
            const itemsForDomain = domainMap[domain];
            const firstItem = itemsForDomain[0];  // Use the first item for domain info

            const tf = Number(firstItem.tf);
            const cf = Number(firstItem.cf);
            const rd = Number(firstItem.rd);

            // Use unique prices for the domain
            const uniquePrices = Array.from(new Set(itemsForDomain.map(item => Number(item.price))));
            if (uniquePrices.length > 1) {
                console.warn(`Multiple prices found for domain: ${domain}. Using the first one.`);
            }
            const price = uniquePrices[0];

            if (!domain || isNaN(price)) {
                throw new Error(`Invalid data received for domain: ${domain}, Price=${price}`);
            }

            // Fetch the existing entry for the domain only once
            const existingEntry_backlinkCollection = await payload.find({
                collection: COLLECTION_NAME_BACKLINK,
                where: {
                    Domain: { equals: domain },
                },
                limit: 1,
            });

            const existingEntry_domainCollection = await payload.find({
                collection : COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                where : {
                    Domain : {equals : domain},
                },
                limit : 1,
            })

            if(existingEntry_domainCollection.docs.length == 0){
                await payload.create({
                    collection : COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                    data : {
                        Domain : domain,
                        Status : "pending",
                        Created_At: new Date().toISOString(),
                    }
                });
            }

            // If entry exists, update it; otherwise, create a new one
            if (existingEntry_backlinkCollection.docs.length > 0) {
                const entryToUpdate = existingEntry_backlinkCollection.docs[0];

                // Find the marketplace with the same source
                const existingMarketplace = entryToUpdate.Marketplaces.find(
                    (marketplace: Marketplace) => marketplace.Marketplace_Source === marketplaceName
                );

                if (existingMarketplace) {
                    // If the price is different, update it
                    if (existingMarketplace.Price !== price) {
                        existingMarketplace.Price = price;

                        await payload.update({
                            collection: COLLECTION_NAME_BACKLINK,
                            id: entryToUpdate.id,
                            data: {
                                TF: tf,
                                CF: cf,
                                RD: rd,
                                Marketplaces: entryToUpdate.Marketplaces, // Existing marketplaces with updated price
                                Date_Fetched: new Date().toISOString(),
                            },
                        });
                    }
                } else {
                    // If the marketplace doesn't exist, add it (with the new price)
                    entryToUpdate.Marketplaces.push({
                        Marketplace_Source: marketplaceName,
                        Price: price,
                    });

                    await payload.update({
                        collection: COLLECTION_NAME_BACKLINK,
                        id: entryToUpdate.id,
                        data: {
                            TF: tf,
                            CF: cf,
                            RD: rd,
                            Marketplaces: entryToUpdate.Marketplaces,
                            Date_Fetched: new Date().toISOString(),
                        },
                    });
                }
            } else {

                // Create a new entry if it doesn't exist
                await payload.create({
                    collection: COLLECTION_NAME_BACKLINK,
                    data: {
                        Domain: domain,
                        TF: tf,
                        CF: cf,
                        RD: rd,
                        Marketplaces: [
                            { Marketplace_Source: marketplaceName, Price: price },
                        ],
                        Date_Fetched: new Date().toISOString(),
                    },
                });
            }

            processedItems += 1;
            const progress = Math.round((processedItems / totalItems) * 100);
            if (progress >= lastProgressLogged + 5) {
                console.log(`${marketplaceName} database uploading progress: ${progress}%`);
                lastProgressLogged = progress;
            }
        });

        await Promise.all(savePromises);

        return handleSuccessResponse(marketplaceData, marketplaceName);
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, `Processing ${marketplaceName} Data`);
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
