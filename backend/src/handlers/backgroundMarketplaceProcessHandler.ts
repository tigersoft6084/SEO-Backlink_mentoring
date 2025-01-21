import { PayloadRequest } from "payload";
import { COLLECTION_NAME_BACKLINK, COLLECTION_NAME_DOMAINS_BACKGROUND_PROCESS } from "@/global/strings.ts";
import { ErrorHandler } from "./errorHandler.ts";
import { fetchExpiryDate } from "@/services/expiredDomains/whoiserService.ts";

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

            await payload.update({
                collection : COLLECTION_NAME_BACKLINK,
                where : {
                    domain : {
                        equals : domain
                    }
                },
                data : {
                    expiry_date : expiryDate ? expiryDate.toISOString() : null
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