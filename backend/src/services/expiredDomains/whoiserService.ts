import whoiser from "whoiser";
// import { MongoClient } from "mongodb";
// import pLimit from "p-limit";
import { parseISO, isValid, parse } from 'date-fns';
import { ErrorHandler } from "@/handlers/errorHandler.ts";
// import { BASE_DB_URL, DATABASE_NAME } from "@/config/apiConfig.ts";


// MongoDB connection URI and database details
// const COLLECTION_NAME = "backlinks";

// Limit concurrency for WHOIS requests
// const limit = pLimit(5); // Adjust based on system capacity

// List of possible expiry fields in WHOIS data
const possibleExpiryFields = [
  "Expiry Date",
  "Expiration Date",
  "Registry Expiry Date",
  "Domain Expiration",
  "Expires",
  "Domain expires"
];

/**
 * Remove unsupported time zone abbreviations from a date string.
 * @param dateStr - The date string to sanitize.
 * @returns A sanitized date string without the time zone abbreviation.
 */
const sanitizeDateString = (dateStr: string): string => {
  // Remove trailing time zone abbreviations (e.g., "CLST")
  return dateStr.replace(/\s[A-Z]{2,4}$/, "").trim();
};

/**
 * Attempt to parse custom date formats if parseISO fails.
 * @param dateStr - The date string to parse.
 * @returns A Date object or null if parsing fails.
 */
