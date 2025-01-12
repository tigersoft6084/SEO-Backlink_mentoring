import { FormattedPaperclubData } from "@/types/backlink";

export const getFormDataFromPaperclub = async (response: any): Promise<any> => {
  try {
    // Ensure response is valid and contains currentPageResults array
    if (!response || !Array.isArray(response.currentPageResults)) {
      throw new Error("Invalid response data. Expected an array in 'currentPageResults'.");
    }

    const formattedPaperclubData: FormattedPaperclubData[] = [];

    // Process each result in currentPageResults
    formattedPaperclubData.push(
      ...response.currentPageResults.map((result: FormattedPaperclubData) => {
        const kpi = result.kpi || {};
        const article = result.articles?.[0] || {}; // Assuming there's at least one article in articles array

        // Process domain to remove "www." and "https://"
        const rawDomain = result.name || "Unknown";
        const formattedDomain = rawDomain.replace(/^(https?:\/\/)?(www\.)?/, ""); // Remove "http://", "https://", and "www."

        return {
          domain: formattedDomain, // Use formatted domain
          tf: kpi.trustFlow || 0, // Get trustFlow, or default to 0 if not available
          cf: kpi.citationFlow || 0, // Get citationFlow, or default to 0 if not available
          rd: kpi.refDomain || 0, // Get refDomain, or default to 0 if not available
          price: article.price || 0, // Get price from the article or default to 0
        };
      })
    );

    return formattedPaperclubData;

  } catch (error) {
    console.error("Error processing the page:", error);
    return null; // Return null in case of an error
  }
};
