import type { CollectionConfig } from 'payload';
import puppeteer from 'puppeteer';
import { getCredentials } from '../../services/credentialService';
import { text } from 'stream/consumers';

export const Erefers: CollectionConfig = {
  slug: 'erefers',
  fields: [],
  access: {
    create: () => false,
  },
  endpoints: [
    {
      path: '/erefersCom',
      method: 'get',
      handler: async (req) => {
        let browser;

        try {
          const { email, password } = await getCredentials();

          // Launch Puppeteer browser
          browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: false, // Use 'true' for production
            defaultViewport: null,
          });

          const page = await browser.newPage();

          // Navigate to Paper Club login page
          await page.goto('https://en.ereferer.com/', { waitUntil: 'networkidle2' });

// Input email and password
await page.type('input[name="login_form[_username]"]', email, { delay: 50 }); // Replace with your email
await page.type('input[name="login_form[_password]"]', 'Challenge@624', { delay: 50 }); // Replace with your password

// Click the login button
await page.click('input.btnlogin[type="submit"]');

// Wait for navigation or some result to ensure login success
await page.waitForNavigation({ waitUntil: 'networkidle0' });

// Optionally check for login success
console.log('Login attempt complete.');







  // Wait for the sidebar to load
  await page.waitForSelector('.nav.metismenu');

  // Click "Quick purchase" to expand the menu
  const quickPurchaseText = 'Quick purchase';
  await page.evaluate((text) => {
    const elements = Array.from(document.querySelectorAll('a'));
    const target = elements.find((el) => el.textContent?.trim() === text);
    target?.click();
  }, quickPurchaseText);

  await delay(500); // Wait 500ms for submenu animation

  // Click "Find a website" under the expanded menu
  const findWebsiteText = 'Find a website';
  await page.evaluate((text) => {
    const elements = Array.from(document.querySelectorAll('a'));
    const target = elements.find((el) => el.textContent?.trim() === text);
    target?.click();
  }, findWebsiteText);

  console.log("Clicked 'Find a website'");

  // Optional: Wait for navigation or specific content
  await page.waitForNavigation({ waitUntil: 'networkidle2' });






  // Define selectors
  const searchInputSelector = 'div.bootstrap-tagsinput input'; // Input field inside the 'bootstrap-tagsinput' div
  // Define the button selector
  const applyFiltersButtonSelector = 'button#filters_filter';



  // URL to input
  const urlToInput = 'https://www.bleepingcomputer.com/';
   // Wait for the input field to load
   await page.waitForSelector(searchInputSelector, { visible: true });

   // Type the URL into the input field
   await page.focus(searchInputSelector);
   await page.type(searchInputSelector, urlToInput);

   // Press Enter to confirm input
   await page.keyboard.press('Enter');
   console.log('URL input successfully.');

  // Wait for the "Apply filters" button to load
  await page.waitForSelector(applyFiltersButtonSelector, { visible: true });

  // Click the "Apply filters" button
  await page.click(applyFiltersButtonSelector);
  console.log('Apply filters button clicked successfully.');

  // Wait for results to load after the button is clicked
  await delay(3000); // Adjust this timeout as needed
  console.log('Results loaded successfully.');





    // Define the selector for the button
    const buttonSelector = 'button[title="Written by Ereferer"]';

    // Wait for the button
    await page.waitForSelector(buttonSelector, { visible: true });

    // Extract only 15900€ as text
    const extractedPrice = await page.$eval(buttonSelector, (button) => {
      const text = (button as HTMLElement).innerText;
      const match = text.match(/\d+€/); // Match numbers followed by €
      return match ? match[0] : null; // Return only the match or null
    });

    console.log('Extracted Price:', extractedPrice);


  




          // Return the scraped data
          return new Response(
            JSON.stringify({ success: true, message: 'Scraping successful', data: { extractedPrice } }),
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

// Define the delay function to add a timeout
function delay(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
