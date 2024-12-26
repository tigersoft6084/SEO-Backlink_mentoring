import { GET_BACKLINK_FROM_BACKLINKED_URL } from "@/global/marketplaceUrls";
import axios from "axios";
import axiosRetry from "axios-retry";

const Token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MzQwMzc1MjQsImV4cCI6MTczNjYyOTUyNCwicm9sZXMiOlsiUk9MRV9QVUJMSVNIRVIiXSwidXNlcm5hbWUiOiJnb25nZ29uZzYyNDcyMUBnbWFpbC5jb20iLCJjZXJ0aWZpZWQiOnRydWV9.WpzBc0LdZ5qZIBF0cCVsvN9I_azRd1dPmToJNGo_kWpbealOWGVb9wWGKmF8g7zV47EIAtN-TkfZD3kdmHWK1wH7WNP9u6zguJm7Ne-yi1S2m1doY_iLHUbihohLDMo6ONU2aBV0VtYNFcBhz6hzAtftYRdwULIFHufITwO_mNwkq-kNHOFPLiEBgQzWQ-nNcpc1rTDUoL0VrHtkkfqchAMihtg81E50EGIuPbyaEEArTc69FeANOaQpCGz8WEw_zsOgIVQnn40CLWCl5mMGpFisSxPiWpYFPk-gBHunQIAgVziwdXQM1ii1ea_XoWefn0VBtPGZfKys-vDa4yNEjcUCI5BBR4DpUrHb_KPjyMOh_0fxoDpKPeW0q84UT444eZudYY0dXgNkqlR1WXyNG6sTbzgHIvSU-_17Rag7ZZMKu-ZwWdZjsES5c2PN6e2dSwALLWfMLNWntpcEBfkH1l81usLDQGofHR3rPlKh-Sk7KZEwECbEM_ZEWdoXJjWXzebFf3t1UZeVR9cwGtEIQ1_mE-xXA-mtRIP09UgYhD_AoHYnECLP4_wWtFX2DVgskPhhazPL6RjLyBUQxw0XBOZIDKMEaLyCic1oHOwujltKFN6lv6xZpDc4k-LS77cf5Cdrg-cVUtAnQPSCsqxbUcXpCaC3Qy_0iElMS8SqtH0";

interface PaperclubData {
  domain: string;
  tf: string | number;
  cf: string | number;
  rd: string | number;
  price: string | number;
}

interface Result {
  name?: string;
  kpi?: {
    trustFlow?: number;
    citationFlow?: number;
    refDomain?: number;
  };
  articles?: {
    price?: number;
  }[];
}

// Setup retry mechanism with axios
axiosRetry(axios, {
  retries: 3, // Retry failed requests up to 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Retry delay with exponential backoff
  retryCondition: (error) => axios.isAxiosError(error), // Retry only Axios-related errors
});

// Function to fetch and process data from the single URL
export const getDataFromBacklined = async () => {

  if (!Token) {
    throw new Error("API token is missing");
  }

  try {
    const response = await axios.get(GET_BACKLINK_FROM_BACKLINKED_URL, {
      headers: { Authorization: `Bearer ${Token}` },
      timeout: 30000, // Set timeout to 30 seconds
    });

    const results = response.data.currentPageResults || [];
    const allData: PaperclubData[] = results.map((result: Result) => {
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
    console.error(`Failed to fetch data from URL: ${GET_BACKLINK_FROM_BACKLINKED_URL}`, error.message);
    return []; // Return an empty array in case of failure
  }
};
