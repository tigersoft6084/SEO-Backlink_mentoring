import { PayloadRequest } from "payload";
import { COLLECTION_NAME_BACKLINK, COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS } from "@/globals/strings.ts";
import { ErrorHandler } from "./errorHandler.ts";
import { fetchExpiryDate } from "@/services/expiredDomains/whoiserService.ts";
import { fetchMajesticData } from "@/services/majesticService.ts";

export const backgroundMarketplaceProcessHandler = async (req : PayloadRequest) => {

    const { payload } = req;

    while(true){

        try{

            const domainTask = await payload.find({
                collection : COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                where : {
                    status : {
                        equals : "pending"
                    }
                },
                limit : 1,
                sort : "created_at"
            })

            if(domainTask.docs.length === 0){
                console.log("No domains to process. Sleeping for 1 minute.....");
                await new Promise((resolve) => setTimeout(resolve, 60000));
                continue;
            }

            const domainDoc = domainTask.docs[0];
            const domain = domainDoc.domain;

            console.log(`Processing Domain : ${domain}`);

            //Mark as processing
            await payload.update({
                collection : COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                id : domainDoc.id,
                data : {
                    status : "processing",
                    updated_at : new Date().toISOString()
                }
            });

            //Fetch detailed information such as TF, CF, RD and more from Majesctic and expiry date from WHOIS.
            const expiryDate = await fetchExpiryDate(domain);

            console.log(`Expiry Date from ${domain} : `, expiryDate);

            if (!expiryDate) {
                console.warn(`Skipping domain ${domain} due to invalid expiry date.`);
                continue; // Skip this domain and move to the next
            }

            const majesticData = await fetchMajesticData(domain);

            const existingRecord = await payload.find({
                collection: COLLECTION_NAME_BACKLINK,
                where: { domain: { equals: domain } },
                limit: 1
            });

            const currentData = existingRecord.docs[0] || {}; // Get existing data or empty object
            const newTf = majesticData?.tf && majesticData.tf !== 0 ? majesticData.tf : currentData.tf; // Keep existing `tf` if majesticData.tf is 0 or doesn't exist
            const newCf = majesticData?.cf && majesticData.cf !== 0 ? majesticData.cf : currentData.cf;
            const newTTF = majesticData?.ttf && majesticData.ttf !== '' ? majesticData.ttf : currentData.ttf;
            const newBacklinks = majesticData?.backlinks && majesticData.backlinks !== 0 ? majesticData.backlinks : currentData.backlinks;
            const newTitle = majesticData?.title && majesticData.title !== '' ? majesticData.title : currentData.title;
            const newLanguage = majesticData?.language && majesticData.language !== '' ? majesticData.language : currentData.language;
            const newRefLang = majesticData?.ref_lang && majesticData.ref_lang !== '' ? majesticData.ref_lang : currentData.ref_lang;
            const newRefIps = majesticData?.ref_ips && majesticData.ref_ips !== 0 ? majesticData.ref_ips : currentData.ref_ips;
            const newRefSubnets = majesticData?.ref_subnets && majesticData.ref_subnets !== 0 ? majesticData.ref_subnets : currentData.ref_subnets;
            const newRefEdu = majesticData?.ref_edu && majesticData.ref_edu !== 0 ? majesticData.ref_edu : currentData.ref_edu;
            const newRefGov = majesticData?.ref_gov && majesticData.ref_gov !== 0 ? majesticData.ref_gov : currentData.ref_gov;

            await payload.update({
                collection : COLLECTION_NAME_BACKLINK,
                where : {
                    domain : {
                        equals : domain
                    }
                },
                data : {
                    expiry_date : expiryDate ? expiryDate.toISOString() : null,
                    tf : newTf,
                    cf : newCf,
                    ttf : newTTF,
                    backlinks : newBacklinks,
                    title : newTitle,
                    language : newLanguage,
                    ref_lang : newRefLang,
                    ref_ips : newRefIps,
                    ref_subnets : newRefSubnets,
                    ref_edu : newRefEdu,
                    ref_gov : newRefGov
                }
            });

            console.log(`Updated Backlinks collection for Domain : ${domain}`);

            //Remove from domains collection
            await payload.delete({
                collection : COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS,
                id : domainDoc.id
            });

            console.log(`Removed domain ${domain} from Domains collection.`);

        }catch(error){
            const { errorDetails, status } = ErrorHandler.handle(error, `Error from background marketplace process`);
            return new Response(JSON.stringify(errorDetails), {
                status,
                headers: { "Content-Type": "application/json" },
            });
        }
    }
}