import { scraperService } from '../services/scraperService';
import { sendDataToPayload } from '../services/payloadService';

const main = async (): Promise<void> => {
  try {
    const scrapedData = await scraperService();
    if (scrapedData.length > 0) {
      await sendDataToPayload(scrapedData);
    } else {
      console.log('No data scraped from the dashboard.');
    }
  } catch (error) {
    console.error('An error occurred in the main process:', error);
  }
};

main();
