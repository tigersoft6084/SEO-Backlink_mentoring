import whoiser from "whoiser";
import { MongoClient } from "mongodb";
import pLimit from "p-limit";
import { parseISO, isValid } from 'date-fns';
import { ErrorHandler } from "@/handlers/errorHandler.ts";
import { BASE_DB_URL, DATABASE_NAME } from "@/config/apiConfig.ts";

// MongoDB connection URI and database details
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
const fetchExpiryDate = async (domain: string): Promise<Date | null> => {
  try {
    const whoisData = await whoiser(domain, { follow: 1 });

    for (const details of Object.values(whoisData)) {
      if (Array.isArray(details)) {
        continue;
      }

      if (details && typeof details === "object") {
        for (const field of possibleExpiryFields) {
          if (details[field] && typeof details[field] === "string") {
            const parsedDate = parseISO(details[field]);
            if (isValid(parsedDate)) return parsedDate;
            throw new Error(`Invalid date format for field: ${field}`);
          }
        }
      }
    }
    return null; // No expiry date found
  } catch (error) {
    const { errorDetails } = ErrorHandler.handle(error, "Error fetching expiry date from WHOIS server");
    throw errorDetails;
  }
};

// Process a batch of domains
const processBatch = async (collection: any, batch: any[], currentDate: Date) => {
  const operations: any[] = [];

  await Promise.all(
    batch.map((doc) =>
      limit(async () => {
        try {
          if (!doc.Domain) {
            console.warn(`Skipping invalid document: ${JSON.stringify(doc)}`);
            return;
          }

          const domain = doc.Domain.trim().toLowerCase();
          const dbExpiryDate = doc.Expiry_Date ? new Date(doc.Expiry_Date) : null;

          // If expired or missing expiry_date, process the domain
          if (!dbExpiryDate || dbExpiryDate < currentDate) {
            const newExpiryDate = await fetchExpiryDate(domain);

            if (newExpiryDate) {
              operations.push({
                updateOne: {
                  filter: { _id: doc._id },
                  update: {
                    $set: { Expiry_Date: newExpiryDate, lastChecked: currentDate, retryCount: 0 },
                    $unset: { processing: "" },
                  },
                },
              });
              console.log(
                `Updated ${domain}: new expiry_date ${newExpiryDate} (was ${doc.Expiry_Date || "none"})`
              );
            } else {
              const currentRetryCount = doc.retryCount || 0;
              if (currentRetryCount >= 3) {
                console.log(`Max retries reached for ${domain}, skipping permanently.`);
                operations.push({
                  updateOne: {
                    filter: { _id: doc._id },
                    update: {
                      $set: { lastChecked: currentDate, status: "unprocessible" },
                      $unset: { processing: "" },
                    },
                  },
                });
              } else {
                operations.push({
                  updateOne: {
                    filter: { _id: doc._id },
                    update: {
                      $set: { lastChecked: currentDate, retryCount: currentRetryCount + 1 },
                      $unset: { processing: "" },
                    },
                  },
                });
                console.log(`No expiry date found for ${domain}, retryCount: ${currentRetryCount + 1}`);
              }
            }
          } else {
            console.log(
              `Skipped ${domain}: expiry_date ${doc.Expiry_Date} is not expired.`
            );
          }
        } catch (error) {
          console.error(
            `Error processing domain ${doc.Domain}:`,
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
  const client = new MongoClient(BASE_DB_URL, { maxPoolSize: 10 }); // Connection pooling
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log("Starting domain processing...");

    const batchSize = 200; // Manageable batch size for smooth processing
    const parallelBatches = 5; // Number of parallel batches
    const currentDate = new Date();

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
                    { Expiry_Date: { $lt: currentDate } }, // Expired domains
                    { Expiry_Date: null, lastChecked: { $lt: currentDate } }, // Missing expiry_date, not checked today
                    { Expiry_Date: null, lastChecked: { $exists: false } }, // Missing expiry_date and lastChecked
                  ],
                },
                { status: { $ne: "unprocessible" } }, // Exclude unprocessable domains
              ],
            })
            .skip(offset)
            .limit(batchSize)
            .project({ _id: 1, Domain: 1, Expiry_Date: 1, lastChecked: 1, retryCount: 1 }) // Fetch only required fields
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
        allBatches.map((batch) => processBatch(collection, batch, currentDate))
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