import * as cheerio from 'cheerio'; // Ensure cheerio is installed

export const getFormDataFromMistergoodlink = async (response: any) => {
  try {
    // Ensure response is a valid HTML string
    if (!response || typeof response !== 'string') {
      throw new Error('Invalid response data. Expected a string.');
    }

    // Load the HTML with Cheerio
    const $ = cheerio.load(response);

    // Initialize the result array
    const result: Array<{
      url: string;
      tf: string;
      cf: string;
      rd: string;
      ttf: string;
      language: string;
    }> = [];

    // Loop through each table row in the tbody
    $('div').each((index, element) => {
      const url = $(element).find('td.site_name a').attr('href') || '';
      const tf = $(element).find('td:nth-child(3)').text().trim();
      const cf = $(element).find('td:nth-child(4)').text().trim();
      const rd = $(element).find('td:nth-child(5)').text().trim();
      const ttf = $(element).find('td:nth-child(6)').text().trim();
      const language = $(element).find('td:nth-child(2) img').attr('title') || '';

      console.log(url)

      // Add the extracted data to the result array if the URL is valid
      if (url) {
        result.push({ url, tf, cf, rd, ttf, language });
      }
    });


    console.log($('tr'))
    // Log the final result for debugging purposes
    console.log('Extracted result:', result);

    return result; // Return the extracted data
  } catch (error) {
    console.error('Error processing the page:', error);
    return null; // Return null if there's an error
  }
};
