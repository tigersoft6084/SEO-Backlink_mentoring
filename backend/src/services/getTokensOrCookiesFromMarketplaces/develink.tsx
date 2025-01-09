import { DEVELINK_API_URL } from '@/global/marketplaceUrls';
import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces';


// Function to fetch cookie from Develink API using fetch
const fetchCookieFromDevelink = async (email: string, password: string): Promise<string> => {
  const formData = new URLSearchParams();
  formData.append('email', email);
  formData.append('password', password);

  try {
    const response = await fetch(DEVELINK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      redirect: 'manual',  // Prevent automatic redirects
    });

    if (!response.ok && response.status !== 302) {
      console.error('Response body:', await response.text());
      return '';
    }

    // Extract cookies from the response headers
    const setCookieHeader = response.headers.get('set-cookie') || '';

    const laravel_session = setCookieHeader.match(/laravel_session=[^;]+;/);

    if (laravel_session) {
      const extractedCookie = laravel_session[0].trim();
      return extractedCookie;
    } else {
      console.log("Laravel session token not found.");
      return '';
    }

  } catch (error: any) {
    console.error('Error fetching cookie from Develink:', error.message);
    throw new Error('Failed to fetch cookie from Develink.');
  }

};

// Main function to fetch credentials and compare website target
export const getCookieFromDevelink = async (): Promise<string | null> => {
  const credentials = await getCredentialsForMarketplaces();

  // Iterate through the credentials and fetch cookie for Develink
  for (const credential of credentials) {
    // Check if any value in websiteTarget array is 'Develink'
    const hasDevelinkTarget = credential.websiteTarget.some(target => target.value === 'Develink');

    if (hasDevelinkTarget) {
      console.log(`Found Develink credentials for ${credential.email}`);

      // Fetch cookie from Develink API
      if (credential.password) {
        const cookie = await fetchCookieFromDevelink(credential.email, credential.password);

        return cookie;
      }
    }
  }

  return null; // Return null if no Develink credentials found
};
