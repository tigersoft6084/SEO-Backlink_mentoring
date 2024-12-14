const puppeteer = require('puppeteer');

(async () => {
    // Launch a new browser instance
    const browser = await puppeteer.launch();
    
    // Open a new page
    const page = await browser.newPage();

    // Navigate to the target website
    await page.goto('https://example.com');

    // Extract data using DOM selectors
    const data = await page.evaluate(() => {
        // Modify selectors based on the target website
        return {
            title: document.querySelector('h1')?.innerText || '',
            description: document.querySelector('p')?.innerText || '',
        };
    });

    console.log(data);

    // Close the browser
    await browser.close();
})();
