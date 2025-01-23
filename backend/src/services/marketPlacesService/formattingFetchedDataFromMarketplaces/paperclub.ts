import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";

// Define the type for the response structure
interface PaperclubResponse {
  currentPageResults: {
    name?: string; // The domain name
    kpi?: {
      trustFlow?: number;
      citationFlow?: number;
      refDomain?: number;
      backLinks? : number;
      maxTopicalTrustFlow? : string | '';
    };
    articles?: {
      price?: number;
    }[];
  }[];
}


export const getFormDataFromPaperclub = async (response: PaperclubResponse): Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {
  try {
    // Ensure response is valid and contains currentPageResults array
    if (!response || !Array.isArray(response.currentPageResults)) {
      throw new Error("Invalid response data. Expected an array in 'currentPageResults'.");
    }

    const formattedPaperclubData: FetchedBackLinkDataFromMarketplace[] = response.currentPageResults.map((result) => {
      const kpi = result.kpi || {};
      const article = result.articles?.[0] || {}; // Assuming there's at least one article in the array

      // Process domain to remove "www." and "https://"
      const rawDomain = result.name || "Unknown";
      const formattedDomain = rawDomain.replace(/^(https?:\/\/)?(www\.)?/, ""); // Remove "http://", "https://", and "www."

      return {
        domain: formattedDomain, // Use formatted domain
        tf: kpi.trustFlow || 0, // Get trustFlow, or default to 0 if not available
        cf: kpi.citationFlow || 0, // Get citationFlow, or default to 0 if not available
        rd: kpi.refDomain || 0, // Get refDomain, or default to 0 if not available
        backlinks : kpi.backLinks || 0,
        ttf : kpi.maxTopicalTrustFlow ? kpi.maxTopicalTrustFlow.split("-")[1] || kpi.maxTopicalTrustFlow : '',
        price: article.price || 0, // Get price from the article or default to 0
      };
    });

    return formattedPaperclubData;

  } catch (error) {
    const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Paperclub");

    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }
};
