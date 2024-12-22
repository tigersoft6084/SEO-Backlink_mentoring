import { Payload } from 'payload';
import * as cookie from 'cookie'; // To parse cookies from Set-Cookie headers
import { config } from '../config/apiConfig';

interface AuthResponse {
  token?: string;   // Token-based authentication
  cookie?: string;  // Cookie-based authentication
  message?: string;
}

interface AuthenticateUrl {
  url: string;
  token?: string;
  cookie?: string;
  expiresAt?: string;
}

interface FetchOptions {
  headers: Record<string, string>;
  body: any;
  method: 'POST';
}

export async function authenticateAndSave(
  payload: Payload,
  email: string,
  password: string,
  urls: string[]
) {
  // Explicitly define the type of `updatedData` to include `authenticateUrls`
  let updatedData: { authenticateUrls: AuthenticateUrl[] } = { authenticateUrls: [] }; // Initialize with an empty array

  try {
    for (const url of urls) {
      console.log(`Authenticating ${email} and ${password} at URL: ${url}`);

      // Generate fetch options dynamically based on the URL
      const fetchOptions = getFetchOptions(url, email, password);

      // Perform the fetch request
      const response = await fetch(url, {
        ...fetchOptions,
        redirect: 'manual', // Prevent auto redirects to inspect cookies
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);

      // If the response is not OK, log and skip this URL
      if (!response.ok && response.status !== 302) {
        console.error(`Request failed with status ${response.status} for URL: ${url}`);
        console.error('Response body:', await response.text());
        continue;
      }

      // Check if the response is JSON
      const contentType = response.headers.get('Content-Type') || '';
      const isJsonResponse = contentType.includes('application/json');

      if (isJsonResponse) {
        const responseData: unknown = await response.json();
        console.log('Full API Response:', responseData);

        if (
          typeof responseData === 'object' &&
          responseData !== null &&
          ('token' in responseData || 'cookie' in responseData)
        ) {
          const data: AuthResponse = responseData as AuthResponse;

          if (data.token) {
            console.log('Received Token:', data.token);

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + config.token.expirationDays);

            updatedData.authenticateUrls.push({
              url,
              token: data.token,
              expiresAt: expiresAt.toISOString(),
            });

            console.log(`Successfully authenticated ${url} with token for ${email}`);
          }

          if (data.cookie) {
            console.log('Received Cookie:', data.cookie);

            updatedData.authenticateUrls.push({
              url,
              cookie: data.cookie,
            });

            console.log(`Successfully authenticated ${url} with cookie for ${email}`);
          }
        } else {
          console.error(`Invalid response from ${url}:`, responseData);
          throw new Error('No token or cookie received or invalid response format.');
        }
      } else {
        const setCookieHeader = response.headers.get('set-cookie'); // Use `get` to retrieve Set-Cookie header
        console.log('Raw Set-Cookie Header:', setCookieHeader);

        if (setCookieHeader) {
          const cookies = getValidCookies([setCookieHeader]); // Pass the set-cookie string in an array
          console.log('Parsed Cookies:', cookies);

          updatedData.authenticateUrls.push({
            url,
            cookie: JSON.stringify(cookies), // Store cookies as a JSON string
          });

          console.log(`Successfully authenticated ${url} with cookies for ${email}`);
        } else {
          console.error(`No cookie received from ${url}.`);
        }
      }
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    throw error;
  }

  return updatedData; // Return the updated data
}

// Function to generate fetch options dynamically based on the URL
function getFetchOptions(url: string, email: string, password: string): FetchOptions {
  if (url === 'https://en.ereferer.com/login_check') {
    const formData = new URLSearchParams();
    formData.append('login_form[_username]', email);
    formData.append('login_form[_password]', password);
    formData.append('_submit', 'Log in');

    return {
      method: 'POST',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://en.ereferer.com/login',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        'Cookie': '_locale=en', // Initial cookies if needed
      },
      body: formData,
    };
  }

  if (url === 'https://app.paper.club/api/authenticate') {
    return {
      method: 'POST',
      headers: {
        'Accept': 'application/ld+json',
        'Accept-Language': 'en',
        'Content-Type': 'application/ld+json',
        'Priority': 'u=1, i',
        'Sec-CH-UA': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'X-Powered-By': 'PaperClub',
        'X-Requested-With': 'PaperClub',
        'Cookie': '_gcl_au=1.1.316702908.1734720857; intercom-device-id-u27t7v5h=96957ba0-3765-4e08-b2a1-5fd683725134; axeptio_authorized_vendors=%2Cfacebook_pixel%2Cgoogle_analytics%2CActiveCampaign%2Cactivecampaign%2C; axeptio_all_vendors=%2Cfacebook_pixel%2Cgoogle_analytics%2CActiveCampaign%2Cactivecampaign%2C; axeptio_cookies={%22$$token%22:%228uo4uk64dmazn5y3jjif1b%22%2C%22$$date%22:%222024-12-20T18:55:15.412Z%22%2C%22$$cookiesVersion%22:{%22name%22:%22ga_fb_1637763626569%22%2C%22identifier%22:%22619e4a2a1fb0a24610833704%22}%2C%22facebook_pixel%22:true%2C%22google_analytics%22:true%2C%22ActiveCampaign%22:true%2C%22activecampaign%22:true%2C%22$$completed%22:true}; _ga=GA1.1.341908948.1734720917; _fbp=fb.1.1734720918151.220996632894566077; intercom-session-u27t7v5h=ZFdEeWJBSmZ4eWVmSDd5YkYxdG5LL3pzUzl5NGwxZFBWSWpvb2hQdFVsKzhjMFJSRDVzaXFONCswZklvcm4wZC0tSm9tMEhnTjRQQVJUU1pPaXlFbGNkZz09--d85edfe52763fc92ed6fa8d65b94e9f6febe1c0d; _ga_GHETS9BM7D=GS1.1.1734800603.6.0.1734800603.0.0.0',
        'Referer': 'https://app.paper.club/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify({ email, password }),
    };
  }

  // Default fetch options (if no URL match)
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };
}

// Function to parse valid cookies from Set-Cookie headers
function getValidCookies(setCookieHeaders: string[]): Record<string, string> {
  const validCookies: Record<string, string> = {};

  setCookieHeaders.forEach((setCookie) => {
    try {
      const parsedCookie = cookie.parse(setCookie);
      Object.entries(parsedCookie).forEach(([key, value]) => {
        if (value) validCookies[key] = value;
      });
    } catch (error) {
      console.error('Error parsing Set-Cookie header:', error);
    }
  });

  return validCookies;
}
