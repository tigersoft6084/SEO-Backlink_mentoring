import type { CollectionConfig } from 'payload';
import puppeteer from 'puppeteer';
import { getCredentials } from '../../services/credentialService';

export const Scrapers: CollectionConfig = {
  slug: 'scrapers',
  fields: [],
  access: {
    create: () => false,
  },
  endpoints: [
    {
      path: '/paperClub',
      method: 'get',
      handler: async (req) => {
        let browser;

        try {
          const { email, password } = await getCredentials();

          // Launch Puppeteer browser
          browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true, // Use 'true' for production
          });

          const page = await browser.newPage();

          // Navigate to Paper Club login page
          await page.goto('https://www.paper.club/en/', { waitUntil: 'networkidle2' });

          // Click "Join the Club" button
          await page.evaluate(() => {
            const joinButton = Array.from(document.querySelectorAll('button, a')).find(
              (el) => el.textContent?.trim() === 'Join the Club'
            );
            if (joinButton) (joinButton as HTMLElement).click();
          });

          await page.waitForNavigation({ waitUntil: 'networkidle0' });

          // Perform login
          await page.type('input[name="email"]', email);
          await page.type('input[name="password"]', "Challenge@624");

          await page.evaluate(() => {
            const loginButton = Array.from(document.querySelectorAll('button, a')).find(
              (el) => el.textContent?.trim() === 'Login'
            );
            if (loginButton) (loginButton as HTMLElement).click();
          });

          await page.waitForNavigation({ waitUntil: 'networkidle0' });

          // Search for the domain
          const searchInput = 'input[placeholder="Domain name or keyword(s)"]';
          await page.waitForSelector(searchInput, { visible: true });
          await page.type(searchInput, 'www.pcmag.com');
          await page.keyboard.press('Enter');

          // Extract the price
          const priceSelector = '.m-tableLine__column.-price.-center > p';
          await page.waitForSelector(priceSelector);
          const price = await page.$eval(priceSelector, (el) => el.textContent?.trim());

          // Return the scraped data
          return new Response(
            JSON.stringify({ success: true, message: 'Scraping successful', data: { price } }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error: any) {
          console.error('Scraping error:', error.message || error);
          return new Response(
            JSON.stringify({ success: false, message: 'Scraping failed', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        } finally {
          if (browser) {
            await browser.close();
          }
        }
      },
    },
  ],
};
