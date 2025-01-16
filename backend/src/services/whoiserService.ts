import whoiser from "whoiser";
import { MongoClient } from "mongodb";
import pLimit from "p-limit";

// MongoDB connection URI and database details
const MONGO_URI = "mongodb://localhost:27017";
const DATABASE_NAME = "BackLinkingDB";
const COLLECTION_NAME = "backlinks";

// Limit concurrency for WHOIS requests
const limit = pLimit(5); // Adjust based on system capacity

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
    const whoisData = await whoiser(domain, { follow: 1 }); // Reduced follow depth for efficiency

    for (const [_, details] of Object.entries(whoisData)) {
      if (details && typeof details === "object" && !Array.isArray(details)) {
        for (const field of possibleExpiryFields) {
          if (field in details && typeof details[field] === "string") {
            return details[field].split("T")[0]; // Return formatted date
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

// Process a batch of domains
const processBatch = async (collection: any, batch: any[], currentDateString: string) => {
  const operations: any[] = [];

  await Promise.all(
    batch.map((doc) =>
      limit(async () => {
        try {
          if (!doc.domain) {
            console.warn(`Skipping invalid document: ${JSON.stringify(doc)}`);
            return;
          }

          const domain = doc.domain.trim().toLowerCase();
          const dbExpiryDate = doc.expiry_date ? new Date(doc.expiry_date) : null;

          // If expired or missing expiry_date, process the domain
          if (!dbExpiryDate || dbExpiryDate < new Date(currentDateString)) {
            const newExpiryDate = await fetchExpiryDate(domain);

            if (newExpiryDate) {
              operations.push({
                updateOne: {
                  filter: { _id: doc._id },
                  update: {
                    $set: { expiry_date: newExpiryDate, lastChecked: currentDateString, retryCount: 0 },
                    $unset: { processing: "" },
                  },
                },
              });
              console.log(
                `Updated ${domain}: new expiry_date ${newExpiryDate} (was ${doc.expiry_date || "none"})`
              );
            } else {
              const currentRetryCount = doc.retryCount || 0;
              if (currentRetryCount >= 3) {
                console.log(`Max retries reached for ${domain}, skipping permanently.`);
                operations.push({
                  updateOne: {
                    filter: { _id: doc._id },
                    update: {
                      $set: { lastChecked: currentDateString, status: "unprocessible" },
                      $unset: { processing: "" },
                    },
                  },
                });
              } else {
                operations.push({
                  updateOne: {
                    filter: { _id: doc._id },
                    update: {
                      $set: { lastChecked: currentDateString, retryCount: currentRetryCount + 1 },
                      $unset: { processing: "" },
                    },
                  },
                });
                console.log(`No expiry date found for ${domain}, retryCount: ${currentRetryCount + 1}`);
              }
            }
          } else {
            console.log(
              `Skipped ${domain}: expiry_date ${doc.expiry_date} is not expired.`
            );
          }
        } catch (error) {
          console.error(
            `Error processing domain ${doc.domain}:`,
            error instanceof Error ? error.message : error
          );
        }
      })
    )
  );

  // Perform bulk write for the batch
  if (operations.length > 0) {
    await collection.bulkWrite(operations, { ordered: false });
    console.log(`Processed and updated ${operations.length} domains.`);
  }
};

// Main domain processing function
export const processDomains = async () => {
  const client = new MongoClient(MONGO_URI, { maxPoolSize: 10 }); // Connection pooling
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log("Starting domain processing...");

    const batchSize = 200; // Manageable batch size for smooth processing
    const parallelBatches = 5; // Number of parallel batches
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0]; // Precomputed date string

    while (true) {
      // Fetch batches in parallel
      const batchOffsets = Array.from({ length: parallelBatches }, (_, i) => i * batchSize);
      const allBatches = await Promise.all(
        batchOffsets.map((offset) =>
          collection
            .find({
              $and: [
                {
                  $or: [
                    { expiry_date: { $lt: currentDateString } }, // Expired domains
                    { expiry_date: null, lastChecked: { $lt: currentDateString } }, // Missing expiry_date, not checked today
                    { expiry_date: null, lastChecked: { $exists: false } }, // Missing expiry_date and lastChecked
                  ],
                },
                { status: { $ne: "unprocessible" } }, // Exclude unprocessable domains
              ],
            })
            .skip(offset)
            .limit(batchSize)
            .project({ _id: 1, domain: 1, expiry_date: 1, lastChecked: 1, retryCount: 1 }) // Fetch only required fields
            .toArray()
        )
      );

      // Flatten all batches
      const combinedBatch = allBatches.flat();

      if (combinedBatch.length === 0) {
        console.log("No more domains to process.");
        break; // Exit loop when no documents match the query
      }

      console.log(`Processing ${combinedBatch.length} domains in parallel batches...`);

      // Process each batch
      await Promise.all(
        allBatches.map((batch) => processBatch(collection, batch, currentDateString))
      );
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
