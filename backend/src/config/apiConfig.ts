export const BASE_URL = `${process.env.BASE_URL}/api`; // Construct BASE_URL dynamically
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:1212';
export const API_KEY = process.env.PAYLOAD_SECRET || ''; // Default to empty string if not set
export const BASE_DB = process.env.DATABASE_URI || "mongodb://127.0.0.1/BackLinkingDB";
export const BASE_DB_URL = process.env.BASE_DATABASE_URL || "mongodb://127.0.0.1";
export const DATABASE_NAME = process.env.DATABASE_NAME || "BackLinkingDB"

if (!API_KEY) {
  console.error('⚠️  API_KEY (PAYLOAD_SECRET) is missing. Ensure it is set in your .env file.');
}