const parseCustomDate = (dateStr: string): Date | null => {
  const formats = [
    "yyyy-MM-dd HH:mm:ss", // ISO with time
    "yyyy-MM-dd",        // ISO-like format
    "dd-MMM-yyyy",         // Day-Month-Year with short month name (e.g., 08-Sep-2025)
    "MMM dd yyyy",       // E.g., Jan 19 2025
    "MM/dd/yyyy",        // US format
    "dd/MM/yyyy",        // European format
  ];

  for (const format of formats) {
    const parsedDate = parse(dateStr.trim(), format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  return null; // Return null if no format matches
};
const validDomainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isValidDomain = (domain: string): boolean => {
  // Check if the domain matches the regex
  if (!validDomainRegex.test(domain)) {
    return false;
  }

  // Extract the TLD (last part of the domain)
  const tld = domain.split('.').pop();

  // If the TLD is undefined or invalid, return false
  if (!tld) {
    console.error(`Invalid domain: ${domain}`);
    return false;
  }

  return true;
};

// Fetch expiry date from WHOIS data
export const fetchExpiryDate = async (domain: string): Promise<Date | null> => {

  // Validate domain format
  if (!isValidDomain(domain)) {
    console.error(`Invalid domain format: ${domain}`);
    return null;
  }

  try {

    const whoisData = await whoiser(domain, { follow: 1 });

    for (const details of Object.values(whoisData)) {
      if (Array.isArray(details)) {
        continue;
      }

      if (details && typeof details === "object") {
        for (const field of possibleExpiryFields) {
          const dateStr = details[field];
          if (dateStr && typeof dateStr === "string") {

            console.log(`Checking field : ${field}, Value : ${dateStr} ` )

            // Sanitize date string
            const sanitizedDateStr = sanitizeDateString(dateStr);

            const parsedDate = parseISO(sanitizedDateStr);

            if (isValid(parsedDate)) return parsedDate;

            console.warn(`Invalid ISO format for field: ${field}, Value: ${sanitizedDateStr}`);

            // Attempt custom parsing as fallback
            const customParsedDate = parseCustomDate(sanitizedDateStr);
            if (customParsedDate) {
              return customParsedDate;
            }

            console.warn(`Custom parsing failed for field: ${field}, Value: ${sanitizedDateStr}`);
          }
        }
      }
    }

    console.warn(`No valid expiry date found for domain: ${domain}`);
    return null; // No expiry date found

  } catch (error) {

    if (error instanceof Error) {
      // Handle error if it's an instance of Error
      if (error.message.includes("TLD for")) {
        console.error(`Unsupported TLD for domain: ${domain}. Skipping.`);
        return null;
      }
      const { errorDetails } = ErrorHandler.handle(
        error,
        "Error fetching expiry date from WHOIS server"
      );
      throw errorDetails;
    } else {
      // Handle unknown error type
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred while fetching the expiry date.");
    }
  }
};

// // Process a batch of domains
// const processBatch = async (collection: any, batch: any[], currentDate: Date) => {
//   const operations: any[] = [];

//   await Promise.all(
//     batch.map((doc) =>
//       limit(async () => {
//         try {
//           if (!doc.Domain) {
//             console.warn(`Skipping invalid document: ${JSON.stringify(doc)}`);
//             return;
//           }

//           const domain = doc.Domain.trim().toLowerCase();
//           const dbExpiryDate = doc.Expiry_Date ? new Date(doc.Expiry_Date) : null;

//           // If expired or missing expiry_date, process the domain
//           if (!dbExpiryDate || dbExpiryDate < currentDate) {
//             const newExpiryDate = await fetchExpiryDate(domain);

//             if (newExpiryDate) {
//               operations.push({
//                 updateOne: {
//                   filter: { _id: doc._id },
//                   update: {
//                     $set: { Expiry_Date: newExpiryDate, lastChecked: currentDate, retryCount: 0 },
//                     $unset: { processing: "" },
//                   },
//                 },
//               });
//               console.log(
//                 `Updated ${domain}: new expiry_date ${newExpiryDate} (was ${doc.Expiry_Date || "none"})`
//               );
//             } else {
//               const currentRetryCount = doc.retryCount || 0;
//               if (currentRetryCount >= 3) {
//                 console.log(`Max retries reached for ${domain}, skipping permanently.`);
//                 operations.push({
//                   updateOne: {
//                     filter: { _id: doc._id },
//                     update: {
//                       $set: { lastChecked: currentDate, status: "unprocessible" },
//                       $unset: { processing: "" },
//                     },
//                   },
//                 });
//               } else {
//                 operations.push({
//                   updateOne: {
//                     filter: { _id: doc._id },
//                     update: {
//                       $set: { lastChecked: currentDate, retryCount: currentRetryCount + 1 },
//                       $unset: { processing: "" },
//                     },
//                   },
//                 });
//                 console.log(`No expiry date found for ${domain}, retryCount: ${currentRetryCount + 1}`);
//               }
//             }
//           } else {
//             console.log(
//               `Skipped ${domain}: expiry_date ${doc.Expiry_Date} is not expired.`
//             );
//           }
//         } catch (error) {
//           console.error(
//             `Error processing domain ${doc.Domain}:`,
//             error instanceof Error ? error.message : error
//           );
//         }
//       })
//     )
//   );

//   // Perform bulk write for the batch
//   if (operations.length > 0) {
//     await collection.bulkWrite(operations, { ordered: false });
//     console.log(`Processed and updated ${operations.length} domains.`);
//   }
// };

// // Main domain processing function
// export const processDomains = async () => {
//   const client = new MongoClient(BASE_DB_URL, { maxPoolSize: 10 }); // Connection pooling
//   try {
//     await client.connect();
//     const db = client.db(DATABASE_NAME);
//     const collection = db.collection(COLLECTION_NAME);

//     console.log("Starting domain processing...");

//     const batchSize = 200; // Manageable batch size for smooth processing
//     const parallelBatches = 5; // Number of parallel batches
//     const currentDate = new Date();

//     while (true) {
//       // Fetch batches in parallel
//       const batchOffsets = Array.from({ length: parallelBatches }, (_, i) => i * batchSize);
//       const allBatches = await Promise.all(
//         batchOffsets.map((offset) =>
//           collection
//             .find({
//               $and: [
//                 {
//                   $or: [
//                     { Expiry_Date: { $lt: currentDate } }, // Expired domains
//                     { Expiry_Date: null, lastChecked: { $lt: currentDate } }, // Missing expiry_date, not checked today
//                     { Expiry_Date: null, lastChecked: { $exists: false } }, // Missing expiry_date and lastChecked
//                   ],
//                 },
//                 { status: { $ne: "unprocessible" } }, // Exclude unprocessable domains
//               ],
//             })
//             .skip(offset)
//             .limit(batchSize)
//             .project({ _id: 1, Domain: 1, Expiry_Date: 1, lastChecked: 1, retryCount: 1 }) // Fetch only required fields
//             .toArray()
//         )
//       );

//       // Flatten all batches
//       const combinedBatch = allBatches.flat();

//       if (combinedBatch.length === 0) {
//         console.log("No more domains to process.");
//         break; // Exit loop when no documents match the query
//       }

//       console.log(`Processing ${combinedBatch.length} domains in parallel batches...`);

//       // Process each batch
//       await Promise.all(
//         allBatches.map((batch) => processBatch(collection, batch, currentDate))
//       );
//     }

//     console.log("Domain processing completed.");
//   } catch (error) {
//     console.error(
//       "Error during domain processing:",
//       error instanceof Error ? error.message : error
//     );
//   } finally {
//     await client.close();
//   }
// };