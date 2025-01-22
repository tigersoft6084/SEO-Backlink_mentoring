import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace, FormattedErefererData } from "@/types/backlink.ts";
import * as cheerio from "cheerio";

export const getFormDataFromEreferer = async (response: string): Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {
  try {
    // Ensure response is valid and contains HTML
    if (typeof response !== "string") {
      throw new Error("Invalid response data. Expected a string.");
    }

    // Load the HTML content into cheerio
    const $ = cheerio.load(response);

    // Find the relevant <script> tag with responseGlobalItems
    const scriptContentToReturn = $("script")
      .filter((_, element) => !!$(element).html()?.includes("responseGlobalItems"))
      .first()
      .html();

    if (!scriptContentToReturn) {
      throw new Error("No relevant script content found.");
    }

    // Extract the JSON part from the script content
    const jsonMatch = scriptContentToReturn.match(/responseGlobalItems\s*=\s*(\{.*\});/);
    if (!jsonMatch || jsonMatch.length < 2) {
      throw new Error("Failed to extract JSON content.");
    }

    const jsonData : { [key: string]: FormattedErefererData } = JSON.parse(jsonMatch[1]);

    // Process the data and extract the required information
    const result = Object.values(jsonData).map((item) => {
      // Extract domain from URL
      const domain = new URL(item.url).hostname;

      const formattedDomain = domain
        .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
        .replace(/\/$/, ""); // Remove trailing slash

        const categories = item.metrics.majestic.categories || "";
        const ttf = categories.length > 0 ? categories.split(":")[0] : "";

      return {
        domain: formattedDomain,
        tf: Number(item.metrics.majestic.trustFlow) || 0,
        cf: Number(item.metrics.majestic.citation) || 0,
        rd : Number(item.metrics.majestic.refDomains) || 0,
        price: Number(item.price) || 0,
        ttf : ttf,
        language: item.language || "", // Provide a default value for language
        ref_lang: "",
      };
    });

    return result; // Return the processed result
  } catch (error) {
    const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Ereferer");
    return new Response(JSON.stringify(errorDetails), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
};
