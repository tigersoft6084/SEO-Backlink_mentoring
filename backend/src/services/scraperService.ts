// import puppeteer, { Page } from 'puppeteer';
// // import puppeteer from 'puppeteer-extra';
// // import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import { Publisher } from '../models/publisher';
// import { getMarketPlaces } from './marketPlacePlatformService';

// // puppeteer.use(StealthPlugin());

// export const scraperService = async (websiteUrl : string) => {

//   let browser;
  
//   browser = await puppeteer.launch({
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     headless: false, // Use 'true' for production
//   });
//   const page: Page = await browser.newPage();

//   try {

//     // Fetch credentials using credentialService
//     //const { email, password } = await getCredentials();

//     // Navigate to Paper Club login page
//     await page.goto(websiteUrl, { waitUntil: 'networkidle2' });

//      let price;

//      switch(websiteUrl){
//         case "https://www.paper.club/en/":
//             {
//             // Use scrapeDomainPrice to perform the scraping process
//             const domain1 = 'www.pcmag.com'; // Example domain to scrape
//             price = await scrapePaperClubPrice(page, email, password, domain1);
//             break;}
//         case "https://en.ereferer.com/":
//             {// Use scrapeDomainPrice to perform the scraping process
//             const domain = 'https://www.bleepingcomputer.com/'; // Example domain to scrape
//             price = await scrapeErefererPrice(page, email, password, domain);
//             break;}
//         default : 
//             throw new Error(`Unsupported website URL: ${websiteUrl}`);
//      }
     

//     // Create the publishers array based on the updated Publisher interface
//     const publishers: Publisher[] = [
//       {
//         url: websiteUrl,
//         price: price ?? 'N/A', // Fallback in case the price is null or undefined
//       },
//     ];

//     console.log('Scraped Publishers:', publishers);
    
//       // Construct the JSON response with the desired style
//       return new Response(
//         JSON.stringify({
//           success: true,
//           message: 'Scraping successful',
//           data: {
//             price: price ?? 'N/A', // Provide the scraped price or a fallback
//           },
//         }),
//         {
//           status: 200,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//   } catch (error) {
//         // Log and handle errors
//         console.error('Error during scraping:', error);
//         throw new Error(
//             error instanceof Error ? error.message : 'An unknown error occurred during scraping.'
//         );
//     } finally {
//         // Ensure browser is closed
//         await browser.close();
//     }
// };
