import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";
import * as cheerio from "cheerio";

export const getFormDataFromDevelink = async (
  response: string
): Promise<FetchedBackLinkDataFromMarketplace[]> => {
  try {
    if (!response || typeof response !== "string") {
      throw new Error("Invalid response data. Expected a string.");
    }

    const $ = cheerio.load(response);
    const result: FetchedBackLinkDataFromMarketplace[] = [];
    const processedDomains = new Set<string>();

    $('button.btn-addtocart').each((_index, element) => {
      const button = $(element);

      const url = button.attr("data-url") || "";
      let domain = "";

      if (url) {
        try {
          domain = new URL(url).hostname;
        } catch {
          domain = url;
        }
      }

      const prices = button.attr("data-prices") || "{}";
      const tf = parseInt(button.attr("data-majtf") || "0", 10);
      const cf = parseInt(button.attr("data-majcf") || "0", 10);
      const rd = parseInt(button.attr("data-majrd") || "0", 10);

      const formattedDomain = domain
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .replace(/\/$/, "");

      if (processedDomains.has(formattedDomain)) {
        return;
      }

      let price = 0;
      try {
        const pricesObj = JSON.parse(prices.replace(/&quot;/g, '"'));
        if (pricesObj.price_sell_annonceur) {
          const match = pricesObj.price_sell_annonceur.match(/(\d+)/);
          if (match) price = parseInt(match[1], 10);
        } else if (pricesObj.price_sell_editeur) {
          const match = pricesObj.price_sell_editeur.match(/(\d+)/);
          if (match) price = parseInt(match[1], 10);
        }
      } catch (error) {
        console.error("Error parsing prices JSON:", error);
      }

      if (formattedDomain && price > 0) {
        result.push({
          domain: formattedDomain,
          price: price,
          tf: tf || 0,
          cf: cf || 0,
          rd: rd || 0,
          language: "", // Provide a default value for language
          ref_lang: "",
        });
        processedDomains.add(formattedDomain);
      }
    });

    return result;
  } catch (error) {
    console.error("Error Formatting Data For Develink:", error);
    throw error; // Re-throw error for consistent handling
  }
};
