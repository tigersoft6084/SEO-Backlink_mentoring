// services/serpService.ts
import { BULK_KEYWORD_SEARCH_URL } from '@/global/marketplaceUrls';
import axios from 'axios';

export const getResultsFromBulkKeywordSearch = async (keywords: string[], locationCode: number, languageCode: string) => {
  const token = process.env.DATAFORSEO_API_TOKEN; // Access token from .env file

  if (!token) {
    throw new Error('API token is missing');
  }

  const response = await axios.post(
    BULK_KEYWORD_SEARCH_URL,
    {
      keywords : keywords,
      location_code: locationCode,
      language_code: languageCode,
      include_subdomains : true,
      item_types : ["organic", "paid", "featured_snippet", "local_pack"], 
      limit : 100,
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