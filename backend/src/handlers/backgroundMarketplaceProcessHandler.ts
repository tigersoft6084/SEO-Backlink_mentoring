import { PayloadRequest } from "payload";
import { COLLECTION_NAME_BACKLINK, COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS } from "@/globals/strings.ts";
import { ErrorHandler } from "./errorHandler.ts";
import { fetchExpiryDate } from "@/services/expiredDomains/whoiserService.ts";
import { fetchMajesticData } from "@/services/majestic/getIndexItemInfo.ts";

export const backgroundMarketplaceProcessHandler = async (req: PayloadRequest) => {
    const { payload } = req;

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
                        const [expiryDate, majesticData] = await Promise.all([
                            fetchExpiryDate(domain),
                            fetchMajesticData(domain)
                        ]);

                        console.log(`Expiry Date for ${domain}:`, expiryDate);

                        if (!expiryDate) {
                            console.warn(`Skipping domain ${domain} due to invalid expiry date.`);
                            return;
                        }

                        // Fetch existing data
                        const existingRecord = await payload.find({
                            collection: COLLECTION_NAME_BACKLINK,
                            where: { domain: { equals: domain } },
                            limit: 1
                        });

                        const currentData = existingRecord.docs[0] || {}; // Get existing data or empty object

                        // Update with new values if available, otherwise keep existing
                        const newTf = majesticData?.tf && majesticData.tf !== 0 ? majesticData.tf : currentData.tf;
                        const newCf = majesticData?.cf && majesticData.cf !== 0 ? majesticData.cf : currentData.cf;
                        const newTTF = majesticData?.ttf && majesticData.ttf !== "" ? majesticData.ttf : currentData.ttf;
                        const newBacklinks = majesticData?.backlinks && majesticData.backlinks !== 0 ? majesticData.backlinks : currentData.backlinks;
                        const newTitle = majesticData?.title && majesticData.title !== "" ? majesticData.title : currentData.title;
                        const newLanguage = majesticData?.language && majesticData.language !== "" ? majesticData.language : currentData.language;
                        const newRefLang = majesticData?.ref_lang && majesticData.ref_lang !== "" ? majesticData.ref_lang : currentData.ref_lang;
                        const newRefIps = majesticData?.ref_ips && majesticData.ref_ips !== 0 ? majesticData.ref_ips : currentData.ref_ips;
                        const newRefSubnets = majesticData?.ref_subnets && majesticData.ref_subnets !== 0 ? majesticData.ref_subnets : currentData.ref_subnets;
                        const newRefEdu = majesticData?.ref_edu && majesticData.ref_edu !== 0 ? majesticData.ref_edu : currentData.ref_edu;
                        const newRefGov = majesticData?.ref_gov && majesticData.ref_gov !== 0 ? majesticData.ref_gov : currentData.ref_gov;

                        // Update Backlinks Collection
                        await payload.update({
                            collection: COLLECTION_NAME_BACKLINK,
                            where: { domain: { equals: domain } },
                            data: {
                                expiry_date: expiryDate ? expiryDate.toISOString() : null,
                                tf: newTf,
                                cf: newCf,
                                ttf: newTTF,
                                backlinks: newBacklinks,
                                title: newTitle,
                                language: newLanguage,
                                ref_lang: newRefLang,
                                ref_ips: newRefIps,
                                ref_subnets: newRefSubnets,
                                ref_edu: newRefEdu,
                                ref_gov: newRefGov
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
