// services/serpService.ts
import axios from 'axios';

const API_URL = 'https://data.dataforseo.com/api/explorer/serp/google/organic/live/advanced';

export const fetchSerpData = async (keyword: string, locationCode: number, languageCode: string, depth: number) => {
  const token = process.env.DATAFORSEO_API_TOKEN; // Access token from .env file

  if (!token) {
    throw new Error('API token is missing');
  }

  console.log(keyword, locationCode, languageCode, depth)

  const response = await axios.post(
    API_URL,
    {
      keyword : keyword,
      location_code: locationCode,
      language_code: languageCode,
      device: 'desktop',
      os: 'windows',
      depth : depth,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    },
  );

  return response.data;
};

