import whoiser from "whoiser";
import { MongoClient, ObjectId } from "mongodb";
import pLimit from "p-limit";

// MongoDB connection URI and database details
const MONGO_URI = "mongodb://localhost:27017";
const DATABASE_NAME = "BackLinkingDB";
const COLLECTION_NAME = "backlinks";

// Limit concurrency for WHOIS requests
const limit = pLimit(4); // Adjust based on system capacity

// List of possible expiry fields in WHOIS data
const possibleExpiryFields = [
  "Expiry Date",
  "Expiration Date",
  "Registry Expiry Date",
  "Domain Expiration",
  "Expires",
];

// Fetch expiry date from WHOIS data
const fetchExpiryDate = async (domain: string): Promise<string | null> => {
  try {
    const whoisData = await whoiser(domain, { follow: 1 });

    for (const details of Object.values(whoisData)) {
      if (details && !Array.isArray(details) && typeof details === "object") {
        for (const field of possibleExpiryFields) {
          if (field in details) {
            return details[field] as string;
          }
        }
      }
    }
    return null; // No expiry date found
  } catch (error) {
    console.error(
      `Error fetching WHOIS data for ${domain}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
};

// Process domains in larger batches with higher concurrency
export const processDomains = async () => {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log("Starting domain processing...");

    const batchSize = 500; // Larger batch size for better performance
    while (true) {
      const batch = await collection
        .find({ processed: { $ne: true } }) // Only process unprocessed domains
        .limit(batchSize)
        .toArray();

      if (batch.length === 0) {
        console.log("No more domains to process.");
        break; // Exit loop when no domains are left
      }

      console.log(`Processing batch of ${batch.length} domains...`);

      const promises = batch.map((doc) =>
        limit(async () => {
          try {
            if (!doc.domain) {
              console.warn(`Skipping invalid document: ${JSON.stringify(doc)}`);
              return;
            }

            const domain = doc.domain.trim().toLowerCase();
            const expiryDate = await fetchExpiryDate(domain);

            if (expiryDate) {
              await collection.updateOne(
                { _id: new ObjectId(doc._id) },
                {
                  $set: {
                    expiry_date: expiryDate,
                    processed: true, // Mark as processed
                  },
                }
              );
              console.log(`Updated ${domain} with expiry_date: ${expiryDate}`);
            } else {
              // Mark as processed even if no expiry date is found
              await collection.updateOne(
                { _id: new ObjectId(doc._id) },
                { $set: { processed: true } }
              );
              console.log(`No expiry date found for ${domain}`);
            }
          } catch (error) {
            console.error(
              `Error processing domain ${doc.domain}:`,
              error instanceof Error ? error.message : error
            );
          }
        })
      );

      // Wait for all promises in the batch to complete
      await Promise.all(promises);
    }

    console.log("Domain processing completed.");
  } catch (error) {
    console.error(
      "Error during domain processing:",
      error instanceof Error ? error.message : error
    );
  } finally {
    await client.close();
  }
};
