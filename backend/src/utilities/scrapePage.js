const puppeteer = require('puppeteer');

async function scrapePage(url) {
  // Launch Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Perform scraping logic (example: get all links)
    const data = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.map(link => ({
        text: link.textContent.trim(),
        href: link.href,
      }));
    });

    return data;
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    // Close the browser
    await browser.close();
  }
}

module.exports = scrapePage;
