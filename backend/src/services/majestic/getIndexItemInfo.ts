import { MAJESTIC_URL } from "@/globals/globalURLs.ts";
import { COLLECTION_NAME_BACKLINK } from "@/globals/strings.ts";
import { axiosInstance } from "@/utils/axiosInstance.ts";
import { isValidDomain } from "@/utils/domainUtils.ts";
import { Payload } from 'payload';

// Define the type of the data to update in the payload database
interface BacklinkData {
    tf: number;
    cf: number;
    rd: number;
    ttf: string;
    backlinks: number;
    ref_ips: number;
    ref_subnets: number;
    ref_edu: number;
    ref_gov: number;
    title: string;
    language: string;
    ref_lang: string;
}


export const fetchMajesticData = async (payload : Payload, domain: string): Promise<void | null> => {

    // Validate domain format
    if (!isValidDomain(domain)) {
        console.error(`Invalid domain format: ${domain}`);
    }

    const MAJESTIC_API_KEY = process.env.MAJESTIC_API_KEY;

    if (!MAJESTIC_API_KEY) {
        throw new Error('Majestic API KEY is missing');
    }

    try {
        const response = await axiosInstance.get(`${MAJESTIC_URL}?app_api_key=${MAJESTIC_API_KEY}&cmd=GetIndexItemInfo&items=1&item0=${domain}&datasource=fresh`);

        const data = response.data;

        if (!data || data.Code !== "OK" || !data.DataTables?.Results?.Data?.length) {
            console.error(`Invalid response from Majestic API for domain: ${domain}`);
            return null;
        }

        const result = data.DataTables.Results.Data[0];

        if (!data.DataTables?.Results?.Data?.length) {
            console.error(`Invalid response from Majestic API for domain: ${domain}`);
            return null;
        }

        const existingBacklinks = await payload.find({
            collection : COLLECTION_NAME_BACKLINK,
            where : { domain: { equals : domain } },
            limit : 1
        })

        const entryToUpdate = existingBacklinks.docs[0];

        if (!entryToUpdate) {
            console.error(`No existing record found for domain: ${domain}`);
            return;
        }

        const retryUpdate = async (id: string, data: BacklinkData, retries: number = 3): Promise<void> => {
            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    await payload.update({
                        collection: COLLECTION_NAME_BACKLINK,
                        id: id,
                        data: data,
                    });
                    return;
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        // Now TypeScript knows that `error` is an instance of `Error`
                        console.error("Error occurred:", error.message);
                    } else {
                        // Handle unexpected errors (e.g., network errors or non-Error objects)
                        console.error("Unknown error occurred", error);
                    }
                }
            }
        };

        await retryUpdate(entryToUpdate.id, {
            tf: result.TrustFlow || entryToUpdate.tf || 0,
            cf: result.CitationFlow || entryToUpdate.cf || 0,
            rd: result.RefDomains || entryToUpdate.rd || 0,
            ttf: result.TopicalTrustFlow_Topic_0 || entryToUpdate.ttf || "",
            backlinks: result.ExtBackLinks || entryToUpdate.backlinks || 0,
            ref_ips: result.RefIPs || entryToUpdate.ref_ips || 0,
            ref_subnets: result.RefSubNets || entryToUpdate.ref_subnets || 0,
            ref_edu: result.RefDomainsEDU || entryToUpdate.ref_edu || 0,
            ref_gov: result.RefDomainsGOV || entryToUpdate.ref_gov || 0,
            title: result.Title || entryToUpdate.title || "",
            language: result.Language || entryToUpdate.language || "",
            ref_lang: result.RefLanguage || entryToUpdate.ref_lang || "",
        });

    } catch (error) {
        console.error(`Error fetching Majestic data for domain: ${domain}`, error);
        return null;
    }
};
