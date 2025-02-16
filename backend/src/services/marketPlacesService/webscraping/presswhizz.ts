import { MARKETPLACE_NAME_PRESSWHIZZ } from "@/globals/strings.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import delay from "@/utils/webScrapingUtils.ts";
import puppeteer from 'puppeteer-extra';
import puppeteerCore from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use stealth plugin to bypass bot detection
(puppeteer as any).use(StealthPlugin());

export const getDataFromPresswhizz = async () => {

    console.log('Calling getDataFromPresswhizz with Puppeteer...');

    let browser;

    try {
        let email;
        let password;

        // Fetch marketplace credentials
        const credentials = await getCredentialsForMarketplaces();

        for (const credential of credentials) {
            const hasPresswhizzTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_PRESSWHIZZ);
            if (hasPresswhizzTarget) {
                console.log(`Found Presswhizz credentials for ${credential.email}`);
                email = credential.email;
                password = credential.password;
            }
        }

        if (!email || !password) {
            throw new Error("No credentials found for Presswhizz");
        }

        browser = await puppeteerCore.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1600,900' // Set width to 1600px and height to 900px
            ],
            headless: false, // Set to true for production
            defaultViewport: {
                width: 1600,
                height: 900
            }
        });

        const page = await browser.newPage();

        // Set a real User-Agent to prevent Cloudflare detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Navigate to the landing page
        await page.goto('https://presswhizz.com', { waitUntil: 'networkidle2', timeout: 60000 });

        // Ensure the login button is visible before clicking
        await page.waitForSelector('#menu-1-bbbe2a4 .elementor-item[href="https://app.presswhizz.com/"]', { visible: true });

        // Click login menu link
        await page.click('#menu-1-bbbe2a4 .elementor-item[href="https://app.presswhizz.com/"]');

        // Wait for navigation after clicking login
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log("Successfully navigated to the login page!");

        // Optional: Debugging delay
        await delay(5000);

    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "Error occurred while getting backlinks from Presswhizz");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
