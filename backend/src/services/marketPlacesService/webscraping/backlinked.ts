import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts";
import { MARKETPLACE_NAME_BACKLINKED } from "@/globals/strings.ts";
import puppeteer from "puppeteer";
import delay from "@/utils/webScrapingUtils.ts";

export const getDataFromBacklinked= async() => {

    console.log('Calling getDataFromBacklinked....')

    let browser;

    try{

        let email;
        let password;

        const credentials = await getCredentialsForMarketplaces();

        for (const credential of credentials) {
            const hasDealerdetempsTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_BACKLINKED);
            if (hasDealerdetempsTarget) {
                console.log(`Found Dealerdetemps credentials for ${credential.email}`);
                email = credential.email;
                password = credential.password
            }
        }

        if (!email || !password) {
            throw new Error("No credentials found for Dealerdetemps");
        }

        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1600,900' // Set width to 1600px and height to 900px
            ],
            headless: false, // Keep it visible for debugging
            defaultViewport: {
                width: 1600,  // Wider screen
                height: 900
            }
        });

        const page = await browser.newPage();

        // Navigate to login Page
        await page.goto('https://app.backlinked.com/login', { waitUntil : 'networkidle2', timeout: 60000});

        // await page.waitForSelector('a:has-text("Login")');
        // await page.click('a:has-text("Login")');

        // await page.waitForNavigation();

        // Wait for the email input field and type the email
        await page.waitForSelector('input[name="email"]');
        await page.type('input[name="email"]', email, { delay: 100 });

        // Wait for the password input field and type the password
        await page.waitForSelector('input[name="password"]');
        await page.type('input[name="password"]', password, { delay: 100 });

        // Click the "Sign in" button
        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');

        // Optional: Wait for navigation to dashboard or some element indicating login success
        await page.waitForNavigation();

        // Wait for the Backlinks menu item and click it
        await page.waitForSelector('a[href="/marketplace/contentlinks"]');
        await page.click('a[href="/marketplace/contentlinks"]');

        // Optional: Wait for the next page to load after clicking
        await page.waitForNavigation();
        await page.waitForSelector('body', { visible: true });

        const htmlContent = await page.evaluate(() => {
            return document.body.innerHTML;
        });

        return htmlContent;

    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from Dealerdetemps");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}