const HOST = process.env.HOST || 'localhost'; // Default to 'localhost' if HOST is not set
const PORT = process.env.PORT || '2024'; // Default to port 2024 if PORT is not set

export const BASE_URL = `http://${HOST}:${PORT}/api`; // Construct BASE_URL dynamically
export const API_KEY = process.env.PAYLOAD_SECRET || ''; // Default to empty string if not set

if (!API_KEY) {
  console.error('⚠️  API_KEY (PAYLOAD_SECRET) is missing. Ensure it is set in your .env file.');
}