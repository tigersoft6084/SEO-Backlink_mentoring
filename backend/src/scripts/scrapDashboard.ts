import { scraperService } from '../services/scraperService';

const main = async () => {
  try {
    const publishers = await scraperService();
    console.log('Scraped Publishers:', publishers);
  } catch (error) {
    console.error('Failed to scrape dashboard:', error);
  }
};

main();
