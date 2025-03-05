import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts";
import puppeteer from "puppeteer";
import delay from "@/utils/webScrapingUtils.ts";
import { MARKETPLACE_NAME_123MEDIA } from "@/globals/strings.ts";

export const getDataFrom123media = async() => {

    console.log('Calling getDataFrom123media...')

    let browser;

    try{

        let email;
        let password;

        const credentials = await getCredentialsForMarketplaces();

        for (const credential of credentials) {
            const has123mediaTarget = credential.websiteTarget.some((target: { value: string }) => target.value === MARKETPLACE_NAME_123MEDIA);
            if (has123mediaTarget) {
                console.log(`Found 123media credentials for ${credential.email}`);
                email = credential.email;
                password = credential.password
            }
        }

        if (!email || !password) {
            throw new Error("No credentials found for 123media");
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
        await page.goto('https://123.media/login', { waitUntil : 'networkidle2', timeout: 60000});

        // Type the email
        await page.type('#inputEmail', email, { delay: 100 });

        // Type the password
        await page.type('#inputPassword', password, { delay: 100 });

        // Click the login button
        await page.click('.btn.btn-form.auth-form-btn');

        await page.waitForNavigation( {waitUntil : 'networkidle2', timeout: 60000})


// Ensure the Recherche avancée button is present using text-based selection
const advancedSearchClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("a"));
    const searchButton = buttons.find(button => button.textContent?.trim() === "Recherche avancée");
    
    if (searchButton) {
        (searchButton as HTMLElement).click();
        return true;
    }
    return false;
});
if (advancedSearchClicked) {
    console.log('Clicked Recherche avancée');
} else {
    console.log('Recherche avancée button not found');
    throw new Error("Recherche avancée button not found");
}

// Wait for the dropdown content to open
await page.waitForSelector('.dropdown-content.open', { visible: true, timeout: 5000 });
console.log("Dropdown menu opened successfully");

// Click the "Filtrer" button
await page.waitForSelector('.btn-form.btn-small', { visible: true, timeout: 5000 });
await page.click('.btn-form.btn-small');



        await delay(20000)



    }catch(error){
        const { errorDetails, status } = ErrorHandler.handle(error, "Error occured from getting backlinks from 123media");
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

