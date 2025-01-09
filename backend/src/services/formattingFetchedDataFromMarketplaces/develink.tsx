import * as cheerio from "cheerio";

export const getFormDataFromDevelink = async (response: any) => {
  try {
    // Ensure response is valid and contains HTML
    if (!response || typeof response !== "string") {
      throw new Error("Invalid response data. Expected a string.");
    }

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response);

    // Initialize an array to hold the extracted data
    const result: {
      domain: string;
      price: number;
      tf: number;
      cf: number;
      rd: number;
    }[] = [];

    // Track processed domains to avoid duplicates
    const processedDomains = new Set<string>();

    // Select and iterate over the relevant elements
    $('button.btn-addtocart').each((_index, element) => {
      const button = $(element);

      // Extract attributes
      const url = button.attr('data-url') || '';

      let domain = "";

      if (url) {
          try {
              // If the `url` contains a valid URL, extract the hostname
              domain = new URL(url).hostname;
          } catch {
              // If the `url` is not a valid URL, assume it is a domain name
              domain = url;
          }
      }

      const prices = button.attr('data-prices');
      const tf = parseInt(button.attr('data-majtf') || '0', 10);
      const cf = parseInt(button.attr('data-majcf') || '0', 10);
      const rd = parseInt(button.attr('data-majrd') || '0', 10);

      // Skip if this domain has already been processed
      if (processedDomains.has(domain)) {
        return; // Continue to the next button
      }

      // Extract the most relevant price from data-prices
      let price = 0;
      if (prices) {
        try {
          const pricesObj = JSON.parse(prices.replace(/&quot;/g, '"'));

          // Prioritize 'price_sell_annonceur', fallback to 'price_sell_editeur'
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
      }

      // Add extracted data to the results array
      result.push({ domain, price, tf, cf, rd });

      // Mark this domain as processed
      processedDomains.add(domain);
    });

    return result;
  } catch (error) {
    console.error("Error processing the page:", error);
    return null; // Return null in case of an error
  }
};
