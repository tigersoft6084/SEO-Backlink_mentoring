// services/serpService.ts
import { DATA_FOR_SEO_API_URL } from '@/global/marketplaceUrls';
import axios from 'axios';

export const fetchSerpData = async (keyword: string, locationCode: number, languageCode: string, depth: number) => {
  const token = process.env.DATAFORSEO_API_TOKEN; // Access token from .env file

  if (!token) {
    throw new Error('API token is missing');
  }

  console.log(keyword, locationCode, languageCode, depth)

  const response = await axios.post(
    DATA_FOR_SEO_API_URL,
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

