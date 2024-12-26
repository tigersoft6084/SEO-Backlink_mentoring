import whoiser from 'whoiser';
import pLimit from 'p-limit';

// Caching mechanism (in-memory cache)
const cache: Map<string, any> = new Map();

// Rate Limit settings
const rateLimitPerSecond = 50; // Max 50 requests per second
const delayBetweenRequests = 1000 / rateLimitPerSecond; // Calculate delay between requests (in ms)

// Limit concurrent requests (you can adjust this number based on your needs)
const limit = pLimit(50); // Allowing up to 50 concurrent requests at a time, limited by API rate

// Sleep function to introduce delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDomainFromDatabase = async () : Promise<any> => {
    try{

    }catch(error){
        console.error(`Error fetching domains from database : `, error);
        throw error;
    }
}

// Function to fetch WHOIS data (replace with actual WHOIS API integration)
const getDomainInformation = async (domain: string): Promise<any> => {
    try {
        const result = await whoiser(domain); // Replace with actual WHOIS API call
        return result;
    } catch (error) {
        console.error(`Error fetching WHOIS data for ${domain}:`, error);
        throw error;
    }
};

// Function to handle caching
const getCachedDomainInformation = async (domain: string): Promise<any> => {
    if (cache.has(domain)) {
        console.log(`Cache hit for ${domain}`);
        return cache.get(domain);
    } else {
        console.log(`Cache miss for ${domain}`);
        
        const result = await getDomainInformation(domain);
        cache.set(domain, result); // Store in cache
        return result;
    }
};

// Function to process a batch of domains with rate limiting per request
const processBatch = async (domains: string[], batchIndex: number): Promise<any[]> => {
    const results = [];
    
    for (let i = 0; i < domains.length; i++) {
        const domain = domains[i];
        // Wait before sending the next request to respect the rate limit
        await sleep(delayBetweenRequests);

        // Process each domain, with concurrency control using p-limit
        const result = await limit(() => getCachedDomainInformation(domain));
        results.push(result);

        // Log progress for each domain processed
        const progress = (batchIndex * domains.length) + i + 1;
        console.log(`Processed ${progress} of ${domains.length * Math.ceil(domains.length / batchIndex)} domains...`);
    }
    
    return results;
};

// Main function to process all domains
export const processAllDomains = async (domains: string[]): Promise<any[]> => {
    const allResults: any[] = [];
    const batchSize = 50; // Number of domains per batch (you can adjust as needed)
    
    // Process domains in batches
    const delayBetweenBatches = 500; // Optional: Delay between batches to avoid API overload

    for (let i = 0; i < domains.length; i += batchSize) {
        const batch = domains.slice(i, i + batchSize);
        console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(domains.length / batchSize)}`);

        const batchResults = await processBatch(batch, i / batchSize + 1);
        allResults.push(...batchResults);

        // Optional: Delay between batches
        await sleep(delayBetweenBatches);
    }

    return allResults;
};

// Sample usage with an array of domains
// const domains = ['example1.com', 'example2.com', 'example3.com', /* ... 100,000 domains */];
// processAllDomains(domains)
//     .then(results => {
//         console.log('All domains processed:', results);
//     })
//     .catch(error => {
//         console.error('Error processing all domains:', error);
//     });
