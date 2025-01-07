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

    console.log('Table Found:', $('table tbody').length > 0);

    const result: Array<{
      url: string;
      tf: string;
      cf: string;
      rd: string;
      price : string;
      language: string;
    }> = [];

    $('table tbody tr').each((index, row) => {
      console.log(`Row ${index + 1} HTML:`, $(row).html()); // Log the HTML of each row

      const url = $(row).find("td.site_name a").attr("href") || ""; // Adjusted URL selector
      const tf = $(row).find("td:nth-child(3)").text().trim();
      const cf = $(row).find("td:nth-child(4)").text().trim();
      const rd = $(row).find("td:nth-child(5)").text().trim();
      const price = $(row).find("td.text-end.text-nowrap div").text().trim();

      const language = $(row).find("td:nth-child(2) img").attr("title") || "";

      if (url) {
        result.push({ url, tf, cf, rd, price, language });
      } else {
        console.warn(`Skipping row ${index + 1} due to missing URL.`);
      }
    });

    console.log('Extracted result:', result);
    return result;
  } catch (error) {
    console.error('Error processing the page:', error);
    return null;
  }
};
