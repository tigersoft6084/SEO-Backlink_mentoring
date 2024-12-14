import type { CollectionConfig } from 'payload';
import puppeteer from 'puppeteer';

interface ScrapedData {
  title: string;
  description: string;
}

export const Scrapers: CollectionConfig = {
  slug: 'scrapers',
  fields: [],
  access : {
    create : () => false,
  },
  endpoints: [
    {
      path: '/paperclub',
      method: 'get',
      handler: async (req) => {
        let browser;

        try {
          // Launch Puppeteer browser
          browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Server-safe options
            headless: true,
          });

          // Open a new page
          const page = await browser.newPage();

          // Navigate to the target URL
          await page.goto('https://www.paper.club/en/', {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
          });

          // Extract data using DOM selectors
          const data: ScrapedData = await page.evaluate(() => {
            return {
              title: document.querySelector('h1')?.innerText.trim() || 'No title found',
              description: document.querySelector('p')?.innerText.trim() || 'No description found',
            };
          });

          // Respond with the scraped data
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Scraping successful',
              data,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Scraping error:', error);
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Scraping failed',
              //error: error.message || 'Unknown error',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        } finally {
          // Ensure the browser is closed
          if (browser) {
            await browser.close();
          }
        }
      },
    },
    {
      path: '/:id/forbidden',
      method: 'post',
      handler: async (req) => {
        // Example of an authenticated endpoint
        if (!req.user) {
          return new Response(
            JSON.stringify({ error: 'Forbidden' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ message: 'Successfully processed forbidden endpoint' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      },
    },
  ],
};
