import axios from "axios";
import axiosRetry from "axios-retry";
import { getTokenForLinkBuilders } from "../getTokens/link-builders";
import { getTokenForPrensalink } from "../getTokens/prensalink";
import { GET_BACKLINK_FROM_LINKBUILDERS_URLS } from "@/global/marketplaceUrls";
import { BackLinkData, LinkBuildersResult } from "@/types/backlink";




// // Setup retry mechanism with axios
// axiosRetry(axios, {
//   retries: 3, // Retry failed requests up to 3 times
//   retryDelay: (retryCount) => retryCount * 1000, // Retry delay with exponential backoff
//   retryCondition: (error) => axios.isAxiosError(error), // Retry only Axios-related errors
// });

// Function to fetch and process data from the single URL
export const getDataFromLinkbuilders = async () => {

    // const Token = await getTokenForLinkBuilders();

    // if (!Token) {
    //     throw new Error("API token is missing");
    // }

    const Token = await getTokenForPrensalink();

    if (!Token) {
        throw new Error("API token is missing");
    }

  try {
    const response = await axios.get(GET_BACKLINK_FROM_LINKBUILDERS_URLS, {
      headers: { Cookie : `__Host-access-token=${Token}; Path=/; Secure; HttpOnly;` },
    });

    const results = response.data.currentPageResults || [];
    const allData: BackLinkData[] = results.map((result: LinkBuildersResult) => {
      const kpi = result.kpi || {};
      const article = result.articles?.[0] || {};

      return {
        domain: result.name || "Unknown",
        tf: kpi.trustFlow || 0,
        cf: kpi.citationFlow || 0,
        rd: kpi.refDomain || 0,
        price: article.price || 0,
      };
    });

    return allData;
  } catch (error: any) {
    console.error(`Failed to fetch data from URL: ${GET_BACKLINK_FROM_LINKBUILDERS_URLS}`, error.message);
    return []; // Return an empty array in case of failure
  }
};
