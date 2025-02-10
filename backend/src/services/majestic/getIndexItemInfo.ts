import { MAJESTIC_URL } from "@/globals/globalURLs.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";
import { axiosInstance } from "@/utils/axiosInstance.ts";
import { isValidDomain } from "@/utils/domainUtils.ts";

export const fetchMajesticData = async (domain: string): Promise<FetchedBackLinkDataFromMarketplace | null> => {

    // Validate domain format
    if (!isValidDomain(domain)) {
        console.error(`Invalid domain format: ${domain}`);
        return null;
    }

    const MAJESTIC_API_KEY = process.env.MAJESTIC_API_KEY;
    if (!MAJESTIC_API_KEY) {
        throw new Error('Majestic API KEY is missing');
    }

    try {
        const response = await axiosInstance.get(`${MAJESTIC_URL}?app_api_key=${MAJESTIC_API_KEY}&cmd=GetIndexItemInfo&items=1&item0=${domain}&datasource=fresh&AddAllTopics=1`);

        const data = response.data;

        if (!data || data.Code !== "OK" || !data.DataTables?.Results?.Data?.length) {
            console.error(`Invalid response from Majestic API for domain: ${domain}`);
            return null;
        }

        const result = data.DataTables.Results.Data[0];

        return {
            domain: result.Item || domain,
            ref_ips: result.RefIPs || 0,
            ref_subnets: result.RefSubNets || 0,
            ref_edu: result.RefDomainsEDU || 0,
            ref_gov: result.RefDomainsGOV || 0,
            title: result.Title || "",
            language: result.Language || "",
            ref_lang: result.RefLanguage || "",
            cf: result.CitationFlow || 0,
            tf: result.TrustFlow || 0,
            ttf: result.TopicalTrustFlow_Topic_0 || "",
            backlinks : result.ExtBackLinks || 0
        };

    } catch (error) {
        console.error(`Error fetching Majestic data for domain: ${domain}`, error);
        return null;
    }
};
