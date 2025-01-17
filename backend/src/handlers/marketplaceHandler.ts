import { PayloadRequest } from "payload";
import { handleNoDataResponse, handleSuccessResponse } from "@/utils/responseUtils.ts";
import { ErrorHandler } from "./errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace, Marketplace } from "@/types/backlink.ts";
import { COLLECTION_NAME_BACKLINK } from "@/global/strings.ts";

/**
 * Generic handler to process and save marketplace backlink data.
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

        const savePromises = marketplaceData.map(async (item) => {
            const domain = item.domain.toLowerCase().trim();
            const tf = Number(item.tf);
            const cf = Number(item.cf);
            const rd = Number(item.rd);
            const price = Number(item.price);

            if (!domain || isNaN(tf) || isNaN(price)) {
                throw new Error(`Invalid data received for domain: ${domain}, TF=${tf}, price=${price}`);
            }

            const existingEntry = await payload.find({
                collection: COLLECTION_NAME_BACKLINK,
                where: {
                    Domain: { equals: domain },
                    "Marketplaces.Marketplace_Source": { equals: marketplaceName },
                },
                limit: 1,
            });

            if (existingEntry.docs.length > 0) {
                // If domain and marketplace are both the same, do nothing
                const entryToUpdate = existingEntry.docs[0];
                const existingMarketplace = entryToUpdate.Marketplaces.find(
                    (marketplace: Marketplace) => marketplace.Marketplace_Source === marketplaceName
                );

                if (existingMarketplace) {
                    // Marketplace already exists, don't update
                    return;
                }

                // If the domain exists but the marketplace is different, add the new marketplace
                const marketplaces: Marketplace[] = [
                    ...entryToUpdate.Marketplaces,
                    {
                        Marketplace_Source: marketplaceName,
                        Price: price,
                    },
                ];

                await payload.update({
                    collection: COLLECTION_NAME_BACKLINK,
                    id: entryToUpdate.id,
                    data: {
                        TF: tf,
                        CF: cf,
                        RD: rd,
                        Marketplaces: marketplaces,
                        Date_Fetched: new Date().toISOString(),
                    },
                });

            } else {
                // If no entry exists, create a new one
                await payload.create({
                    collection: COLLECTION_NAME_BACKLINK,
                    data: {
                        Domain: domain,
                        TF: tf,
                        CF: cf,
                        RD: rd,
                        Marketplaces: [
                            {
                                Marketplace_Source: marketplaceName,
                                Price: price,
                            },
                        ],
                        Date_Fetched: new Date().toISOString(),
                    },
                });
            }

            processedItems += 1;
            const progress = Math.round((processedItems / totalItems) * 100);
            console.log(`${marketplaceName} database uploading progress: ${progress}%`);
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
