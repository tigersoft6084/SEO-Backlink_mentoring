import puppeteer from "puppeteer";

export const bypassCloudflareTurnstile = async (): Promise<string | null> => {
    let browser;

    try {
        browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: false, // Keep visible for debugging
        });

        const page = await browser.newPage();
        await page.goto('https://prnews.io/login/', {
            waitUntil: 'domcontentloaded',
            timeout: 910000,
        });

        await page.type('input[name="mail"]', "benjamin.gray.dev@gmail.com", { delay: 50 }); // Replace with your email
        await page.type('input[name="password"]', 'Challenge@624', { delay: 50 }); // Replace with your password

        // Detect all frames
        const frameUrls = page.frames().map(frame => frame.url());
        console.log("Detected Frames:", frameUrls);

        // Find the Turnstile iframe
        let captchaFrame = page.frames().find(frame => frame.url().includes("turnstile"));
        if (!captchaFrame) {
            console.error("Captcha frame not found.");
            return null;
        }

        console.log("Cloudflare Turnstile detected. Solving...");

        // Force JavaScript execution to trigger rendering
        await captchaFrame.evaluate(() => {
            document.dispatchEvent(new Event("mousemove"));
            document.dispatchEvent(new Event("keydown"));
        });

        // Wait for nested iframe inside the Turnstile iframe
        await new Promise(resolve => setTimeout(resolve, 5000)); // Extra wait time
        const nestedFrame = captchaFrame.childFrames()[0]; // Get the first nested iframe
        if (nestedFrame) {
            console.log("Using nested iframe...");
            captchaFrame = nestedFrame;
        }

        // Log the updated HTML content inside the iframe
        const frameHtml = await captchaFrame.evaluate(() => document.body.innerHTML);
        console.log("Updated Turnstile Frame HTML:", frameHtml);

        // Try checking the checkbox inside the iframe
        let checkbox = await captchaFrame.$('input[type="checkbox"]');
        if (!checkbox) checkbox = await captchaFrame.$('.recaptcha-checkbox-border') as puppeteer.ElementHandle<HTMLInputElement>;
        if (!checkbox) checkbox = await captchaFrame.$('div[role="checkbox"]') as puppeteer.ElementHandle<HTMLInputElement>;

        if (checkbox) {
            console.log("Clicking Turnstile checkbox...");
            await checkbox.click();
        } else {
            console.error("Turnstile checkbox not found in iframe. Trying parent page...");
            checkbox = await page.$('iframe + div input[type="checkbox"]'); // Try outside iframe
            if (checkbox) {
                console.log("Clicked Turnstile checkbox outside iframe.");
                await checkbox.click();
            } else {
                console.error("Checkbox not found anywhere.");
                return null;
            }
        }

        // Wait for the response token to be generated
        console.log("Waiting for Turnstile token...");
        const turnstileToken = await captchaFrame.evaluate(() => {
            return (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value || null;
        });

        if (!turnstileToken) {
            console.error("Failed to extract Turnstile token.");
            return null;
        }

        console.log("Turnstile Token:", turnstileToken);
        return turnstileToken;
    } catch (error) {
        console.error("Error bypassing Cloudflare Turnstile:", error);
        return null;
    } finally {
        if (browser) await browser.close();
    }
};
