import { getCredentialsForMarketplaces } from '../getCredentialsForMarketplaces';
import { Ereferer_API_URL } from '@/global/marketplaceUrls';

// Function to fetch cookie from Ereferer API using fetch
const fetchCookieFromEreferer = async (email: string, password: string): Promise<string> => {
  const formData = new URLSearchParams();
  formData.append('login_form[_username]', email);
  formData.append('login_form[_password]', password);
  formData.append('_submit', 'Log in');

  try {
    const response = await fetch(Ereferer_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://en.ereferer.com/login',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        'Cookie': '_locale=en',  // Initial cookies if needed
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
    console.log(setCookieHeader)
    if(setCookieHeader){
      const cookies = extractPHPSESSID(setCookieHeader);
      return cookies || '';
    }

    return '';

  } catch (error: any) {
    console.error('Error fetching cookie from Ereferer:', error.message);
    throw new Error('Failed to fetch cookie from Ereferer.');
  }

};

// Function to extract PHPSESSID and transform into JSON
const extractPHPSESSID = (cookieString: string): string | null => {
  // Split the cookie string by semicolons
  const cookies = cookieString.split(';');

  // Loop through each cookie to find PHPSESSID
  for (const cookie of cookies) {

    const trimmedCookie = cookie.trim(); // Trim any whitespace
    if(trimmedCookie.startsWith('httponly')){
      const cookieParts = trimmedCookie.split(',');
      
      for(const part of cookieParts){
        const trimmedCookiePart = part.trim();
        if (trimmedCookiePart.startsWith('PHPSESSID=')) {
          return trimmedCookiePart;
        }
      }
    }
  }
  
  // Return null if PHPSESSID is not found
  return null;
};

// Main function to fetch credentials and compare website target
export const getCookieForEreferer = async (): Promise<string | null> => {
  const credentials = await getCredentialsForMarketplaces();

  // Iterate through the credentials and fetch cookie for Ereferer
  for (const credential of credentials) {
    // Check if any value in websiteTarget array is 'Ereferer'
    const hasErefererTarget = credential.websiteTarget.some(target => target.value === 'Ereferer');

    if (hasErefererTarget) {
      console.log(`Found Ereferer credentials for ${credential.email}`);

      // Fetch cookie from Ereferer API
      if (credential.password) {
        const cookie = await fetchCookieFromEreferer(credential.email, credential.password);

        return cookie;
      }
    }
  }

  return null; // Return null if no Ereferer credentials found
};
