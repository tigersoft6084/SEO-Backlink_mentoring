import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { FetchedBackLinkDataFromMarketplace } from '@/types/backlink.js';
import * as cheerio from 'cheerio';

export const getFormDataFromMistergoodlink = async (response: string) : Promise<FetchedBackLinkDataFromMarketplace[] | Response> => {
  try {
    if (!response || typeof response !== 'string') {
      throw new Error('Invalid response data. Expected a string.');
    }

    const $ = cheerio.load(response);

    // Check if table exists
    const tableBody = $('table tbody');
    if (tableBody.length === 0) {
      console.error('No table found in the response.');
      return [];
    }

    const result : FetchedBackLinkDataFromMarketplace[] = [];

    tableBody.find('tr').each((index, row) => {

      const url = $(row).find("td.site_name a").attr("href") || ""; // Adjusted URL selector
      const tf = parseInt($(row).find("td:nth-child(3)").text().trim()) || 0;
      const cf = parseInt($(row).find("td:nth-child(4)").text().trim()) || 0;
      const rd = parseInt($(row).find("td:nth-child(5)").text().trim()) || 0;
      const price_string = $(row).find("td.text-end.text-nowrap div").text().trim();
      const price = parseInt(price_string.replace(/[^\d.-]/g, '')) || 0;

      // const language = $(row).find("td:nth-child(2) img").attr("title") || "";

      if (url) {

        const formattedDomain = url
            .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
            .replace(/\/$/, ""); // Remove trailing slash

        result.push({ domain : formattedDomain, tf, cf, rd, price });
      } else {
        console.warn(`Skipping row ${index + 1} due to missing URL.`);
      }
    });

    return result;
  } catch (error) {
    const { errorDetails, status } = ErrorHandler.handle(error, "Error Formatting Data For Mistergoodlink");

    return new Response(JSON.stringify(errorDetails), {
        status,
        headers: { "Content-Type": "application/json" },
    });
  }
};
