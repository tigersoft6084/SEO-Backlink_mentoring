import { Mistergoodlink_API_URL } from "@/globals/globalURLs.ts";
import { getCredentialsForMarketplaces } from "../getCredentialsForMarketplaces.ts";
import { ErrorHandler } from "@/handlers/errorHandler.ts";


// Function to fetch cookie from Mistergoodlink API using fetch
const fetchCookieFromMistergoodlink = async (email: string, password: string): Promise<string> => {
  const formData = new URLSearchParams();
  formData.append('ShopCustomer[email]', email);
  formData.append('ShopCustomer[password]', password);

  try {
    const response = await fetch(Mistergoodlink_API_URL, {
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

    if(setCookieHeader){
      const cookies = extractPHPSESSID(setCookieHeader);
      return cookies || '';
    }

    return '';

  } catch (error) {
      const { errorDetails } = ErrorHandler.handle(error, "Error fetching validation data for Mistergoodlink");
      return errorDetails.context;
  }

};

// Function to extract PHPSESSID and transform into JSON
const extractPHPSESSID = (cookieString: string): string | null => {
  // Split the cookie string by semicolons
  const cookies = cookieString.split(';');

  // Loop through each cookie to find PHPSESSID
  for (const cookie of cookies) {

    const trimmedCookie = cookie.trim(); // Trim any whitespace

    if(trimmedCookie.startsWith('PHPSESSID=')){
      return trimmedCookie;
    }
  }

  // Return null if PHPSESSID is not found
  return null;
};

// Main function to fetch credentials and compare website target
export const getCookieFromMistergoodlink = async (): Promise<string | null> => {
  const credentials = await getCredentialsForMarketplaces();

  // Iterate through the credentials and fetch cookie for Mistergoodlink
  for (const credential of credentials) {
    // Check if any value in websiteTarget array is 'Mistergoodlink'
    const hasMistergoodlinkTarget = credential.websiteTarget.some((target: { value: string }) => target.value === 'Mistergoodlink');

    if (hasMistergoodlinkTarget) {
      console.log(`Found Mistergoodlink credentials for ${credential.email}`);

      // Fetch cookie from Mistergoodlink API
      if (credential.password) {
        const cookie = await fetchCookieFromMistergoodlink(credential.email, credential.password);

        return cookie;
      }
    }
  }

  return null; // Return null if no Mistergoodlink credentials found
};
