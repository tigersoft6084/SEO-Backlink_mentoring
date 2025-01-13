import * as cheerio from "cheerio";

interface FormatedBoosterlinkData {
  title: string;
  domain: string;
  tf: number;
  price: number;
}

export const getFormDataFromBoosterlink = async (response: string): Promise<FormatedBoosterlinkData[] | null> => {
  try {
    // Ensure response is valid and contains HTML
    if (!response || typeof response !== "string") {
      throw new Error("Invalid response data. Expected a string.");
    }

    // Load the HTML content into cheerio
    const $ = cheerio.load(response);

    const formatedBoosterlinkDatas: FormatedBoosterlinkData[] = [];

    // Select all rows that contain the comparators (excluding the header row)
    $('.row.ligne').each((index, row) => {
      // Get the title from the first column
      const title = $(row).find('.col-md-3 .gras').text().trim();

      // Get the URL from the second column
      const url = $(row).find('.col-md-2 a').attr('href') || '';
      const domain = url
      .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol and "www."
      .replace(/\/$/, ""); // Remove trailing slash


      // Get the Trust Flow (TF) value from the class "bulle-tf bulle-tf20"
      const tf = parseFloat($(row).find('.col-md-2 .bulle-tf.bulle-tf20').text().trim()) || 0;

      // Get the price from the 4th column
      const price_string = $(row).find('.col-md-1.align-center').text().trim();
      const price = parseFloat(price_string.replace(/[^\d.-]/g, '')) || 0;

      // Push the extracted data into the FormatedBoosterlinkDatas array
      formatedBoosterlinkDatas.push({
        title ,
        domain,
        tf,
        price,
      });
    });

    return formatedBoosterlinkDatas;

  } catch (error) {
    console.error("Error processing the page:", error);
    return null; // Return null in case of an error
  }
};
