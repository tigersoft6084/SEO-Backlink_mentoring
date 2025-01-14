import * as cheerio from 'cheerio';

export const getFormDataFromMistergoodlink = async (response: any) => {
  try {
    if (!response || typeof response !== 'string') {
      throw new Error('Invalid response data. Expected a string.');
    }

    const $ = cheerio.load(response);

    // Check if table exists
    if ($('table tbody').length === 0) {
      console.error('No table found in the response.');
      return [];
    }

    const result: Array<{
      url: string;
      tf: number;
      cf: number;
      rd: number;
      price : number;
      language: string;
    }> = [];

    $('table tbody tr').each((index, row) => {

      const url = $(row).find("td.site_name a").attr("href") || ""; // Adjusted URL selector
      const tf = parseFloat($(row).find("td:nth-child(3)").text().trim()) || 0;
      const cf = parseFloat($(row).find("td:nth-child(4)").text().trim()) || 0;
      const rd = parseFloat($(row).find("td:nth-child(5)").text().trim()) || 0;
      const price_string = $(row).find("td.text-end.text-nowrap div").text().trim();
      const price = parseFloat(price_string.replace(/[^\d.-]/g, '')) || 0;

      const language = $(row).find("td:nth-child(2) img").attr("title") || "";

      if (url) {

        const formattedDomain = url
            .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
            .replace(/\/$/, ""); // Remove trailing slash

        result.push({ url : formattedDomain, tf, cf, rd, price, language });
      } else {
        console.warn(`Skipping row ${index + 1} due to missing URL.`);
      }
    });

    return result;
  } catch (error) {
    console.error('Error processing the page:', error);
    return null;
  }
};
