import { Payload } from "payload";
import { COLLECTION_NAME_BACKLINK, COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS } from "@/globals/strings.ts";
import { ErrorHandler } from "./errorHandler.ts";
import { fetchExpiryDate } from "@/services/expiredDomains/whoiserService.ts";

export const backgroundMarketplaceProcessHandler = async (payload : Payload) => {

    while (true) {
        try {
            // Fetch up to 5 pending domains at once
            const domainTasks = await payload.find({
                collection: COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                where: { status: { equals: "pending" } },
                limit: 5, // Fetch 5 domains at a time
                sort: "created_at"
            });

            if (domainTasks.docs.length === 0) {
                console.log("No domains to process. Sleeping for 1 minute.....");
                await new Promise((resolve) => setTimeout(resolve, 60000));
                continue;
            }

            console.log(`Processing ${domainTasks.docs.length} domains...`);

            // Process all 5 domains in parallel
            await Promise.all(
                domainTasks.docs.map(async (domainDoc) => {
                    const domain = domainDoc.domain;

                    try {
                        console.log(`Processing Domain: ${domain}`);

                        // Mark as processing
                        await payload.update({
                            collection: COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                            id: domainDoc.id,
                            data: {
                                status: "processing",
                                updated_at: new Date().toISOString()
                            }
                        });

                        // Fetch Majestic Data & Expiry Date in Parallel
                        const [expiryDate] = await Promise.all([
                            fetchExpiryDate(domain),
                        ]);

                        console.log(`Expiry Date for ${domain}:`, expiryDate);

                        if (!expiryDate) {
                            console.warn(`Skipping domain ${domain} due to invalid expiry date.`);
                            return;
                        }

                        // Update Backlinks Collection
                        await payload.update({
                            collection: COLLECTION_NAME_BACKLINK,
                            where: { domain: { equals: domain } },
                            data: {
                                expiry_date: expiryDate ? expiryDate.toISOString() : null,
                            }
                        });

                        console.log(`Updated Backlinks collection for Domain: ${domain}`);

                        // Remove from domains collection
                        await payload.delete({
                            collection: COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                            id: domainDoc.id
                        });

                        console.log(`Removed domain ${domain} from Domains collection.`);
                    } catch (error) {
                        console.error(`Error processing domain ${domain}:`, error);
                    }
                })
            );

        } catch (error) {
            const { errorDetails, status } = ErrorHandler.handle(error, "Error from background marketplace process");
            return new Response(JSON.stringify(errorDetails), {
                status,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
};
