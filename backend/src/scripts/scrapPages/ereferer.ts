import { Page } from 'puppeteer';

/**
 * Function to automate the scraping process:
 * - Perform login
 * - Navigate to "Quick Purchase" and "Find a website"
 * - Search for a domain and extract the price
 */
export const scrapeErefererPrice = async (
    page: Page,
    email: string,
    password: string,
    domain: string
    ): Promise<string> => {
    // Perform login
    await page.type('input[name="login_form[_username]"]', email, { delay: 50 });
    await page.type('input[name="login_form[_password]"]', password, { delay: 50 });

    // Click the login button
    await page.click('input.btnlogin[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('Login attempt complete.');

    // Wait for the sidebar to load
    await page.waitForSelector('.nav.metismenu');

    // Click "Quick Purchase" to expand the menu
    const quickPurchaseText = 'Quick purchase';
    await page.evaluate((text) => {
        const elements = Array.from(document.querySelectorAll('a'));
        const target = elements.find((el) => el.textContent?.trim() === text);
        target?.click();
    }, quickPurchaseText);
    await delay(500); // Wait for submenu animation

    // Click "Find a website" under the expanded menu
    const findWebsiteText = 'Find a website';
    await page.evaluate((text) => {
        const elements = Array.from(document.querySelectorAll('a'));
        const target = elements.find((el) => el.textContent?.trim() === text);
        target?.click();
    }, findWebsiteText);
    console.log("Clicked 'Find a website'");
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Define selectors
    const searchInputSelector = 'div.bootstrap-tagsinput input'; // Input field inside the 'bootstrap-tagsinput' div
    const applyFiltersButtonSelector = 'button#filters_filter';

    // Search for the domain
    await page.waitForSelector(searchInputSelector, { visible: true });
    await page.focus(searchInputSelector);
    await page.type(searchInputSelector, domain);
    await page.keyboard.press('Enter');
    console.log('URL input successfully.');

    // Apply filters
    await page.waitForSelector(applyFiltersButtonSelector, { visible: true });
    await page.click(applyFiltersButtonSelector);
    console.log('Apply filters button clicked successfully.');
    await delay(3000); // Adjust timeout for results loading

    // Extract the price
    const buttonSelector = 'button[title="Written by Ereferer"]';
    await page.waitForSelector(buttonSelector, { visible: true });
    const extractedPrice = await page.$eval(buttonSelector, (button) => {
        const text = (button as HTMLElement).innerText;
        const match = text.match(/\d+€/); // Match numbers followed by €
        return match ? match[0] : null; // Return only the match or null
    });

    console.log('Extracted Price:', extractedPrice);
    return extractedPrice ?? 'N/A';
};

// Define the delay function to add a timeout
function delay(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
}

