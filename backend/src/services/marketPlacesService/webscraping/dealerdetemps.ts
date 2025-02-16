import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts";
import { MARKETPLACE_NAME_DEALERDETEMPS } from "@/globals/strings.ts";
import puppeteer from "puppeteer";
import delay from "@/utils/webScrapingUtils.ts";

export const getDataFromDealerdetemps = async() => {

    console.log('Calling getDataFromDealerdetemps...')

    let browser;

    try{

        let email;
        let password;

        const credentials = await getCredentialsForMarketplaces();

        for (const credential of credentials) {
            const hasDealerdetempsTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_DEALERDETEMPS);
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
        await page.goto('https://www.dealerdetemps.com/', { waitUntil : 'networkidle2', timeout: 60000});

        // Click login button
        await page.waitForSelector('#btn_connect .nav-link', { visible: true });
        await page.click('#btn_connect .nav-link');

        // Wait for the modal to appear
        await page.waitForSelector('#InputIdentifiant', { visible: true });

        // Focus on the input field
        await page.waitForSelector('#InputIdentifiant', { visible: true });

        // Double-click the input field to focus it properly
        await page.click('#InputIdentifiant', { clickCount: 2 });

        // Wait a bit for the field to react
        await delay(500);

        // Type the email normally
        await page.type('#InputIdentifiant', email, { delay: 100 });
        await page.type('#InputPassword', password, { delay: 100 });

        // Click login button
        await page.waitForSelector('#connect');
        await page.click('#connect');

        console.log("Login submitted!");

        // Wait until the page contains the element #DisplayList_all_sites
        await page.waitForSelector('#DisplayList_all_sites', { visible: true, timeout: 15000 });

        // Extract the entire page HTML
        const pageHTML = await page.evaluate(() => document.documentElement.outerHTML);

        console.log("Scraped HTML:", pageHTML);

        // Save or process the HTML as needed
        return pageHTML; // Return if needed for API response or further processing



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

