import puppeteer, { Page } from 'puppeteer';
import { Publisher } from '../models/publisher';
import { getCredentials } from '../services/credentialService';

export const scraperService = async (): Promise<Publisher[]> => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true, // Use 'true' for production
  });
  const page: Page = await browser.newPage();

  try {

    // Fetch credentials using credentialService
    const { email, password } = await getCredentials();

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


    // Create the publishers array based on the updated Publisher interface
    const publishers: Publisher[] = [
      {
        url: 'www.pcmag.com',
        price: price ?? 'N/A', // Fallback in case the price is null or undefined
      },
    ];

    console.log('Scraped Publishers:', publishers);

    await browser.close();
    return publishers;
  } catch (error) {
    // Log and handle errors
    console.error('Error during scraping:', error);
    await browser.close();
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred during scraping.'
    );
  }
};
