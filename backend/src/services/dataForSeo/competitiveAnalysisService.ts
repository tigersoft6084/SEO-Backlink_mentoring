
import { COMPETITIVE_ANALYSIS_SEARCH_URL } from '@/globals/globalURLs.ts';
import axios from 'axios';

// Helper function to validate domain


// Function to fetch competitors domain
export const fetchCompetitorsDomain = async (

        target: string,
        locationCode: number,
        languageCode: string,
        limit: number,
        offset : number

    ) => {

    const token = process.env.DATAFORSEO_API_TOKEN; // Access token from .env file

    const isValidDomain = (domain: string): boolean => {
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})$/;
        return domainRegex.test(domain);
    };

    if (!token) {
        throw new Error('API token is missing');
    }

    if (!target || !isValidDomain(target)) {
        throw new Error('Invalid target domain');
    }

    console.log(target, locationCode, languageCode, limit, offset);

    const response = await axios.post(

        COMPETITIVE_ANALYSIS_SEARCH_URL,

        {
            target,
            location_code: locationCode,
            language_code: languageCode,
            exclude_top_domains: false,
            ignore_synonyms: false,
            include_clickstream_data: false,
            limit,
            offset
        },

        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
};
