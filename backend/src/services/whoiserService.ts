import payload from 'payload';
import whoiser from 'whoiser';
import pLimit from 'p-limit';
import { sleep } from '../utils/sleep';

const cache: Map<string, any> = new Map();
const rateLimitPerSecond = 50;  // Rate limit set to 50 requests per second
const delayBetweenRequests = 1000 / rateLimitPerSecond;  // Adjust delay between requests
const limit = pLimit(rateLimitPerSecond);  // Limit concurrent requests per second

// Clean domain (strip scheme and path)
const cleanDomain = (domain: string): string => {
  const cleanedDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
  return cleanedDomain && cleanedDomain !== 'http' && cleanedDomain !== 'https' ? cleanedDomain : '';
};

// Function to fetch domains from the database
const getDomainsFromDatabase = async (): Promise<string[]> => {
  try {
    let domains: string[] = [];
    let page = 1;
    const pageSize = 1000;

    while (true) {
      const response = await fetch(`http://localhost:2024/api/backlinks?page=${page}&limit=${pageSize}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result.docs.length === 0) break;

      domains = domains.concat(result.docs.map((doc: { domain: string }) => {
        let domain = doc.domain;
        if (domain.startsWith('www.')) domain = domain.substring(4);
        if (domain.endsWith('/')) domain = domain.slice(0, -1);
        return domain;
      }));
      page++;
    }

    return domains;
  } catch (error) {
    console.error('Error fetching domains:', error);
    throw error;
  }
};

// Validate domain format
const isValidDomain = (domain: string): boolean => /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,11}?$/.test(domain);

// Get WHOIS information for domain
const getDomainInformation = async (domain: string): Promise<any> => {
  try {
    const cleanedDomain = cleanDomain(domain);
    if (!cleanedDomain || !isValidDomain(cleanedDomain)) {
      console.error(`Skipping invalid domain: ${domain}`);
      return null;
    }
    return await whoiser(cleanedDomain);
  } catch (error) {
    console.error(`Error fetching WHOIS data for ${domain}:`, error instanceof Error ? error.message : error);
    return null;
  }
};

// Handle rate limit with exponential backoff
const rateLimitHandler = async (domain: string, retries = 3): Promise<any> => {
  try {
    return await getCachedDomainInformation(domain);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Rate limit')) {
      if (retries > 0) {
        const delay = Math.pow(2, 3 - retries) * 1000; // Exponential backoff
        console.log(`Rate limit exceeded for ${domain}. Retrying after ${delay / 1000} seconds...`);
        await sleep(delay);
        return await rateLimitHandler(domain, retries - 1);
      } else {
        console.error(`Rate limit exceeded for ${domain} after retries. Skipping.`);
        return null;
      }
    }
    throw error;
  }
};

// Modify the getCachedDomainInformation to prevent infinite recursion
async function getCachedDomainInformation(domain: string, retryCount = 0): Promise<any> {
  const cleanedDomain = domain.toLowerCase().trim();
  
  // Avoid infinite recursion: set a max retry limit
  if (retryCount > 3) {
    console.error(`Max retries reached for domain: ${cleanedDomain}`);
    return null;
  }

  // Check if cached data exists
  const cachedData = cache.get(cleanedDomain);
  if (cachedData) {
    console.log(`Cache hit for ${cleanedDomain}`);
    return cachedData;
  } else {
    // Cache miss, rate limit the WHOIS lookup
    console.log(`Cache miss for ${cleanedDomain}`);
    try {
      const result = await getDomainInformation(cleanedDomain);
      if (result) {
        cache.set(cleanedDomain, result);
      }
      return result;
    } catch (error) {
      console.error(`Error fetching data for ${cleanedDomain}: ${error}`);
      // Retry with exponential backoff
      const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`Retrying in ${backoffTime / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime)); // Wait before retrying
      return getCachedDomainInformation(domain, retryCount + 1);  // Retry the lookup
    }
  }
}

// Process a batch of domains concurrently
const processBatch = async (domains: string[], batchIndex: number): Promise<any[]> => {
  const results: any[] = [];

  // Process all domains in parallel, respecting rate limit
  const domainPromises = domains.map(async (domain, index) => {
    const cleanedDomain = cleanDomain(domain); // Clean domain before using

    await sleep(delayBetweenRequests);  // Ensure delay between requests
    const result = await limit(() => getCachedDomainInformation(cleanedDomain)); // Use cleaned domain for WHOIS lookup
    if (result) {
      results.push(result);
    }

    console.log(`Processed ${index + 1 + (batchIndex * domains.length)} of ${domains.length * Math.ceil(domains.length / 50)} domains...`);
  });

  // Wait for all domain promises to resolve
  await Promise.all(domainPromises);

  return results;
};

// Bulk update expiry date in the database (use cleaned domain)
const updateExpiryDatesInBulk = async (domainExpiryPairs: { domain: string; expiryDate: string }[]) => {
  try {
    for (const { domain, expiryDate } of domainExpiryPairs) {
      // Update each domain one by one
      await payload.update({
        collection: 'backlinks',
        where: { domain: { equals: domain } },  // Use cleaned domain for database query
        data: { 'expiry date': expiryDate },
      });
      console.log(`Updated expiry date for domain: ${domain}`);
    }
  } catch (error) {
    console.error('Error in bulk update:', error);
  }
};

// Process all domains in batches
const processAllDomains = async (domains: string[]): Promise<any[]> => {
  const allResults: any[] = [];
  const batchSize = 50;  // Process 50 domains at a time

  const batchPromises: Promise<any[]>[] = [];

  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(domains.length / batchSize)}`);

    // Create a promise for processing each batch
    const batchPromise = processBatch(batch, Math.floor(i / batchSize) + 1);
    batchPromises.push(batchPromise);
  }

  const results = await Promise.all(batchPromises);
  results.forEach(result => allResults.push(...result));

  // After all domains are processed, bulk update expiry dates in the database
  const domainExpiryPairs = allResults
    .filter(result => result && result.expiry_date)  // Filter out domains without expiry dates
    .map(result => ({
      domain: cleanDomain(result.domain),  // Clean domain before updating
      expiryDate: result.expiry_date,
    }));

  if (domainExpiryPairs.length > 0) {
    await updateExpiryDatesInBulk(domainExpiryPairs); // Use cleaned domains in the bulk update
  }

  return allResults;
};

// Start WHOIS processing
export const startWhoisProcessing = async () => {
  try {
    const domains = await getDomainsFromDatabase();
    console.log(`Fetched ${domains.length} domains from the database.`);
    if (domains.length === 0) {
      console.log('No domains to process.');
      return;
    }

    const results = await processAllDomains(domains);
    console.log('All domains processed:', results);
  } catch (error) {
    console.error('Error processing all domains:', error);
  }
};
