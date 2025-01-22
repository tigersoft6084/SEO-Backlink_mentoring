import { Payload } from "payload";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";
import { COLLECTION_NAME_BACKLINK, COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS } from "@/globals/strings.ts";

interface MongoError extends Error {
    codeName?: string;
}

const retryOperation = async (operation: () => Promise<void>, retries: number = 3, delayMs: number = 100): Promise<void> => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            await operation();
            return; // Exit if successful
        } catch (error) {
            const mongoError = error as MongoError;
            if (mongoError.codeName === "WriteConflict" && attempt < retries - 1) {
                console.warn(`WriteConflict encountered. Retrying... (${attempt + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            } else {
                throw error; // Rethrow if retries are exhausted or it’s not a WriteConflict
            }
        }
    }
};

export const uploadToDatabase = async (
    payload: Payload,
    item: FetchedBackLinkDataFromMarketplace,
    marketplaceName: string
): Promise<void> => {
    const domain = item.domain.toLowerCase().trim();
    const price = Number(item.price);

    if (!domain || isNaN(price)) {
        console.warn(`Invalid data received for domain: ${domain}, Price: ${price}`);
        return;
    }

    try {
        // Fetch existing entries in both collections
        const [existingBacklink, existingDomain] = await Promise.all([
            payload.find({
                collection: COLLECTION_NAME_BACKLINK,
                where: { domain: { equals: domain } },
                limit: 1,
            }),
            payload.find({
                collection: COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                where: { domain: { equals: domain } },
                limit: 1,
            }),
        ]);

        // Insert into `COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS` if it doesn’t exist
        if (existingDomain.docs.length === 0) {
            await payload.create({
                collection: COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                data: {
                    domain: domain,
                    status: "pending",
                    created_at: new Date().toISOString(),
                },
            });
        }

        if (existingBacklink.docs.length > 0) {
            const entryToUpdate = existingBacklink.docs[0];

            const existingMarketplace = entryToUpdate.marketplaces.find(
                (marketplace: { marketplace_source: string; price: number }) =>
                    marketplace.marketplace_source === marketplaceName
            );

            // Update the existing marketplace price if necessary
            if (existingMarketplace && existingMarketplace.price !== price) {
                existingMarketplace.price = price;
            } else if (!existingMarketplace) {
                entryToUpdate.marketplaces.push({
                    marketplace_source: marketplaceName,
                    price: price,
                });
            }

            // Retry logic for update operations
            await retryOperation(async () => {
                await payload.update({
                    collection: COLLECTION_NAME_BACKLINK,
                    id: entryToUpdate.id,
                    data: {
                        tf: item.tf || entryToUpdate.tf || 0,
                        cf: item.cf || entryToUpdate.cf || 0,
                        rd: item.rd || entryToUpdate.rd || 0,
                        ttf: item.ttf || entryToUpdate.ttf || "",
                        title: item.title || entryToUpdate.title || "",
                        backlinks: item.backlinks || entryToUpdate.backlinks || 0,
                        ref_ips: item.ref_ips || entryToUpdate.ref_ips || 0,
                        ref_subnets: item.ref_subnets || entryToUpdate.ref_subnets || 0,
                        ref_edu: item.ref_edu || entryToUpdate.ref_edu || 0,
                        ref_gov: item.ref_gov || entryToUpdate.ref_gov || 0,
                        language: item.language || entryToUpdate.language || "",
                        ref_lang: item.ref_lang || entryToUpdate.ref_lang || "",
                        marketplaces: entryToUpdate.marketplaces,
                        date_fetched: new Date().toISOString(),
                    },
                });
            });
        } else {
            // Create a new entry if none exists
            await payload.create({
                collection: COLLECTION_NAME_BACKLINK,
                data: {
                    domain: domain,
                    tf: item.tf || 0,
                    cf: item.cf || 0,
                    rd: item.rd || 0,
                    ttf: item.ttf || "",
                    title: item.title || "",
                    backlinks: item.backlinks || 0,
                    ref_ips: item.ref_ips || 0,
                    ref_gov: item.ref_gov || 0,
                    ref_subnets: item.ref_subnets || 0,
                    ref_edu: item.ref_edu || 0,
                    language: item.language || "",
                    ref_lang: item.ref_lang || "",
                    marketplaces: [
                        { marketplace_source: marketplaceName, price: price },
                    ],
                    date_fetched: new Date().toISOString(),
                },
            });
        }
    } catch (error) {
        console.error(`Error uploading domain ${domain}:`, error);
    }
};
