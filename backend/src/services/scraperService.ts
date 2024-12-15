import puppeteer, { Page } from 'puppeteer';
import { Publisher } from '../models/publisher';
import { getCredentials } from '../services/credentialService';

export const scraperService = async (): Promise<Publisher[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page: Page = await browser.newPage();

  try {

    // Fetch credentials using credentialService
    const { email, password } = await getCredentials();

    // Scrape logic as written previously
    await page.goto('https://app.paper.club/en');
    await page.click('a[href="/login"]');
    await page.waitForNavigation();

    await page.type('input[name="email"]', email);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    if (page.url() !== 'https://app.paper.club/annonceur/dashboard') {
      throw new Error('Failed to log in or navigate to the dashboard.');
    }

    const publishers: Publisher[] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.newly-added-publishers .publisher-card')).map((card) => ({
        name: (card.querySelector('.publisher-name') as HTMLElement)?.innerText ?? '',
        price: (card.querySelector('.publisher-price') as HTMLElement)?.innerText ?? '',
        category: (card.querySelector('.publisher-category') as HTMLElement)?.innerText ?? '',
      }));
    });

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
