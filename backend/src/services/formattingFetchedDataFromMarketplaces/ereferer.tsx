import * as cheerio from "cheerio";

export const getFormDataFromEreferer = async (response: any) => {
  try {
    // Ensure response is valid and contains HTML
    if (!response || typeof response !== "string") {
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
    const jsonMatch = (scriptContentToReturn as string).match(/responseGlobalItems\s*=\s*(\{.*\});/);
    if (!jsonMatch || jsonMatch.length < 2) {
      throw new Error("Failed to extract JSON content.");
    }

    const jsonData = JSON.parse(jsonMatch[1]);

    // Process the data and extract the required information
    const result = Object.values(jsonData).map((item: any) => {
      // Extract domain from URL
      const domain = new URL(item.url).hostname;

      // Parse categories to find the highest value category
      const categoriesString = item.metrics?.majestic?.categories || "";
      const categories = [...categoriesString.matchAll(/(.*?):\s*(\d+):/g)]
        .map((match) => ({ category: match[1].trim(), value: parseInt(match[2], 10) }));

      const highestCategory = categories.reduce(
        (max, cat) => (cat.value > max.value ? cat : max),
        { category: "", value: 0 }
      );

      const formattedDomain = domain
      .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
      .replace(/\/$/, ""); // Remove trailing slash


      return {
        domain : formattedDomain || "unknown", // Use domain instead of URL
        tf: item.metrics.majestic.trustFlow || 0,
        cf: item.metrics.majestic.citation || 0,
        rd: item.metrics.majestic.refDomains || 0,
        price: item.price || 0,
        ttf: highestCategory.category || "",
        language: item.language || "",
        gov: item.metrics.majestic.govBacklinks || 0,
        edu: item.metrics.majestic.eduBacklinks || 0,
      };
    });

    return result;
  } catch (error) {
    console.error("Error processing the page:", error);
    return null; // Return null in case of an error
  }
};
