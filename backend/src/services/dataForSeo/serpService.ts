// services/serpService.ts

import { BULK_KEYWORD_SEARCH_URL } from '@/globals/globalURLs.ts';
import axios from 'axios';

export const fetchSerpData = async (keyword: string, locationCode: number, languageCode: string) => {
  const token = process.env.DATAFORSEO_API_TOKEN; // Access token from .env file

  if (!token) {
    throw new Error('DataForSEO API token is missing');
  }

  const response = await axios.post(
    BULK_KEYWORD_SEARCH_URL,
    {
      keyword : keyword,
      location_code: locationCode,
      language_code: languageCode,
      device: 'desktop',
      os: 'windows',
      depth : 100,
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