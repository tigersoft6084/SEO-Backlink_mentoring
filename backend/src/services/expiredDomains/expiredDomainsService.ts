import { Db, MongoClient } from 'mongodb'; // Ensure you have the mongodb package installed
import { BASE_DB } from '@/config/apiConfig.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';
import { ExpiredDomainData } from '@/types/backlink.js';

// MongoDB client initialization (using a singleton pattern for reuse)
const client = new MongoClient(BASE_DB);

// MongoDB database connection (reuse the same instance across requests)
let db: Db;

const connectToDB = async () => {
    if (!db) {
        await client.connect();
        db = client.db(); // Set the db instance only once
    }
    return db;
};

/**
 * Fetch expired domains with pagination and filter by expiry date
 * @param req - The PayloadRequest object containing query parameters (limit, page)
 * @returns - A Promise resolving to an array of expired domains or an error response
 */
export const fetchExpiredDomainsService = async (req: { query: { limit?: string; page?: string } }): Promise<ExpiredDomainData[] | Response> => {
    // Extract limit and page for pagination
    const limit = Math.max(parseInt(req.query.limit || '25', 10), 1); // Default to 25 if not provided
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);   // Default to 1 if not provided

    // Calculate skip based on page number
    const skip = (page - 1) * limit;

    // Get the current time to filter expired domains
    const currentTime = new Date();

    try {
        // Connect to MongoDB and get the collection
        const db = await connectToDB();
        const collection = db.collection('backlinks'); // Replace with your actual collection name

        const query = {
            Expiry_Date: { $lte: currentTime.toISOString() } // Expiry date is less than or equal to current time
        };

        // Fetch the domains with limit and skip (pagination)
        const result = await collection.find(query).skip(skip).limit(limit).toArray();

        // Return an empty array if no results are found
        if (result.length === 0) return [];

        // Return the processed list of expired domains
        return result.map((item) => ({
            Domain: item.Domain,
            TF: item.TF ?? 0,
            CF: item.CF ?? 0,
            RD: item.RD ?? 0,
            TTF: item.TTF ?? null,
            Ref_Ips: item.Ref_Ips ?? '0',
            Ref_Edu: item.Ref_Edu ?? '0',
            Ref_Gov: item.Ref_Gov ?? '0',
            Language: item.Language ?? null,
        }));

    } catch (error) {
        // Use the error handler to generate the response
        const { errorDetails, status } = ErrorHandler.handle(error, "Error fetching expired domains");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
