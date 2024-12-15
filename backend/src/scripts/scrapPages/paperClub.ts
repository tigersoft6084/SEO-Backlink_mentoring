import { Page } from 'puppeteer';

/**
 * Function to automate the scraping process:
 * - Click "Join the Club"
 * - Perform login
 * - Search for a domain and extract the price
 */
export const scrapePaperClubPrice = async (
    page: Page,
    email: string,
    password: string,
    domain: string
    ): Promise<string> => {
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
    await page.type('input[name="password"]', password);

    await page.evaluate(() => {
        const loginButton = Array.from(document.querySelectorAll('button, a')).find(
        (el) => el.textContent?.trim() === 'Login'
        );
        if (loginButton) (loginButton as HTMLElement).click();
    });
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // Search for a domain and extract the price
    const searchInput = 'input[placeholder="Domain name or keyword(s)"]';
    await page.waitForSelector(searchInput, { visible: true });
    await page.type(searchInput, domain);
    await page.keyboard.press('Enter');

    const priceSelector = '.m-tableLine__column.-price.-center > p';
    await page.waitForSelector(priceSelector);
    const price = await page.$eval(priceSelector, (el) => el.textContent?.trim());
    return price ?? 'N/A';
};
