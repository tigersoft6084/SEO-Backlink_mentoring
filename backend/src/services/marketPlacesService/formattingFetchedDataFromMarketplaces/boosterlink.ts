import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.js";
import * as cheerio from "cheerio";

export const getFormDataFromBoosterlink = async (response: string): Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {
  try {
    // Ensure response is valid and contains HTML
    if (!response || typeof response !== "string") {
      throw new Error("Invalid response data. Expected a string.");
    }

    // Load the HTML content into cheerio
    const $ = cheerio.load(response);

    const formatedBoosterlinkDatas: FetchedBackLinkDataFromMarketplace[] = [];

    // Select all rows that contain the comparators (excluding the header row)
    $('.row.ligne').each((index, row) => {

      // Get the URL from the second column
      const url = $(row).find('.col-md-2 a').attr('href') || '';
      const domain = url
        .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
        .replace(/\/$/, ""); // Remove trailing slash


      // Get the Trust Flow (TF) value from the class "bulle-tf bulle-tf20"
      const tf = parseFloat($(row).find('.col-md-2 .bulle-tf.bulle-tf20').text().trim()) || 0;
      const cf = 0;
      const rd = 0;
      // Get the price from the 4th column
      const price_string = $(row).find('.col-md-1.align-center').text().trim();
      const price = parseFloat(price_string.replace(/[^\d.-]/g, '')) || 0;

      // Push the extracted data into the FormatedBoosterlinkDatas array
      formatedBoosterlinkDatas.push({
        domain: domain,
        tf: tf !== null ? tf : 0, // If tf is null, default to 0
        cf: cf !== undefined && cf !== null ? cf : 0, // If cf is undefined or null, keep it as undefined
        rd: rd !== undefined && rd !== null ? rd : 0, // If rd is undefined or null, keep it as undefined
        price,
      });

    });

    return formatedBoosterlinkDatas;

  } catch (error) {

    const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Boosterlink");

    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }
};
